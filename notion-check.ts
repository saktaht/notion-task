import axios from "axios";
import dotenv from "dotenv";
import { exec } from "child_process";
// import {pool, markTaskCompleted, isTaskCompleted} from "./db/database"

dotenv.config();

// ✅ Notion API 設定
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// 今日の日付を取得（YYYY-MM-DD 形式）/ "2025-02-23T05:35:50.123Z"をTを基準に分割し、日付部分だけを取り出す
const getTodayDateJST = () => {
  const now = new Date();
  now.setHours(now.getHours() + 9); // JSTに変換
  return now.toISOString().split("T")[0];
};

console.log(getTodayDateJST()); // "2025-02-23"

// ✅ 音を鳴らす関数
// const playSound = () => {
//   console.log("🎵 全てのタスクが完了しました！");
//   exec("afplay success.mp3", (error) => {
//     if (error) console.error("Error playing sound:", error);
//   });
// };

// ✅ Notion API から「今日のタスク」を取得
const fetchTodayTasks = async () => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        filter: {
          property: "実施予定日",
          date: {
            equals: getTodayDateJST(),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📌 Notion API Response:", JSON.stringify(response.data, null, 2));

    return response.data.results;
  } catch (error) {
    console.error("Error fetching Notion tasks:", error);
    return [];
  }
};



// ✅ タスクの完了状況をチェック
const checkTasks = async () => {
  const tasks = await fetchTodayTasks();

  if (tasks.length === 0) {
    console.log("📅 今日のタスクはありません。");
    return;
  }

  // 🔍 タスクの「Status」プロパティをチェック
  const incompleteTasks = tasks.filter((task: any) => {
    const isChecked = task.properties?.完了?.checkbox;
    return isChecked !== true; // チェックされていない（未完了）タスクを抽出
});

  if (incompleteTasks.length === 0) {
    // playSound();
    console.log("タスク完了!!!")
  } else {
    console.log(`⏳ 未完了タスク: ${incompleteTasks.length} 件`);
  }
};

// ✅ 30秒ごとにチェック
setInterval(checkTasks, 5000);



// const checkTasks = async () => {
//   if (await isTaskCompleted()) {
//     console.log("🎉 今日のタスクはすでに完了済み");
//     if (intervalId) clearInterval(intervalId);
//     restartAtMidnight();
//     return;
//   }

//   const tasks = await fetchTodayTasks();
//   const incompleteTasks = tasks.filter((task: any) => {
//     const isChecked = task.properties?.完了?.checkbox;
//     return isChecked !== true;
//   });

//   if (incompleteTasks.length === 0) {
//     console.log("🎉 タスク完了!!!");
//     await markTaskCompleted();
//     if (intervalId) clearInterval(intervalId);
//     restartAtMidnight();
//   } else {
//     console.log(`⏳ 未完了タスク: ${incompleteTasks.length} 件`);
//   }
// };

// const restartAtMidnight = () => {
//   const now = new Date();
//   const tomorrow = new Date(now);
//   tomorrow.setDate(now.getDate() + 1);
//   tomorrow.setHours(0, 0, 0, 0);

//   const delay = tomorrow.getTime() - now.getTime();
//   console.log(`⏳ 次のチェックは ${delay / 1000 / 60} 分後`);

//   setTimeout(() => {
//     intervalId = setInterval(checkTasks, 5000);
//   }, delay);
// };

// let intervalId: NodeJS.Timeout | null = setInterval(checkTasks, 5000);
