# WePlay - リアルタイム野球スコアボード共有アプリ

WePlayは、野球の試合をリアルタイムで記録・共有できるWebアプリケーションです。スコアキーパーと観戦者が同じ画面を見ながら、試合の進行を楽しむことができます。

## 主な機能

- 📊 **リアルタイムスコア更新**: WebSocketを使用した即座の更新
- 👥 **複数デバイス対応**: PC、タブレット、スマートフォンで利用可能
- 📱 **レスポンシブデザイン**: あらゆる画面サイズに最適化
- � **セキュアな通信**: JWT認証とデータ暗号化
- � **自動保存**: 試合データの自動バックアップ
- � **統計情報**: 打率、防御率などの詳細な統計（有料機能）

## 技術スタック

### フロントエンド
- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Socket.io Client** - リアルタイム通信
- **Supabase Client** - 認証・データベースアクセス

### バックエンド
- **Node.js** / **Express** - APIサーバー
- **TypeScript** - 型安全性
- **Socket.io** - リアルタイム通信
- **Supabase** - データベース・認証・ストレージ
- **Stripe** - 課金処理

### インフラ・サービス
- **Vercel** - フロントエンド・バックエンドホスティング
- **Supabase** - BaaS（Backend as a Service）
- **Stripe** - 決済処理
- **GitHub Actions** - CI/CD

## プロジェクト構造

```
weplay/
├── frontend/          # Next.jsフロントエンド
├── backend/           # Express APIサーバー
├── shared/            # 共通型定義・ユーティリティ
├── scripts/           # デプロイ・セットアップスクリプト
└── .github/           # GitHub Actions設定
```

## 開発環境セットアップ

### 前提条件
- Node.js 18.x以上
- npm または yarn
- Git

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/yourusername/weplay.git
   cd weplay
   ```

2. **自動セットアップ**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **環境変数の設定**
   - `backend/.env` を編集して必要な値を設定
   - `frontend/.env.local` を編集して必要な値を設定

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

## デプロイ

### 自動デプロイ

本プロジェクトはGitHub Actionsを使用した自動デプロイが設定されています。

1. **開発環境（プレビュー）**
   - Pull Requestを作成すると自動的にプレビュー環境がデプロイされます
   - PRコメントにプレビューURLが投稿されます

2. **本番環境**
   - `main`ブランチにマージすると自動的に本番環境にデプロイされます
   - フロントエンドとバックエンドが同時にデプロイされます

### 初期セットアップ

```bash
# セットアップスクリプトを実行
chmod +x scripts/setup.sh
./scripts/setup.sh

# 環境変数を設定
# backend/.env と frontend/.env.local を編集

# デプロイ前チェック
chmod +x scripts/deploy-checklist.sh
./scripts/deploy-checklist.sh
```

### 手動デプロイ

```bash
# バックエンドのデプロイ
cd backend
vercel --prod

# フロントエンドのデプロイ
cd frontend
vercel --prod
```

詳細なデプロイ手順は[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)を参照してください。

## 料金モデル

WePlayは基本無料で利用でき、より多くの機能を使いたい場合に都度課金で購入できます。

### 無料枠
- 月3試合まで作成可能
- 1チームまで作成可能
- 基本的なスコア記録機能

### 有料プラン
- **試合パック**: 300円/試合
- **お得なパック**: 5試合1,200円〜
- **チームプラン**: 1,000円/月

詳細は[料金モデル](./backend/docs/PRICING_MODEL.md)を参照してください。

## 使い方

### スコアキーパー
1. アカウント登録・ログイン
2. 新規試合を作成
3. チーム名・選手名を入力
4. 試合開始・スコア記録

### 観戦者
1. 試合URLを共有してもらう
2. ブラウザでアクセス
3. リアルタイムでスコアを確認

## 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 開発ガイドライン

- TypeScriptの型安全性を維持
- ESLint + Prettierでコードフォーマット
- コミットメッセージは日本語で明確に
- テストを追加（推奨）

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## サポート

問題が発生した場合：
- [Issues](https://github.com/yourusername/weplay/issues)で報告
- support@weplay.app にメール

## リンク

- [公式サイト](https://weplay.app)
- [ドキュメント](https://docs.weplay.app)
- [API仕様](./backend/docs/API.md) 