# 環境変数リファレンス

## バックエンド環境変数（backend/.env）

| 変数名 | 説明 | 例 | 取得元 |
|--------|------|-----|--------|
| NODE_ENV | 実行環境 | `production` | - |
| PORT | サーバーポート | `5000` | - |
| **Supabase** |
| SUPABASE_URL | SupabaseプロジェクトURL | `https://xxxxx.supabase.co` | Supabase > Settings > API |
| SUPABASE_ANON_KEY | Supabase公開キー | `eyJhbGc...` | Supabase > Settings > API |
| SUPABASE_SERVICE_KEY | Supabaseサービスキー | `eyJhbGc...` | Supabase > Settings > API |
| **Stripe** |
| STRIPE_SECRET_KEY | Stripeシークレットキー | `sk_test_...` | Stripe > 開発者 > APIキー |
| STRIPE_WEBHOOK_SECRET | Webhook署名シークレット | `whsec_...` | Stripe > 開発者 > Webhooks |
| STRIPE_SINGLE_GAME_PRICE_ID | 1試合価格ID | `price_...` | Stripe > 商品カタログ |
| STRIPE_GAME_BUNDLE_5_PRICE_ID | 5試合パック価格ID | `price_...` | Stripe > 商品カタログ |
| STRIPE_GAME_BUNDLE_10_PRICE_ID | 10試合パック価格ID | `price_...` | Stripe > 商品カタログ |
| STRIPE_GAME_BUNDLE_30_PRICE_ID | 30試合パック価格ID | `price_...` | Stripe > 商品カタログ |
| STRIPE_TEAM_PLAN_PRICE_ID | チームプラン価格ID | `price_...` | Stripe > 商品カタログ |
| **その他** |
| JWT_SECRET | JWT署名用シークレット | ランダムな文字列 | 自分で生成 |
| JWT_EXPIRES_IN | JWTの有効期限 | `7d` | - |
| FRONTEND_URL | フロントエンドURL | `https://your-app.vercel.app` | Vercelデプロイ後 |
| SOCKET_IO_CORS_ORIGIN | Socket.io CORS設定 | `https://your-app.vercel.app` | Vercelデプロイ後 |

## フロントエンド環境変数（frontend/.env.local）

| 変数名 | 説明 | 例 | 取得元 |
|--------|------|-----|--------|
| **Supabase** |
| NEXT_PUBLIC_SUPABASE_URL | SupabaseプロジェクトURL | `https://xxxxx.supabase.co` | Supabase > Settings > API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase公開キー | `eyJhbGc...` | Supabase > Settings > API |
| **API** |
| NEXT_PUBLIC_API_URL | バックエンドAPIのURL | `https://your-api.vercel.app` | Vercelデプロイ後 |
| **Stripe** |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe公開可能キー | `pk_test_...` | Stripe > 開発者 > APIキー |
| **アプリ設定** |
| NEXT_PUBLIC_APP_URL | アプリケーションのURL | `https://your-app.vercel.app` | Vercelデプロイ後 |
| NEXT_PUBLIC_APP_NAME | アプリケーション名 | `WePlay` | - |

## GitHub Secrets（GitHub Actions用）

| シークレット名 | 説明 | 取得方法 |
|----------------|------|----------|
| VERCEL_TOKEN | Vercel APIトークン | `npx vercel tokens create` |
| VERCEL_ORG_ID | Vercel組織ID | Vercel > Settings > General（個人の場合は不要） |
| VERCEL_BACKEND_PROJECT_ID | バックエンドプロジェクトID | Vercel > Backend Project > Settings |
| VERCEL_FRONTEND_PROJECT_ID | フロントエンドプロジェクトID | Vercel > Frontend Project > Settings |
| SUPABASE_PROJECT_REF | SupabaseプロジェクトRef | Supabase > Settings > General |
| SUPABASE_ACCESS_TOKEN | Supabase CLIトークン | `npx supabase login` で生成 |

## 環境変数生成のヒント

### JWT_SECRETの生成
```bash
# Node.jsで生成
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# またはopenssl
openssl rand -hex 32
```

### Supabase CLIトークンの取得
```bash
npx supabase login
cat ~/.supabase/access-token
```

### 本番環境への移行時の注意

1. **Stripe**
   - `sk_test_` → `sk_live_` に変更
   - `pk_test_` → `pk_live_` に変更
   - Webhookエンドポイントを本番用に再作成

2. **Supabase**
   - 本番用プロジェクトを別途作成することを推奨
   - RLSポリシーを再確認

3. **Vercel**
   - Production環境の環境変数を別途設定
   - Preview環境とProduction環境で異なる値を使用可能

## トラブルシューティング

### 環境変数が読み込まれない
- Next.jsは`NEXT_PUBLIC_`プレフィックスがないとクライアントサイドで使用不可
- Vercelでは環境変数変更後、再デプロイが必要
- ローカルでは`.env.local`ファイルの再読み込みにサーバー再起動が必要

### 型エラーが発生する
```typescript
// 環境変数の型定義を追加
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      // 他の環境変数...
    }
  }
}
```