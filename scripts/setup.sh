#!/bin/bash

# WePlay Initial Setup Script

set -e

echo "🚀 WePlay 初期セットアップを開始します..."

# Check if required tools are installed
check_requirements() {
    echo "📋 必要なツールを確認中..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.jsがインストールされていません"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npmがインストールされていません"
        exit 1
    fi
    
    echo "✅ 必要なツールが確認されました"
}

# Install dependencies
install_dependencies() {
    echo "📦 依存関係をインストール中..."
    
    # Root dependencies
    npm install
    
    # Backend dependencies
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    cd frontend
    npm install
    cd ..
    
    echo "✅ 依存関係のインストールが完了しました"
}

# Setup environment files
setup_env_files() {
    echo "🔧 環境変数ファイルをセットアップ中..."
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        echo "📝 backend/.env を作成しました。必要な値を設定してください。"
    fi
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cp frontend/.env.example frontend/.env.local
        echo "📝 frontend/.env.local を作成しました。必要な値を設定してください。"
    fi
    
    echo "✅ 環境変数ファイルのセットアップが完了しました"
}

# Install global CLIs
install_clis() {
    echo "🛠️  CLIツールをインストール中..."
    
    # Vercel CLI
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
        echo "✅ Vercel CLIをインストールしました"
    fi
    
    # Supabase CLI
    if ! command -v supabase &> /dev/null; then
        npm install -g supabase
        echo "✅ Supabase CLIをインストールしました"
    fi
}

# Main execution
main() {
    check_requirements
    install_dependencies
    setup_env_files
    install_clis
    
    echo ""
    echo "🎉 セットアップが完了しました！"
    echo ""
    echo "次のステップ:"
    echo "1. backend/.env と frontend/.env.local に必要な値を設定してください"
    echo "2. Supabaseプロジェクトを作成し、マイグレーションを実行してください:"
    echo "   supabase link --project-ref YOUR_PROJECT_REF"
    echo "   supabase db push"
    echo "3. 開発サーバーを起動してください:"
    echo "   npm run dev"
    echo ""
    echo "詳細は DEPLOYMENT_GUIDE.md を参照してください。"
}

main