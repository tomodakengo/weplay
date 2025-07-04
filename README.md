# WePlay - リアルタイム野球スコアボード共有アプリ

## 概要

WePlayは、草野球や青少年野球などのカジュアルな野球試合で、リアルタイムにスコアボード情報を共有できるWebアプリケーションです。審判の判定やスコア情報をリアルタイムで共有し、同じ試合を見ている人全員が同じページを共有できます。

## 主な機能

### 現在実装済み
- [ ] プロジェクト基盤構築
- [ ] 基本的なUI/UX設計

### 予定機能
- **リアルタイムスコアボード**: 試合のスコア、アウト数、ストライク数などをリアルタイム更新
- **タイムライン表示**: スコア、写真、動画を時系列で表示
- **簡単共有**: URL・QRコードで簡単に試合ページを共有
- **ユーザー機能**: ログインによる写真投稿や応援メッセージの共有
- **カジュアルUI**: 気軽に使える直感的なインターフェース

### 将来的な機能
- **AIアドバイス**: 画像・動画解析による投球・打撃アドバイス
- **マッチング機能**: 他チームとの試合マッチング
- **コミュニティ機能**: 野球仲間募集
- **支援募集**: 野球支援の募集機能
- **スケジュール管理**: 試合スケジュール管理

## 技術スタック

### フロントエンド
- **React** / **Next.js**: モダンなWebアプリケーション構築
- **TypeScript**: 型安全性の確保
- **Tailwind CSS**: レスポンシブデザイン
- **PWA対応**: iOS/Androidアプリとして利用可能

### バックエンド
- **Node.js** / **Express**: APIサーバー
- **Socket.io**: リアルタイム通信
- **Supabase**: データベース・ユーザー認証
- **AWS S3**: 画像・動画ストレージ

### インフラ・サービス
- **Vercel**: フロントエンド・バックエンドデプロイ
- **Supabase**: データベース・認証・リアルタイム機能
- **Stripe**: 課金システム
- **Cloudflare**: CDN・DNS

## 開発環境セットアップ

### 前提条件
- Node.js 18.0.0以上
- npm または yarn
- Git

### インストール手順

```bash
# リポジトリをクローン
git clone https://github.com/your-username/weplay.git
cd weplay

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 環境変数設定

プロジェクトルートに`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# フロントエンド設定
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# バックエンド設定
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe設定
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AWS S3設定（後で設定）
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=weplay-uploads

# ファイルアップロード設定
MAX_FILE_SIZE=10485760 # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/quicktime

# セキュリティ設定
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000 # 15分
RATE_LIMIT_MAX_REQUESTS=100
```

## プロジェクト構造

```
weplay/
├── frontend/                 # Next.jsフロントエンド
│   ├── components/          # Reactコンポーネント
│   ├── pages/              # ページコンポーネント
│   ├── hooks/              # カスタムフック
│   ├── utils/              # ユーティリティ関数
│   └── styles/             # スタイルファイル
├── backend/                # Express.jsバックエンド
│   ├── routes/             # APIルート
│   ├── models/             # データベースモデル
│   ├── middleware/         # ミドルウェア
│   └── services/           # ビジネスロジック
├── shared/                 # 共有型定義・ユーティリティ
└── docs/                   # ドキュメント
```

## 開発ガイドライン

### コーディング規約
- TypeScriptを使用し、型安全性を確保
- ESLint + Prettierでコードフォーマット統一
- コミットメッセージは日本語で記述
- 機能実装後はTODO.mdとREADME.mdを更新

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/機能名`: 新機能開発
- `hotfix/修正内容`: 緊急修正

## デプロイ

### Vercelデプロイ
```bash
# フロントエンド・バックエンド両方をVercelにデプロイ
npm run build
vercel --prod
```

### 環境変数の設定
Vercelのダッシュボードで以下の環境変数を設定してください：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)を参照してください。

## お問い合わせ

- プロジェクトに関する質問: [GitHub Issues](https://github.com/your-username/weplay/issues)
- 機能要望・バグ報告: [GitHub Issues](https://github.com/your-username/weplay/issues) 