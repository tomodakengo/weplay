# WePlay 統合デプロイメントガイド

## アーキテクチャ概要

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Supabase      │
│   (Next.js)     │     │   (Express)     │     │  (Database)     │
│   on Vercel     │     │   on Vercel     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                         │
                                ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │     Stripe      │     │   Supabase      │
                        │   (Payment)     │     │   (Storage)     │
                        └─────────────────┘     └─────────────────┘
```

## 前提条件

- GitHubアカウント
- Vercelアカウント（フロントエンド・バックエンド両方のホスティング）
- Supabaseアカウント
- Stripeアカウント
- Node.js 18.x以上

## 初期セットアップ手順

### 1. Supabaseプロジェクトのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで以下を実行：
   ```bash
   backend/supabase/migrations/001_initial_schema.sql
   ```
3. API設定から以下の値を取得：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

### 2. Stripeアカウントのセットアップ

1. [Stripe](https://stripe.com)でアカウントを作成
2. 商品と価格を設定：
   - 試合パック: 300円/試合
   - 5試合パック: 1,200円
   - 10試合パック: 2,000円
   - 30試合パック: 5,000円
   - チームプラン: 1,000円/月
3. APIキーを取得：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
4. 各価格のPrice IDを取得

### 3. Vercelプロジェクトのセットアップ

#### バックエンドプロジェクト

1. [Vercel](https://vercel.com)でプロジェクトを作成
2. GitHubリポジトリと連携
3. Root Directoryを`backend`に設定
4. 環境変数を設定（Production & Preview）：
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=xxx
   SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_KEY=xxx
   STRIPE_SECRET_KEY=xxx
   STRIPE_WEBHOOK_SECRET=xxx
   JWT_SECRET=xxx
   FRONTEND_URL=https://your-frontend.vercel.app
   SOCKET_IO_CORS_ORIGIN=https://your-frontend.vercel.app
   ```

#### フロントエンドプロジェクト

1. Vercelで新しいプロジェクトを作成
2. GitHubリポジトリと連携
3. Root Directoryを`frontend`に設定
4. 環境変数を設定（Production & Preview）：
   ```
   NEXT_PUBLIC_SUPABASE_URL=xxx
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
   NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
   ```

### 4. GitHub Secretsの設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下を設定：

```
VERCEL_TOKEN                    # Vercel CLIトークン
VERCEL_ORG_ID                   # Vercel組織ID
VERCEL_BACKEND_PROJECT_ID       # バックエンドプロジェクトID
VERCEL_FRONTEND_PROJECT_ID      # フロントエンドプロジェクトID
SUPABASE_PROJECT_REF            # SupabaseプロジェクトリファレンスID
SUPABASE_ACCESS_TOKEN           # Supabaseアクセストークン
```

### 5. Stripe Webhookの設定

1. Stripe Dashboardでwebhookエンドポイントを追加：
   - URL: `https://your-backend.vercel.app/api/webhook/stripe`
   - イベント：
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `customer.subscription.created`
     - `customer.subscription.updated`
2. Webhook signing secretを取得して環境変数に設定

## デプロイフロー

### 自動デプロイ（推奨）

1. **機能開発**
   ```bash
   git checkout -b feature/new-feature
   # 開発作業
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Pull Request作成**
   - PRを作成すると自動的にプレビュー環境がデプロイされる
   - PRコメントにプレビューURLが投稿される

3. **本番デプロイ**
   - PRがmainブランチにマージされると自動的に本番環境にデプロイ

### 手動デプロイ

```bash
# バックエンドのデプロイ
cd backend
vercel --prod

# フロントエンドのデプロイ
cd frontend
vercel --prod
```

## 環境別の設定

### 開発環境
- バックエンド: `http://localhost:5000`
- フロントエンド: `http://localhost:3000`
- Supabase: ローカルエミュレータまたは開発用プロジェクト

### ステージング環境（PRプレビュー）
- Vercelの自動プレビューURL
- 本番と同じ外部サービスの開発インスタンス

### 本番環境
- バックエンド: `https://weplay-api.vercel.app`
- フロントエンド: `https://weplay.vercel.app`
- カスタムドメインの設定も可能

## モニタリングとログ

### Vercel
- Functions Log: リアルタイムログの確認
- Analytics: パフォーマンスメトリクス

### Supabase
- Database Logs: SQLクエリログ
- Auth Logs: 認証イベント
- Storage Logs: ファイル操作ログ

### Stripe
- Dashboard: 支払いイベントの確認
- Webhook Logs: Webhook配信状況

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   - 環境変数の`FRONTEND_URL`と`SOCKET_IO_CORS_ORIGIN`を確認

2. **認証エラー**
   - Supabaseの環境変数が正しく設定されているか確認
   - JWTシークレットが一致しているか確認

3. **デプロイ失敗**
   - Vercelのビルドログを確認
   - Node.jsバージョンの互換性を確認

4. **Webhook エラー**
   - Stripe Webhook Secretが正しいか確認
   - エンドポイントURLが正しいか確認

## セキュリティチェックリスト

- [ ] 環境変数が本番と開発で分離されている
- [ ] データベースRLSポリシーが適切に設定されている
- [ ] APIキーがフロントエンドコードに含まれていない
- [ ] HTTPSが有効になっている
- [ ] CORSが適切に設定されている

## バックアップとリカバリ

### データベース
- Supabaseの自動バックアップ機能を利用
- 定期的なデータエクスポート

### コード
- GitHubでバージョン管理
- タグによるリリース管理

## スケーリング

### Vercel
- 自動スケーリング対応
- Edge Functionsでグローバル配信

### Supabase
- 必要に応じてプランをアップグレード
- Connection Poolingの設定

## 連絡先

問題が発生した場合は以下に連絡：
- 技術サポート: support@weplay.app
- 緊急対応: emergency@weplay.app