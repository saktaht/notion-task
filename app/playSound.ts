import { exec } from "child_process";
import os from "os";
import path from "path";
import WebSocket from "ws";

const ws = new WebSocket("ws://host.docker.internal:8080"); // ホストの WebSocket サーバーに接続

ws.on("open", () => {
  console.log("✅ WebSocket 接続成功");
});

ws.on("error", (error) => {
  console.error("❌ WebSocket エラー:", error);
});

export const playSound = () => {
  const soundPath = path.join(__dirname, "../public/demo.mp3");
  console.log(`🎵 全てのタスクが完了しました！再生ファイル: ${soundPath}`);

  let command = "";

  if (os.platform() === "darwin") {
    command = `afplay "${soundPath}"`; // macOS
  } else if (os.platform() === "win32") {
    command = `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync()`; // Windows
  } else if (os.platform() === "linux") {
    console.log("🔊 Docker からホストに音声再生リクエストを送信");
    
    // WebSocket が開いているときだけ送信
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: "playSound", file: "demo.mp3" }));
    } else {
      console.error("WebSocket 接続が確立されていません！");
    }
  } else {
    console.error("サポートされていない OS です。");
    return;
  }
  if (command !== ""){
    exec(command, (error) => {
      if (error) {
        console.error("Error playing sound:", error);
      }
    });
  } 
};