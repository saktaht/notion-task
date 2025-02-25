# Notionのタスクが全て完了したら音が鳴るだけのアプリ(nodeだけの実装になりそう)
## 使い方
web socketを起動する(Linuxでは完了音を出すことができないため)
```bash
npx ts-node app/webSocket.ts
```
その後、docker compose upを行う
## ファイル構成(app)
```
app
├── db
│   └── database.ts データベースにタスクが全て完了した場合保存
├── notion-check.ts Notion APIからデータを取ってきたり、どれくらいタスクが残っているか確認する
├── playSound.ts 音を鳴らす部分
├── types
│   └── notion.ts Notion DBの型定義
└── webSocket.ts dockerからMacOSへ音を鳴らすようJSONで命令する
```
## docker
docker compose up --build --detach

docker compose down --rmi all -v

## テスト方法
dockerないない
docker exec -it notion-app /bin/bash


## どうしてnodeを使うのか
Notion APIを使って開発したくて、NotionがNodeで動いているらしいから 