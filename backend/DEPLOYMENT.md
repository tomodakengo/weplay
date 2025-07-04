# WePlay Backend デプロイメント ガイド

## 必要な外部サービス

- **Supabase**: データベース、認証、ストレージ
- **Stripe**: 課金処理
- **Vercel**: バックエンドホスティング

## セットアップ手順

### 1. Supabase プロジェクトの設定

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editorで `supabase/migrations/001_initial_schema.sql` を実行
3. プロジェクト設定から以下の値を取得：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### 2. Stripe アカウントの設定

1. [Stripe](https://stripe.com) でアカウントを作成
2. 商品と価格を作成：
   - 月額プラン（500円）
   - 年額プラン（5000円）
3. ダッシュボードから以下の値を取得：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_MONTHLY_PRICE_ID`
   - `STRIPE_YEARLY_PRICE_ID`
4. Webhook エンドポイントを設定：
   - エンドポイントURL: `https://your-backend-url/api/webhook/stripe`
   - イベント: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - `STRIPE_WEBHOOK_SECRET` を取得

### 3. Vercel へのデプロイ

1. Vercel CLIをインストール：
   ```bash
   npm i -g vercel
   ```

2. プロジェクトのビルド：
   ```bash
   cd backend
   npm install
   npm run build
   ```

3. Vercelにデプロイ：
   ```bash
   vercel
   ```

4. 環境変数を設定（Vercelダッシュボード）：
   ```
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_MONTHLY_PRICE_ID=your_monthly_price_id
   STRIPE_YEARLY_PRICE_ID=your_yearly_price_id
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url
   SOCKET_IO_CORS_ORIGIN=https://your-frontend-url
   ```

### 4. プロダクション設定

1. Supabase RLS（Row Level Security）ポリシーの確認
2. Stripe Webhookエンドポイントのテスト
3. CORSの設定確認

## デプロイコマンド

```bash
# 開発環境
npm run dev

# ビルド
npm run build

# プロダクション起動
npm start

# Vercelデプロイ
vercel --prod
```

## トラブルシューティング

### Socket.io接続エラー
- `SOCKET_IO_CORS_ORIGIN` が正しく設定されているか確認
- Vercelの関数タイムアウト設定を確認

### Supabase認証エラー
- サービスキーが正しく設定されているか確認
- RLSポリシーが適切に設定されているか確認

### Stripeエラー
- Webhookシークレットが正しいか確認
- 価格IDが正しく設定されているか確認