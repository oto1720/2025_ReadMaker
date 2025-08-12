#!/bin/bash

# ReadMaker Docker Setup Script
# このスクリプトはPostgreSQL + pgAdmin4のDocker環境をセットアップします

set -e

echo "🚀 ReadMaker Docker環境セットアップ開始..."

# 色付きログ出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dockerがインストールされているかチェック
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Dockerがインストールされていません${NC}"
    echo "Docker Desktopをインストールしてください: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Docker Composeがインストールされているかチェック
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Composeがインストールされていません${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker環境確認完了${NC}"

# 既存のコンテナを停止・削除
echo -e "${YELLOW}🧹 既存のコンテナをクリーンアップ中...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true

# 必要なディレクトリ作成
echo -e "${BLUE}📁 必要なディレクトリを作成中...${NC}"
mkdir -p docker/postgres
mkdir -p docker/pgadmin
mkdir -p logs

# 環境変数ファイルをコピー
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📝 環境変数ファイルを作成中...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}✅ .envファイルを作成しました${NC}"
fi

# Dockerサービス起動
echo -e "${BLUE}🐳 Dockerサービスを起動中...${NC}"
docker-compose up -d

# PostgreSQL起動待機
echo -e "${YELLOW}⏳ PostgreSQLの起動を待機中...${NC}"
timeout=60
counter=0

while ! docker-compose exec postgres pg_isready -U readmaker_user -d readmaker > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo -e "${RED}❌ PostgreSQLの起動がタイムアウトしました${NC}"
        docker-compose logs postgres
        exit 1
    fi
    sleep 2
    counter=$((counter + 2))
    echo -n "."
done

echo ""
echo -e "${GREEN}✅ PostgreSQL起動完了${NC}"

# データベーステーブル確認
echo -e "${BLUE}🔍 データベーステーブルを確認中...${NC}"
docker-compose exec postgres psql -U readmaker_user -d readmaker -c "\dt" || {
    echo -e "${YELLOW}⚠️  テーブルが見つかりません。スキーマを手動実行してください。${NC}"
}

# pgAdmin4起動確認
echo -e "${YELLOW}⏳ pgAdmin4の起動を確認中...${NC}"
sleep 5

# 接続情報表示
echo ""
echo -e "${GREEN}🎉 セットアップ完了！${NC}"
echo ""
echo -e "${BLUE}📊 pgAdmin4 Web Interface:${NC}"
echo -e "   URL: ${YELLOW}http://localhost:8080${NC}"
echo -e "   Email: ${YELLOW}admin@readmaker.com${NC}"
echo -e "   Password: ${YELLOW}readmaker_admin_2024${NC}"
echo ""
echo -e "${BLUE}🐘 PostgreSQL直接接続:${NC}"
echo -e "   Host: ${YELLOW}localhost${NC}"
echo -e "   Port: ${YELLOW}5432${NC}"
echo -e "   Database: ${YELLOW}readmaker${NC}"
echo -e "   Username: ${YELLOW}readmaker_user${NC}"
echo -e "   Password: ${YELLOW}readmaker_password${NC}"
echo ""
echo -e "${BLUE}🗂️  Redis (将来用):${NC}"
echo -e "   Host: ${YELLOW}localhost${NC}"
echo -e "   Port: ${YELLOW}6379${NC}"
echo ""
echo -e "${GREEN}💡 使用方法:${NC}"
echo -e "   • データベース停止: ${YELLOW}docker-compose down${NC}"
echo -e "   • データベース再起動: ${YELLOW}docker-compose restart${NC}"
echo -e "   • ログ確認: ${YELLOW}docker-compose logs -f postgres${NC}"
echo -e "   • データベース接続: ${YELLOW}docker-compose exec postgres psql -U readmaker_user -d readmaker${NC}"
echo ""
echo -e "${GREEN}🔗 pgAdmin4でサーバー接続設定:${NC}"
echo -e "   1. http://localhost:8080 にアクセス"
echo -e "   2. ログイン後、左パネルの 'ReadMaker PostgreSQL' をクリック"
echo -e "   3. パスワード入力: ${YELLOW}readmaker_password${NC}"
echo ""