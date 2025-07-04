# Vercelデプロイメントガイド

## 概要

WePlayアプリケーションをVercelにデプロイするための包括的なガイドです。

## アーキテクチャ

- **Frontend**: Next.js → Vercel
- **Backend**: Express.js → Railway/Render（推奨）
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3
- **Real-time**: Socket.IO

## 必要なGitHub Secrets

以下のSecretsをGitHubリポジトリに設定してください：

### Vercel関連
```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here
VERCEL_PROJECT_ID=your_vercel_project_id_here
```

### バックエンドデプロイ（オプション）
```
RAILWAY_TOKEN=your_railway_token_here
```

## Vercel環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### Frontend（Next.js）環境変数
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_ENV=production
```

### Backend環境変数（Railway/Render等）
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weplay
JWT_SECRET=your_jwt_secret_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=weplay-uploads
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

## セットアップ手順

### 1. Vercelの設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. Framework Preset: Next.js
5. Root Directory: そのまま（モノレポ対応）

### 2. GitHub Secretsの設定

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. 上記の必要なSecretsを追加

### 3. Vercel CLI設定（ローカル）

```bash
npm install -g vercel
vercel login
vercel link
```

### 4. 環境変数の設定

```bash
# Vercelに環境変数を設定
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_SOCKET_URL production
vercel env add NEXT_PUBLIC_APP_ENV production
```

## 外部サービス連携

### MongoDB Atlas
1. [MongoDB Atlas](https://cloud.mongodb.com/)でクラスターを作成
2. データベースユーザーを作成
3. Network Access で IP アドレスを設定（0.0.0.0/0 for production）
4. 接続文字列を `MONGODB_URI` に設定

### AWS S3
1. AWS IAM でプログラムアクセス用のユーザーを作成
2. S3バケットを作成
3. CORS設定を追加：
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-app.vercel.app"],
    "ExposeHeaders": []
  }
]
```

### バックエンドデプロイ（Railway推奨）

1. [Railway](https://railway.app/)でアカウント作成
2. 新しいプロジェクトを作成
3. GitHubリポジトリを接続
4. Root Directory: `backend`
5. Build Command: `npm run build`
6. Start Command: `npm start`

### Socket.IO設定

バックエンドで以下のCORS設定を確認：
```javascript
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});
```

## デプロイフロー

1. `main` ブランチへのプッシュ
2. GitHub Actionsが自動実行
3. テスト・ビルド・デプロイが順次実行
4. フロントエンドがVercelに自動デプロイ
5. バックエンドがRailwayに自動デプロイ（設定済みの場合）

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   - 依存関係の問題: `npm ci` を実行
   - TypeScriptエラー: 型定義を確認

2. **環境変数エラー**
   - フロントエンド: `NEXT_PUBLIC_` プレフィックスを確認
   - バックエンド: サーバー側環境変数を確認

3. **CORS エラー**
   - バックエンドのCORS設定を確認
   - フロントエンドのAPIエンドポイントを確認

4. **Socket.IO接続エラー**
   - WebSocketのプロトコル（ws/wss）を確認
   - サーバーのSocket.IO設定を確認

### ログ確認

```bash
# Vercelデプロイログ
vercel logs

# Railway/Renderログ
# 各プラットフォームのダッシュボードで確認
```

## 最適化

### パフォーマンス
- Next.js の Image Optimization 使用
- Static Generation の活用
- Bundle Analyzer での最適化

### セキュリティ
- 環境変数の適切な管理
- HTTPS の強制
- レート制限の設定

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)