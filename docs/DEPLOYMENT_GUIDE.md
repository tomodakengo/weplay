# Vercelデプロイメントガイド

## 概要

このドキュメントでは、WePlayアプリケーションをVercelにデプロイするための手順と設定を説明します。

## 前提条件

1. GitHubリポジトリへのアクセス権限
2. Vercelアカウント
3. 必要な外部サービスのアカウント（MongoDB Atlas、AWS S3等）

## セットアップ手順

### 1. Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. "New Project"をクリック
3. GitHubリポジトリをインポート
4. Framework Presetとして"Next.js"を選択
5. Root Directoryを`.`（ルート）に設定（vercel.jsonで制御するため）

### 2. GitHub Secretsの設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定：

#### 必須のVercel関連シークレット

| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `VERCEL_TOKEN` | Vercel APIトークン | Vercel Dashboard > Account Settings > Tokens |
| `VERCEL_ORG_ID` | Vercel組織ID | Vercel Dashboard > Team Settings > General |
| `VERCEL_PROJECT_ID` | VercelプロジェクトID | Vercel Dashboard > Project Settings > General |

#### アプリケーション環境変数

##### 本番環境（Production）
| Secret名 | 説明 | 例 |
|----------|------|-----|
| `NEXT_PUBLIC_API_URL_PROD` | 本番APIエンドポイント | `https://api.weplay.com` |
| `NEXT_PUBLIC_WS_URL_PROD` | 本番WebSocketエンドポイント | `wss://ws.weplay.com` |

##### 開発環境（Development/Preview）
| Secret名 | 説明 | 例 |
|----------|------|-----|
| `NEXT_PUBLIC_API_URL_DEV` | 開発APIエンドポイント | `https://api-dev.weplay.com` |
| `NEXT_PUBLIC_WS_URL_DEV` | 開発WebSocketエンドポイント | `wss://ws-dev.weplay.com` |

##### その他の環境変数
| Secret名 | 説明 | 必須 |
|----------|------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics測定ID | いいえ |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentryエラー監視DSN | いいえ |

### 3. 外部サービスの連携

#### MongoDB Atlas

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)でクラスターを作成
2. データベースユーザーを作成
3. ネットワークアクセスでVercelのIPアドレスを許可（0.0.0.0/0 for 全アクセス許可）
4. 接続文字列を取得し、バックエンドの環境変数として設定

#### AWS S3（画像アップロード用）

1. AWS S3バケットを作成
2. IAMユーザーを作成し、S3バケットへのアクセス権限を付与
3. アクセスキーとシークレットキーを取得
4. バックエンドの環境変数として設定：
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
   - `AWS_REGION`

#### Socket.io（リアルタイム通信）

バックエンドサーバーは別途デプロイが必要です。推奨オプション：

1. **AWS EC2/ECS**
   - Socket.ioサーバーのためのEC2インスタンスまたはECSタスクを設定
   - Application Load Balancerを設定してWebSocket接続をサポート
   - スティッキーセッションを有効化

2. **Railway/Render**
   - より簡単なデプロイオプション
   - WebSocketサポートが組み込まれている
   - 自動スケーリングが可能

#### Sentry（エラー監視）

1. [Sentry](https://sentry.io)でプロジェクトを作成
2. DSNを取得
3. `NEXT_PUBLIC_SENTRY_DSN`として設定

#### Google Analytics

1. [Google Analytics](https://analytics.google.com)でプロパティを作成
2. 測定IDを取得（G-XXXXXXXXXX形式）
3. `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`として設定

### 4. デプロイフロー

#### 自動デプロイ

- **mainブランチ**: 本番環境へ自動デプロイ
- **developブランチ**: プレビュー環境へ自動デプロイ
- **Pull Request**: プレビューURLが自動生成され、PRにコメントされる

#### 手動デプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトをリンク
vercel link

# 本番環境へデプロイ
vercel --prod

# プレビュー環境へデプロイ
vercel
```

### 5. 環境変数の管理

#### Vercel Dashboard での設定

1. Vercel Dashboard > Project Settings > Environment Variables
2. 各環境（Production、Preview、Development）に応じて変数を設定
3. 変数名と値を入力して保存

#### 環境変数の優先順位

1. GitHub Actions の環境変数（最優先）
2. Vercel Dashboard の環境変数
3. vercel.json の環境変数設定

### 6. トラブルシューティング

#### ビルドエラー

- `npm ci`が失敗する場合：package-lock.jsonが最新か確認
- TypeScriptエラー：`npm run build:frontend`をローカルで実行して確認

#### デプロイ後の問題

- 環境変数が反映されない：Vercel Dashboardで再デプロイを実行
- CORS エラー：vercel.jsonのheaders設定を確認

#### WebSocket接続の問題

- バックエンドサーバーがWebSocketをサポートしているか確認
- CORS設定でWebSocketオリジンを許可しているか確認

### 7. セキュリティベストプラクティス

1. **環境変数の分離**
   - 本番環境と開発環境で異なる値を使用
   - シークレットはGitHub Secretsで管理

2. **アクセス制限**
   - Vercel Dashboardへのアクセスを必要最小限に
   - GitHub Secretsへのアクセスを制限

3. **定期的な更新**
   - 依存関係の定期的な更新
   - セキュリティパッチの適用

### 8. パフォーマンス最適化

1. **画像最適化**
   - Next.js Image コンポーネントの使用
   - 適切な画像フォーマット（WebP）の使用

2. **キャッシュ戦略**
   - 静的アセットの適切なキャッシュヘッダー
   - ISR（Incremental Static Regeneration）の活用

3. **バンドルサイズ**
   - 不要な依存関係の削除
   - 動的インポートの活用