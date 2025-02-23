import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASS),
  port: Number(process.env.DB_PORT),
});

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_status (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        is_completed BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log("✅ task_status テーブルを確認しました（なければ作成）");
  } catch (error) {
    console.error("❌ テーブル作成に失敗:", error);
  }
};

// アプリ起動時に実行
createTable();

const markTaskCompleted = async () => {
  try {
    await pool.query(`
      INSERT INTO task_status (date, is_completed)
      VALUES (CURRENT_DATE, TRUE)
      ON CONFLICT (date) DO UPDATE SET is_completed = TRUE;
    `);
    console.log("✅ 今日のタスクを完了として記録しました");
  } catch (error) {
    console.error("❌ タスク完了の記録に失敗:", error);
  }
};

const isTaskCompleted = async (): Promise<boolean> => {
  try {
    const result = await pool.query(`
      SELECT is_completed FROM task_status WHERE date = CURRENT_DATE;
    `);
    return result.rows.length > 0 && result.rows[0].is_completed;
  } catch (error) {
    console.error("❌ タスク完了の取得に失敗:", error);
    return false;
  }
};

export {markTaskCompleted, isTaskCompleted};