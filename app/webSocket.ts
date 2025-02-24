import { exec } from "child_process";
import path from "path";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on('error', console.error);
  
  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if (data.action === "playSound") {
      const soundPath = path.resolve(__dirname, `../public/${data.file}`);
      console.log(`🎵 再生: ${soundPath}`);
      exec(`afplay "${soundPath}"`, (error) => {
        if (error) {
          console.error("❌ Error playing sound:", error);
        }
      });
    }
  });

  console.log("✅ WebSocket クライアントが接続しました");
});