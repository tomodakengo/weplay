# サービスセットアップガイド

## 1. Supabase のセットアップ

### アカウント作成とプロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. GitHubアカウントでサインアップ
3. 「New project」をクリック
4. プロジェクト情報を入力：
   - Organization: 個人または組織を選択
   - Project name: `weplay-production`
   - Database Password: 強力なパスワードを生成（保存しておく）
   - Region: `Northeast Asia (Tokyo)`を選択
   - Pricing Plan: Free tierでスタート

### データベース設定

1. **SQL Editor**を開く
2. 以下のマイグレーションファイルを順番に実行：
   ```sql
   -- backend/supabase/migrations/001_initial_schema.sql の内容を貼り付けて実行
   -- backend/supabase/migrations/002_credits_system.sql の内容を貼り付けて実行
   ```

### 認証設定

1. **Authentication** > **Providers**を開く
2. **Email**プロバイダーを有効化：
   - Enable Email provider: ON
   - Confirm email: ON（推奨）
   - Enable custom SMTP: 本番環境では設定推奨

3. **Authentication** > **URL Configuration**：
   - Site URL: `https://your-frontend.vercel.app`
   - Redirect URLs: 
     ```
     https://your-frontend.vercel.app/auth/callback
     https://your-frontend.vercel.app/auth/reset-password
     ```

### ストレージ設定

1. **Storage**を開く
2. バケットは自動的に作成される（マイグレーションで設定済み）
3. **Policies**タブで以下を確認：
   - `avatars`バケット: 公開読み取り可能
   - `game-images`バケット: 公開読み取り可能

### API設定の取得

1. **Settings** > **API**を開く
2. 以下の値をコピー：
   ```
   Project URL: https://xxxxx.supabase.co
   Anon/Public key: eyJhbGc...（公開キー）
   Service role key: eyJhbGc...（サービスキー - 秘密）
   ```

### 環境変数の準備

```env
SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...（Anon key）
SUPABASE_ANON_KEY=eyJhbGc...（Anon key）
SUPABASE_SERVICE_KEY=eyJhbGc...（Service role key）
```

## 2. Stripe のセットアップ

### アカウント作成

