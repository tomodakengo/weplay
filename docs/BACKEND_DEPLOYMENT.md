# バックエンドデプロイメントガイド

## 概要

WePlayのバックエンドサーバー（Express + Socket.io）をデプロイするためのガイドです。WebSocketをサポートする必要があるため、適切なホスティングサービスを選択する必要があります。

## 推奨デプロイオプション

### Option 1: Railway（推奨）

Railway は WebSocket をネイティブサポートし、簡単にデプロイできます。

#### セットアップ手順

1. [Railway](https://railway.app) でアカウントを作成
2. New Project → Deploy from GitHub repo を選択
3. リポジトリを選択し、`backend` ディレクトリを指定

#### 環境変数の設定

Railwayダッシュボードで以下の環境変数を設定：

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weplay

# JWT認証
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=weplay-images
AWS_REGION=ap-northeast-1

# Socket.io CORS
CLIENT_URL=https://your-app.vercel.app

# その他
NODE_ENV=production
PORT=3000
```

#### Railwayのデプロイ設定

`railway.json` をバックエンドディレクトリに作成：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

### Option 2: Render

Render も WebSocket をサポートし、無料プランがあります。

#### セットアップ手順

1. [Render](https://render.com) でアカウントを作成
2. New → Web Service を選択
3. GitHubリポジトリを接続
4. 以下の設定を行う：
   - Name: `weplay-backend`
   - Root Directory: `backend`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

#### 環境変数の設定

Render ダッシュボードで環境変数を設定（Railwayと同じ）

### Option 3: AWS ECS with ALB

本格的な本番環境向けの選択肢です。

#### 必要なAWSリソース

1. **ECS Cluster**: Fargateを使用
2. **Task Definition**: バックエンドコンテナの定義
3. **Application Load Balancer**: WebSocketサポート有効化
4. **Target Group**: スティッキーセッション有効化

#### Dockerファイルの作成

`backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
RUN npm ci --only=production

# ソースコードのコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# ポートの公開
EXPOSE 3000

# アプリケーションの起動
CMD ["node", "dist/index.js"]
```

#### GitHub Actions デプロイワークフロー

`.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to AWS ECS

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'

env:
  AWS_REGION: ap-northeast-1
  ECR_REPOSITORY: weplay-backend
  ECS_SERVICE: weplay-backend-service
  ECS_CLUSTER: weplay-cluster
  ECS_TASK_DEFINITION: weplay-backend-task
  CONTAINER_NAME: weplay-backend

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Fill in the new image ID in the Amazon ECS task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: backend/ecs-task-definition.json
          container-name: ${{ env.CONTAINER_NAME }}
          image: ${{ steps.build-image.outputs.image }}

      - name: Deploy Amazon ECS task definition
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```

## WebSocket設定の重要ポイント

### 1. CORS設定

`backend/src/index.ts` でCORS設定を確認：

```typescript
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  }
});
```

### 2. ヘルスチェック

WebSocketサーバーのヘルスチェックエンドポイント：

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    websocket: io.engine.clientsCount
  });
});
```

### 3. スケーリング考慮事項

複数インスタンスで実行する場合：

1. **Redis Adapter** の使用：
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

2. **スティッキーセッションの有効化**（ロードバランサー設定）

## 監視とログ

### ログ収集

1. **CloudWatch Logs**（AWS）
2. **LogDNA** / **Datadog**（Railway/Render）

### メトリクス監視

- WebSocket接続数
- APIレスポンスタイム
- エラー率
- CPU/メモリ使用率

### アラート設定

- 5xx エラー率が閾値を超えた場合
- WebSocket接続数が異常に増減した場合
- レスポンスタイムが遅い場合

## セキュリティチェックリスト

- [ ] 環境変数が適切に設定されている
- [ ] HTTPSが有効になっている
- [ ] レート制限が設定されている
- [ ] 認証トークンの有効期限が適切
- [ ] MongoDBの接続がSSL/TLSを使用
- [ ] AWS S3バケットのアクセス権限が最小限
- [ ] CORSが本番URLのみ許可されている

## トラブルシューティング

### WebSocket接続できない

1. ロードバランサーのWebSocketサポートを確認
2. CORS設定を確認
3. ファイアウォール/セキュリティグループの設定確認

### パフォーマンス問題

1. MongoDB のインデックスを最適化
2. Socket.io のトランスポート設定を確認
3. 適切なインスタンスサイズを選択

### デプロイ失敗

1. ビルドログを確認
2. 環境変数の欠落をチェック
3. package.json のスクリプトを確認