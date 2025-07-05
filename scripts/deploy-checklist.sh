#!/bin/bash

# WePlay Deployment Checklist Script

set -e

echo "🔍 WePlay デプロイ前チェックリスト"
echo "=================================="

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check function
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check environment files
echo ""
echo "📋 環境変数ファイルチェック"
echo "------------------------"

[ -f "backend/.env" ]
check $? "backend/.env が存在する"

[ -f "frontend/.env.local" ]
check $? "frontend/.env.local が存在する"

# 2. Check dependencies
echo ""
echo "📦 依存関係チェック"
echo "------------------------"

cd backend
npm list --depth=0 > /dev/null 2>&1
check $? "バックエンドの依存関係が正しくインストールされている"
cd ..

cd frontend
npm list --depth=0 > /dev/null 2>&1
check $? "フロントエンドの依存関係が正しくインストールされている"
cd ..

# 3. Build test
echo ""
echo "🔨 ビルドテスト"
echo "------------------------"

cd backend
npm run build > /dev/null 2>&1
check $? "バックエンドのビルドが成功する"
cd ..

cd frontend
npm run build > /dev/null 2>&1
check $? "フロントエンドのビルドが成功する"
cd ..

# 4. Linting
echo ""
echo "🧹 コード品質チェック"
echo "------------------------"

cd backend
npm run lint > /dev/null 2>&1
check $? "バックエンドのLintチェックがパスする"
cd ..

cd frontend
npm run lint > /dev/null 2>&1
check $? "フロントエンドのLintチェックがパスする"
cd ..

# 5. Test execution
echo ""
echo "🧪 テスト実行"
echo "------------------------"

cd backend
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    npm test -- --passWithNoTests > /dev/null 2>&1
    check $? "バックエンドのテストがパスする"
else
    warn "バックエンドのテストが設定されていません"
fi
cd ..

cd frontend
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    npm test -- --passWithNoTests > /dev/null 2>&1
    check $? "フロントエンドのテストがパスする"
else
    warn "フロントエンドのテストが設定されていません"
fi
cd ..

# 6. Check for secrets in code
echo ""
echo "🔐 セキュリティチェック"
echo "------------------------"

# Check for common secret patterns
if grep -r "sk_live_\|pk_live_\|AKIA\|-----BEGIN.*PRIVATE KEY-----" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" . > /dev/null 2>&1; then
    echo -e "${RED}❌ コード内に秘密情報が含まれている可能性があります${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ 秘密情報のチェックをパスしました${NC}"
fi

# 7. Check Git status
echo ""
echo "📁 Gitステータスチェック"
echo "------------------------"

if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ 全ての変更がコミットされています${NC}"
else
    warn "コミットされていない変更があります"
fi

# 8. Check for TODO comments
echo ""
echo "📝 TODOチェック"
echo "------------------------"

TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" . | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
    warn "$TODO_COUNT 個のTODO/FIXMEコメントが見つかりました"
fi

# Summary
echo ""
echo "=================================="
echo "📊 チェック結果サマリー"
echo "=================================="
echo -e "エラー: ${RED}$ERRORS${NC}"
echo -e "警告: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ デプロイの準備ができています！${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ デプロイ前に修正が必要な項目があります${NC}"
    exit 1
fi