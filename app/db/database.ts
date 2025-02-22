// import { Pool } from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   // host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// const markTaskCompleted = async () => {
//   try {
//     await pool.query(`
//       INSERT INTO task_status (date, is_completed)
//       VALUES (CURRENT_DATE, TRUE)
//       ON CONFLICT (date) DO UPDATE SET is_completed = TRUE;
//     `);
//     console.log("✅ 今日のタスクを完了として記録しました");
//   } catch (error) {
//     console.error("❌ タスク完了の記録に失敗:", error);
//   }
// };

// const isTaskCompleted = async (): Promise<boolean> => {
//   try {
//     const result = await pool.query(`
//       SELECT is_completed FROM task_status WHERE date = CURRENT_DATE;
//     `);
//     return result.rows.length > 0 && result.rows[0].is_completed;
//   } catch (error) {
//     console.error("❌ タスク完了の取得に失敗:", error);
//     return false;
//   }
// };

// export {pool, markTaskCompleted, isTaskCompleted};