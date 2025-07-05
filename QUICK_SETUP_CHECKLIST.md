# クイックセットアップチェックリスト

## 📝 事前準備
- [ ] GitHubアカウント
- [ ] プロジェクトのGitHubリポジトリ作成済み
- [ ] ローカルで`npm install`が成功することを確認

## 🗄️ Supabase（15分）

### 1. プロジェクト作成
- [ ] [supabase.com](https://supabase.com)でサインアップ
- [ ] 新規プロジェクト作成（Region: Tokyo推奨）
- [ ] データベースパスワードを安全に保存

### 2. データベース初期化
- [ ] SQL Editorを開く
- [ ] `backend/supabase/migrations/001_initial_schema.sql`を実行
- [ ] `backend/supabase/migrations/002_credits_system.sql`を実行

### 3. 認証設定
- [ ] Authentication > Providers > Email を有効化
- [ ] Authentication > URL Configuration で以下を設定：
  - Site URL: `https://あなたのフロントエンドURL`
  - Redirect URLs に追加:
    - `https://あなたのフロントエンドURL/auth/callback`

### 4. APIキー取得
- [ ] Settings > API から以下をコピー：
  ```
  Project URL: https://xxxxx.supabase.co
  anon key: eyJhbGc...（公開キー）
  service_role key: eyJhbGc...（秘密キー）
  ```

## 💳 Stripe（20分）

### 1. アカウント設定
- [ ] [stripe.com/jp](https://stripe.com/jp)でアカウント作成
- [ ] テスト環境で開始（本番は後で切り替え）

### 2. 商品登録
商品カタログから以下を作成：

| 商品名 | 価格 | タイプ | Price ID |
|--------|------|--------|----------|
| 試合パック（1試合） | ¥300 | 一回限り | price_xxx |
| 試合パック（5試合） | ¥1,200 | 一回限り | price_xxx |
| 試合パック（10試合） | ¥2,000 | 一回限り | price_xxx |
| 試合パック（30試合） | ¥5,000 | 一回限り | price_xxx |
| チームプラン | ¥1,000/月 | 定期購読 | price_xxx |

### 3. Webhook設定
- [ ] 開発者 > Webhooks > エンドポイントを追加
- [ ] URL: `https://あなたのバックエンドURL/api/webhook/stripe`
- [ ] イベント選択:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `customer.subscription.*`（全て）
- [ ] 署名シークレットをコピー: `whsec_xxx`

### 4. APIキー取得
- [ ] 開発者 > APIキー から：
  - 公開可能キー: `pk_test_xxx`
  - シークレットキー: `sk_test_xxx`

## ▲ Vercel（10分 × 2プロジェクト）

### 1. バックエンドプロジェクト
- [ ] [vercel.com](https://vercel.com)でGitHubログイン
- [ ] New Project > Import Git Repository
- [ ] 設定:
  - Root Directory: `backend`
  - Framework Preset: `Other`
- [ ] 環境変数を追加（全て入力）
- [ ] Deploy

### 2. フロントエンドプロジェクト  
- [ ] New Project > 同じリポジトリを選択
- [ ] 設定:
  - Root Directory: `frontend`
  - Framework Preset: `Next.js`
- [ ] 環境変数を追加（NEXT_PUBLIC_で始まるもの）
- [ ] Deploy

### 3. GitHub Actions用の設定
- [ ] 各プロジェクトのSettings > General > Project IDをコピー
- [ ] Vercel CLIでトークン生成:
  ```bash
  npx vercel login
  npx vercel tokens create
  ```

## 🔧 GitHub設定（5分）

リポジトリ > Settings > Secrets and variables > Actions:

```yaml
VERCEL_TOKEN: xxxxxxxxx
VERCEL_BACKEND_PROJECT_ID: prj_xxx
VERCEL_FRONTEND_PROJECT_ID: prj_xxx
SUPABASE_PROJECT_REF: xxxxx
SUPABASE_ACCESS_TOKEN: sbp_xxx
```

## ✅ 動作確認

### 1. デプロイ確認
- [ ] Vercelダッシュボードで両方のプロジェクトが✓
- [ ] フロントエンドURLにアクセスして表示確認
- [ ] バックエンドURL/healthにアクセスして応答確認

### 2. 機能テスト
- [ ] ユーザー登録（Supabase Auth）
- [ ] ログイン
- [ ] 試合作成（無料枠）
- [ ] Stripeテスト決済（カード: 4242 4242 4242 4242）

### 3. 自動デプロイテスト
- [ ] feature branchでPR作成
- [ ] プレビューURLがコメントされる
- [ ] mainにマージして本番デプロイ確認

## 🚨 よくあるエラーと対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| CORS error | URLの不一致 | Vercelの環境変数でFRONTEND_URLを確認 |
| 401 Unauthorized | APIキーの誤り | Supabaseのanon keyとservice keyを確認 |
| Stripe webhook failed | 署名の不一致 | Webhook secretが正しいか確認 |
| Build failed | Node version | package.jsonでengines指定を確認 |

## 💡 次のステップ

1. **本番移行時**
   - Stripeを本番モードに切り替え
   - Supabaseを有料プランに（必要に応じて）
   - カスタムドメインの設定

2. **セキュリティ強化**
   - Supabase RLSポリシーの見直し
   - Rate limitingの調整
   - エラー監視ツール導入（Sentry等）

3. **パフォーマンス最適化**
   - Vercel Analyticsの有効化
   - 画像最適化の設定
   - キャッシュ戦略の実装