1. [Stripe](https://stripe.com/jp) にアクセス
2. アカウントを作成（メールアドレスで登録）
3. ビジネス情報を入力（後で変更可能）

### 商品と価格の作成

1. **商品**メニューを開く
2. 以下の商品を作成：

#### 試合パック（1試合）
- 商品名: `試合パック（1試合）`
- 説明: `1試合分のプレミアム機能が利用可能`
- 価格: `¥300`（一回限り）
- Price ID をメモ: `price_xxx`

#### 試合パック（5試合）
- 商品名: `試合パック（5試合）`
- 説明: `5試合分のプレミアム機能が利用可能（20%お得）`
- 価格: `¥1,200`（一回限り）
- Price ID をメモ: `price_xxx`

#### 試合パック（10試合）
- 商品名: `試合パック（10試合）`
- 説明: `10試合分のプレミアム機能が利用可能（33%お得）`
- 価格: `¥2,000`（一回限り）
- Price ID をメモ: `price_xxx`

#### 試合パック（30試合）
- 商品名: `試合パック（30試合）`
- 説明: `30試合分のプレミアム機能が利用可能（44%お得）`
- 価格: `¥5,000`（一回限り）
- Price ID をメモ: `price_xxx`

#### チームプラン
- 商品名: `チームプラン`
- 説明: `チーム機能が無制限に利用可能`
- 価格: `¥1,000/月`（定期購読）
- Price ID をメモ: `price_xxx`

### Webhook設定

1. **開発者** > **Webhook**を開く
2. **エンドポイントを追加**：
   - エンドポイントURL: `https://your-backend.vercel.app/api/webhook/stripe`
   - リッスンするイベント:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
3. **署名シークレット**をコピー

### APIキーの取得

1. **開発者** > **APIキー**を開く
2. 以下をコピー：
   - 公開可能キー: `pk_test_xxx`（テスト）/ `pk_live_xxx`（本番）
   - シークレットキー: `sk_test_xxx`（テスト）/ `sk_live_xxx`（本番）

### 環境変数の準備

```env
# バックエンド用
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SINGLE_GAME_PRICE_ID=price_xxx
STRIPE_GAME_BUNDLE_5_PRICE_ID=price_xxx
STRIPE_GAME_BUNDLE_10_PRICE_ID=price_xxx
STRIPE_GAME_BUNDLE_30_PRICE_ID=price_xxx
STRIPE_TEAM_PLAN_PRICE_ID=price_xxx

# フロントエンド用
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### テストカード

開発環境でのテスト用：
- カード番号: `4242 4242 4242 4242`
- 有効期限: 将来の任意の日付
- CVC: 任意の3桁
- 郵便番号: 任意の5桁

## 3. Vercel のセットアップ

### アカウント作成

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでサインイン
3. チームを作成（任意）

### バックエンドプロジェクト

1. **Add New** > **Project**
2. GitHubリポジトリをインポート
3. **Configure Project**：
   - Project Name: `weplay-backend`
   - Framework Preset: `Other`
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**を設定：
   ```
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=xxx
   SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_KEY=xxx
   STRIPE_SECRET_KEY=xxx
   STRIPE_WEBHOOK_SECRET=xxx
   STRIPE_SINGLE_GAME_PRICE_ID=xxx
   STRIPE_GAME_BUNDLE_5_PRICE_ID=xxx
   STRIPE_GAME_BUNDLE_10_PRICE_ID=xxx
   STRIPE_GAME_BUNDLE_30_PRICE_ID=xxx
   STRIPE_TEAM_PLAN_PRICE_ID=xxx
   JWT_SECRET=xxx（ランダムな文字列を生成）
   FRONTEND_URL=https://your-frontend.vercel.app
   SOCKET_IO_CORS_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**をクリック

### フロントエンドプロジェクト

1. **Add New** > **Project**
2. 同じGitHubリポジトリをインポート
3. **Configure Project**：
   - Project Name: `weplay-frontend`
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`

4. **Environment Variables**を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=xxx
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   NEXT_PUBLIC_API_URL=https://weplay-backend.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
   NEXT_PUBLIC_APP_URL=https://weplay-frontend.vercel.app
   NEXT_PUBLIC_APP_NAME=WePlay
   ```

5. **Deploy**をクリック

### プロジェクトIDの取得（GitHub Actions用）

1. 各プロジェクトの**Settings** > **General**
2. **Project ID**をコピー
3. Vercel CLIでトークンを生成：
   ```bash
   npm i -g vercel
   vercel login
   vercel tokens create
   ```

### GitHub Secretsの設定

GitHubリポジトリの**Settings** > **Secrets and variables** > **Actions**：

```
VERCEL_TOKEN=xxx（生成したトークン）
VERCEL_ORG_ID=team_xxx（Personal Accountの場合は不要）
VERCEL_BACKEND_PROJECT_ID=prj_xxx
VERCEL_FRONTEND_PROJECT_ID=prj_xxx
SUPABASE_PROJECT_REF=xxxxx（SupabaseプロジェクトのReference ID）
SUPABASE_ACCESS_TOKEN=xxx（Supabase CLIのアクセストークン）
```

## 4. ドメイン設定（オプション）

### カスタムドメインの設定

1. **Vercel**の各プロジェクトで：
   - Settings > Domains
   - Add Domain
   - `api.weplay.app`（バックエンド）
   - `weplay.app`、`www.weplay.app`（フロントエンド）

2. **DNS設定**：
   - Aレコード: `@` → `76.76.21.21`
   - CNAMEレコード: `www` → `cname.vercel-dns.com`
   - CNAMEレコード: `api` → `cname.vercel-dns.com`

3. **SSL証明書**：
   - Vercelが自動的に発行・更新

## 5. 本番環境への切り替え

### Stripe
1. 本番環境のAPIキーに切り替え
2. Webhookエンドポイントを本番URLに更新
3. 実際の商品価格を設定

### Supabase
1. Pro以上のプランにアップグレード（必要に応じて）
2. カスタムドメインの設定
3. バックアップポリシーの設定

### Vercel
1. プロダクション環境の環境変数を更新
2. アナリティクスを有効化
3. エラー監視ツールの設定（Sentry等）

## チェックリスト

- [ ] Supabaseのデータベースマイグレーション完了
- [ ] Supabaseの認証プロバイダー設定
- [ ] Stripeの商品・価格作成完了
- [ ] StripeのWebhook設定完了
- [ ] Vercelの環境変数設定完了
- [ ] GitHub Secrets設定完了
- [ ] フロントエンドとバックエンドの疎通確認
- [ ] Stripe決済のテスト完了
- [ ] 認証フローのテスト完了

## トラブルシューティング

### よくある問題

1. **CORS エラー**
   - Vercelの環境変数で`FRONTEND_URL`が正しく設定されているか確認
   - Supabaseの認証設定でRedirect URLsが設定されているか確認

2. **Stripe Webhook エラー**
   - Webhook署名シークレットが正しいか確認
   - エンドポイントURLが正しいか確認
   - ローカルテストは`stripe listen`を使用

3. **Supabase認証エラー**
   - Service RoleキーとAnon Keyを間違えていないか確認
   - RLSポリシーが正しく設定されているか確認

4. **Vercelデプロイエラー**
   - Node.jsバージョンが18.x以上か確認
   - Root Directoryが正しく設定されているか確認