# WePlay ⚾

リアルタイム野球スコアボード共有アプリケーション

## 概要

WePlayは、草野球や青少年野球などのカジュアルな野球試合で、リアルタイムにスコアボード情報を共有できるWebアプリケーションです。審判の判定やスコア情報をリアルタイムで共有し、同じ試合を見ている人全員が同じページを共有できます。

## 主な機能

### 実装済み機能
- ✅ **試合作成・管理**: 試合の作成、チーム情報の設定
- ✅ **試合一覧**: 進行中・終了した試合の一覧表示
- ✅ **ユーザー認証**: JWT認証によるユーザー管理
- ✅ **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- ✅ **ファイルアップロード**: AWS S3を使用した画像・動画アップロード
- ✅ **共通UIコンポーネント**: 再利用可能なUIコンポーネント
- ✅ **状態管理**: Zustandによる効率的な状態管理
- ✅ **型安全性**: TypeScriptによる型安全なコーディング

### 開発中の機能
- 🚧 **リアルタイムスコアボード**: Socket.ioによるリアルタイム更新
- 🚧 **投稿機能**: 写真・動画・応援メッセージの投稿
- 🚧 **試合詳細ページ**: スコアボード表示とリアルタイム更新

### 計画中の機能
- 📋 **PWA対応**: オフライン対応とプッシュ通知
- 📋 **統計機能**: 試合データの分析と統計表示
- 📋 **チーム管理**: チーム作成・選手管理
- 📋 **通知システム**: 重要な場面での通知機能

## 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **Next.js 14** - フルスタックフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Zustand** - 状態管理
- **Socket.io Client** - リアルタイム通信

### バックエンド
- **Node.js** - サーバーサイドランタイム
- **Express.js** - Webアプリケーションフレームワーク
- **TypeScript** - 型安全性
- **Socket.io** - リアルタイム通信
- **MongoDB** - データベース（Mongoose）
- **JWT** - 認証システム
- **AWS S3** - ファイルストレージ
- **Express Validator** - バリデーション

### インフラ・デプロイ
- **Vercel** - フロントエンドデプロイ
- **Railway** - バックエンドデプロイ
- **MongoDB Atlas** - データベース
- **AWS S3** - ファイルストレージ

## アーキテクチャ

### プロジェクト構造
```
weplay/
├── frontend/          # Next.js フロントエンド
│   ├── src/
│   │   ├── app/       # App Router ページ
│   │   │   ├── common/    # 共通コンポーネント
│   │   │   └── forms/     # フォームコンポーネント
│   │   └── lib/       # ライブラリ・ユーティリティ
│   │       ├── stores/    # Zustand ストア
│   │       ├── api.ts     # APIクライアント
│   │       └── types.ts   # 型定義
│   └── package.json
├── backend/           # Express.js バックエンド
│   ├── src/
│   │   ├── controllers/ # コントローラー
│   │   ├── models/      # データモデル
│   │   ├── routes/      # ルート定義
│   │   ├── middleware/  # ミドルウェア
│   │   └── utils/       # ユーティリティ
│   └── package.json
├── shared/            # 共有型定義
│   ├── src/
│   │   └── types/
│   └── package.json
└── package.json       # モノレポ設定
```

### 主要コンポーネント設計

#### 共通UIコンポーネント
- **Header**: ナビゲーション、認証状態表示
- **Layout**: ページ共通レイアウト
- **Button**: 再利用可能なボタンコンポーネント
- **Input**: フォーム入力フィールド
- **ErrorMessage**: エラー表示コンポーネント

#### 状態管理（Zustand）
- **AuthStore**: ユーザー認証状態
- **GameStore**: 試合データ・状態管理

#### APIクライアント
- 統一的なHTTPリクエスト処理
- JWT認証トークン管理
- エラーハンドリング

## 開発環境セットアップ

### 必要な環境
- Node.js 18以上
- npm または yarn
- MongoDB（開発用）
- AWS S3（ファイルアップロード用）

### インストール手順

1. **リポジトリクローン**
   ```bash
   git clone https://github.com/yourusername/weplay.git
   cd weplay
   ```

2. **依存関係インストール**
   ```bash
   npm install
   ```

3. **環境変数設定**
   ```bash
   # バックエンド
   cp backend/.env.example backend/.env
   
   # フロントエンド
   cp frontend/.env.example frontend/.env
   ```

4. **環境変数の設定**
   ```bash
   # backend/.env
   MONGODB_URI=mongodb://localhost:27017/weplay
   JWT_SECRET=your-secret-key
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_BUCKET_NAME=your-bucket-name
   AWS_REGION=ap-northeast-1
   PORT=3001
   
   # frontend/.env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **開発サーバー起動**
   ```bash
   # バックエンド
   cd backend
   npm run dev
   
   # フロントエンド（別ターミナル）
   cd frontend
   npm run dev
   ```

## 使用方法

### 試合作成
1. 「試合作成」ページでチーム情報を入力
2. 試合タイトルと説明を設定
3. 試合を作成すると、専用のスコアボードページが生成

### スコア管理
1. 試合ページでリアルタイムスコア更新
2. イニング、アウト数、ボール・ストライクカウント管理
3. 観戦者は投稿機能でコメント・写真を共有

### 試合共有
1. 試合URLを参加者に共有
2. リアルタイムで同じスコアボードを表示
3. 観戦者は誰でもアクセス可能

## デプロイメント

### Vercel（フロントエンド）

詳細なデプロイ手順は[Vercelデプロイメントガイド](./docs/DEPLOYMENT_GUIDE.md)を参照してください。

### バックエンドデプロイ

Socket.ioを使用するバックエンドのデプロイについては[バックエンドデプロイメントガイド](./docs/BACKEND_DEPLOYMENT.md)を参照してください。

### 環境変数

必要な環境変数の一覧は[環境変数リファレンス](./docs/ENVIRONMENT_VARIABLES.md)を確認してください。

## 貢献方法

1. Issueを作成して機能要求やバグ報告
2. フォークしてfeatureブランチを作成
3. 変更をコミットしてプルリクエスト
4. コードレビュー後にマージ

### 開発ガイドライン
- TypeScriptの型安全性を維持
- ESLint + Prettierでコードフォーマット
- コミットメッセージは日本語で明確に
- 単体テストを追加（推奨）

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 作者・メンテナー

- メイン開発者: [Your Name]
- 貢献者: [Contributors]

## サポート・連絡先

- Issue: GitHub Issues
- Email: your-email@example.com
- Discord: [Discord Server Link]

## 更新履歴

### v0.2.0 (2024-01-XX) - リファクタリング完了
- 共通UIコンポーネント導入
- Zustandによる状態管理
- 統一的なAPIクライアント
- TypeScript型安全性向上
- バックエンドレスポンス・バリデーション統一

### v0.1.0 (2024-01-XX) - 初期リリース
- 基本的なプロジェクト構造
- 認証システム実装
- 試合作成・一覧機能
- レスポンシブデザイン
- AWS S3ファイルアップロード

---

⚾ **WePlayで野球をもっと楽しく、もっと繋がろう！** 