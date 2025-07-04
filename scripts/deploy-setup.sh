#!/bin/bash

# WePlay Vercelデプロイセットアップスクリプト

set -e

echo "🚀 WePlay Vercelデプロイセットアップを開始します..."

# 色付きエコー関数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
}

print_info() {
    echo -e "\033[34mℹ️  $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠️  $1\033[0m"
}

# 必要なツールのチェック
check_tools() {
    print_info "必要なツールをチェックしています..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js がインストールされていません"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm がインストールされていません"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git がインストールされていません"
        exit 1
    fi
    
    print_success "すべてのツールが利用可能です"
}

# Vercel CLIのインストール
install_vercel_cli() {
    print_info "Vercel CLIをインストールしています..."
    
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
        print_success "Vercel CLIがインストールされました"
    else
        print_success "Vercel CLIは既にインストールされています"
    fi
}

# 依存関係のインストール
install_dependencies() {
    print_info "依存関係をインストールしています..."
    npm ci
    print_success "依存関係のインストールが完了しました"
}

# プロジェクトのビルドテスト
build_project() {
    print_info "プロジェクトのビルドテストを実行しています..."
    
    # リンターの実行
    if npm run lint; then
        print_success "リンターチェックが完了しました"
    else
        print_warning "リンターで警告またはエラーが発生しました"
    fi
    
    # フロントエンドのビルド
    if npm run build:frontend; then
        print_success "フロントエンドのビルドが完了しました"
    else
        print_error "フロントエンドのビルドに失敗しました"
        exit 1
    fi
    
    # バックエンドのビルド
    if npm run build:backend; then
        print_success "バックエンドのビルドが完了しました"
    else
        print_error "バックエンドのビルドに失敗しました"
        exit 1
    fi
}

# Vercelプロジェクトの初期化
init_vercel_project() {
    print_info "Vercelプロジェクトを初期化しています..."
    
    if [ ! -f ".vercel/project.json" ]; then
        print_info "Vercelにログインしてプロジェクトをリンクしてください"
        vercel link
        print_success "Vercelプロジェクトがリンクされました"
    else
        print_success "Vercelプロジェクトは既にリンクされています"
    fi
}

# 環境変数の設定確認
check_env_vars() {
    print_info "環境変数の設定を確認しています..."
    
    required_vars=(
        "NEXT_PUBLIC_API_URL"
        "NEXT_PUBLIC_SOCKET_URL"
        "NEXT_PUBLIC_APP_ENV"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! vercel env ls | grep -q "$var"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_warning "以下の環境変数が設定されていません:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        
        read -p "環境変数を設定しますか？ (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            setup_env_vars
        else
            print_info "後で手動で環境変数を設定してください"
        fi
    else
        print_success "すべての必要な環境変数が設定されています"
    fi
}

# 環境変数の設定
setup_env_vars() {
    print_info "環境変数を設定しています..."
    
    echo "フロントエンド環境変数を設定してください："
    
    read -p "API URL (例: https://your-backend.railway.app): " api_url
    if [ -n "$api_url" ]; then
        echo "$api_url" | vercel env add NEXT_PUBLIC_API_URL production
    fi
    
    read -p "Socket.IO URL (例: https://your-backend.railway.app): " socket_url
    if [ -n "$socket_url" ]; then
        echo "$socket_url" | vercel env add NEXT_PUBLIC_SOCKET_URL production
    fi
    
    echo "production" | vercel env add NEXT_PUBLIC_APP_ENV production
    
    print_success "環境変数が設定されました"
}

# GitHub Secretsの確認
check_github_secrets() {
    print_info "GitHub Secretsの設定を確認してください："
    echo ""
    echo "必要なSecrets:"
    echo "  - VERCEL_TOKEN"
    echo "  - VERCEL_ORG_ID"
    echo "  - VERCEL_PROJECT_ID"
    echo "  - RAILWAY_TOKEN (オプション)"
    echo ""
    echo "設定方法:"
    echo "  1. GitHub リポジトリの Settings → Secrets and variables → Actions"
    echo "  2. 上記のSecretsを追加"
    echo ""
    echo "Vercel情報の取得:"
    echo "  - VERCEL_TOKEN: https://vercel.com/account/tokens"
    echo "  - VERCEL_ORG_ID: .vercel/project.json ファイルを確認"
    echo "  - VERCEL_PROJECT_ID: .vercel/project.json ファイルを確認"
    echo ""
    
    read -p "GitHub Secretsを設定しましたか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "GitHub Secretsの設定が完了しました"
    else
        print_warning "GitHub Secretsを設定してからデプロイを実行してください"
    fi
}

# デプロイテスト
test_deploy() {
    print_info "デプロイテストを実行しますか？"
    read -p "Vercelにデプロイテストを実行しますか？ (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "デプロイテストを実行しています..."
        vercel --prod
        print_success "デプロイテストが完了しました"
    else
        print_info "デプロイテストをスキップしました"
    fi
}

# セットアップ完了メッセージ
print_completion() {
    echo ""
    echo "🎉 Vercelデプロイセットアップが完了しました！"
    echo ""
    echo "次のステップ:"
    echo "  1. DEPLOYMENT.md を確認してください"
    echo "  2. バックエンドデプロイの設定（Railway/Render等）"
    echo "  3. MongoDB Atlas の設定"
    echo "  4. AWS S3 の設定"
    echo "  5. 本番環境でのテスト"
    echo ""
    echo "デプロイコマンド:"
    echo "  - 手動デプロイ: vercel --prod"
    echo "  - 自動デプロイ: git push origin main"
    echo ""
    print_success "セットアップ完了！"
}

# メイン実行
main() {
    check_tools
    install_vercel_cli
    install_dependencies
    build_project
    init_vercel_project
    check_env_vars
    check_github_secrets
    test_deploy
    print_completion
}

# スクリプト実行
main "$@"