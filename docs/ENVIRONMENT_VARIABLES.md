# 環境変数リファレンス

このドキュメントは、WePlayアプリケーションで使用されるすべての環境変数をまとめたものです。

## GitHub Secrets（CI/CD用）

### Vercel関連

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `VERCEL_TOKEN` | Vercel APIアクセストークン | [Vercel Dashboard](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel組織ID | Vercel Dashboard > Team Settings |
| `VERCEL_PROJECT_ID` | VercelプロジェクトID | Vercel Dashboard > Project Settings |

### AWS関連（バックエンドデプロイ用）

| 変数名 | 説明 | 用途 |
|--------|------|------|
| `AWS_ACCESS_KEY_ID` | AWS IAMアクセスキー | ECS/ECRデプロイ |
| `AWS_SECRET_ACCESS_KEY` | AWS IAMシークレットキー | ECS/ECRデプロイ |

## フロントエンド環境変数

### 必須環境変数

| 変数名 | 説明 | 例 | 環境別 |
|--------|------|-----|--------|
| `NEXT_PUBLIC_API_URL` | バックエンドAPIのURL | `https://api.weplay.com` | Yes |
| `NEXT_PUBLIC_WS_URL` | WebSocketサーバーのURL | `wss://ws.weplay.com` | Yes |

### オプション環境変数

| 変数名 | 説明 | 例 | デフォルト |
|--------|------|-----|------------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics測定ID | `G-XXXXXXXXXX` | なし |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentryエラー追跡DSN | `https://xxx@sentry.io/xxx` | なし |
| `NEXT_PUBLIC_APP_NAME` | アプリケーション名 | `WePlay` | `WePlay` |
| `NEXT_PUBLIC_APP_URL` | アプリケーションのURL | `https://weplay.com` | 現在のURL |

### 環境別設定例

#### 本番環境（Production）
```env
NEXT_PUBLIC_API_URL=https://api.weplay.com
NEXT_PUBLIC_WS_URL=wss://api.weplay.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### 開発環境（Development）
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

## バックエンド環境変数

### データベース

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `MONGODB_URI` | MongoDB接続文字列 | `mongodb+srv://user:pass@cluster.mongodb.net/weplay` | Yes |
| `REDIS_URL` | Redis接続URL（スケーリング時） | `redis://localhost:6379` | No |

### 認証・セキュリティ

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `JWT_SECRET` | JWTトークン署名用シークレット | ランダムな文字列（32文字以上推奨） | Yes |
| `JWT_REFRESH_SECRET` | リフレッシュトークン用シークレット | ランダムな文字列（32文字以上推奨） | Yes |
| `JWT_EXPIRES_IN` | アクセストークンの有効期限 | `7d` | No |
| `JWT_REFRESH_EXPIRES_IN` | リフレッシュトークンの有効期限 | `30d` | No |
| `BCRYPT_ROUNDS` | パスワードハッシュのラウンド数 | `10` | No |

### AWS S3（ファイルアップロード）

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `AWS_ACCESS_KEY_ID` | AWS IAMアクセスキー | `AKIAXXXXXXXXXX` | Yes* |
| `AWS_SECRET_ACCESS_KEY` | AWS IAMシークレットキー | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | Yes* |
| `AWS_S3_BUCKET_NAME` | S3バケット名 | `weplay-uploads` | Yes* |
| `AWS_REGION` | AWSリージョン | `ap-northeast-1` | Yes* |

*画像アップロード機能を使用する場合のみ必須

### CORS・ネットワーク

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `CLIENT_URL` | フロントエンドのURL（CORS用） | `https://weplay.com` | Yes |
| `PORT` | サーバーのポート番号 | `5000` | No |

### アプリケーション設定

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `NODE_ENV` | 実行環境 | `production` / `development` | Yes |
| `LOG_LEVEL` | ログレベル | `info` / `debug` / `error` | No |
| `RATE_LIMIT_WINDOW_MS` | レート制限のウィンドウ（ミリ秒） | `900000` (15分) | No |
| `RATE_LIMIT_MAX_REQUESTS` | レート制限の最大リクエスト数 | `100` | No |

### メール送信（オプション）

| 変数名 | 説明 | 例 | 必須 |
|--------|------|-----|------|
| `SMTP_HOST` | SMTPサーバーホスト | `smtp.gmail.com` | No |
| `SMTP_PORT` | SMTPポート | `587` | No |
| `SMTP_USER` | SMTPユーザー名 | `noreply@weplay.com` | No |
| `SMTP_PASS` | SMTPパスワード | `password` | No |
| `EMAIL_FROM` | 送信元メールアドレス | `WePlay <noreply@weplay.com>` | No |

## ローカル開発環境のセットアップ

### 1. フロントエンド（`frontend/.env.local`）

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### 2. バックエンド（`backend/.env`）

```env
# Database
MONGODB_URI=mongodb://localhost:27017/weplay

# Security
JWT_SECRET=development-secret-change-in-production
JWT_REFRESH_SECRET=development-refresh-secret-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CLIENT_URL=http://localhost:3000

# Application
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

# AWS S3 (Optional for local development)
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_S3_BUCKET_NAME=weplay-dev
# AWS_REGION=ap-northeast-1
```

## セキュリティのベストプラクティス

1. **シークレットの生成**
   ```bash
   # 強力なランダム文字列の生成
   openssl rand -base64 32
   ```

2. **環境変数の管理**
   - 本番環境の値は決してコミットしない
   - `.env`ファイルは`.gitignore`に追加
   - 開発/ステージング/本番で異なる値を使用

3. **アクセス制限**
   - 環境変数へのアクセスは必要最小限に
   - 定期的にシークレットをローテーション

4. **監査ログ**
   - 環境変数の変更履歴を記録
   - 不正なアクセスを検知

## トラブルシューティング

### 環境変数が読み込まれない

1. `.env`ファイルの場所を確認
2. 変数名のタイポをチェック
3. プロセスを再起動

### CORS エラー

1. `CLIENT_URL`が正しく設定されているか確認
2. プロトコル（http/https）が一致しているか確認
3. ポート番号が含まれているか確認

### 認証エラー

1. `JWT_SECRET`が全環境で一致しているか確認
2. トークンの有効期限を確認
3. 時刻同期の問題を確認