# ReadMaker Project Makefile
# Docker環境とデータベース管理用コマンド

.PHONY: help setup start stop restart logs clean db-connect db-backup db-restore

# デフォルトターゲット
help:
	@echo "ReadMaker Docker管理コマンド"
	@echo ""
	@echo "セットアップ & 起動:"
	@echo "  make setup     - 初回セットアップ (PostgreSQL + pgAdmin4)"
	@echo "  make start     - サービス起動"
	@echo "  make stop      - サービス停止"
	@echo "  make restart   - サービス再起動"
	@echo ""
	@echo "ログ & デバッグ:"
	@echo "  make logs      - 全サービスログ表示"
	@echo "  make logs-pg   - PostgreSQLログのみ表示"
	@echo "  make logs-admin - pgAdminログのみ表示"
	@echo ""
	@echo "データベース操作:"
	@echo "  make db-connect  - PostgreSQLに直接接続"
	@echo "  make db-reset    - データベースリセット"
	@echo "  make db-backup   - データベースバックアップ"
	@echo "  make db-restore  - データベース復元"
	@echo ""
	@echo "クリーンアップ:"
	@echo "  make clean     - 全コンテナ・ボリューム削除"
	@echo ""
	@echo "アクセス情報:"
	@echo "  pgAdmin4: http://localhost:8080"
	@echo "  PostgreSQL: localhost:5432"

# 初回セットアップ
setup:
	@echo "🚀 ReadMaker環境セットアップ開始..."
	@./scripts/docker-setup.sh

# サービス起動
start:
	@echo "▶️  サービス起動中..."
	@docker-compose up -d
	@echo "✅ サービス起動完了"
	@echo "pgAdmin4: http://localhost:8080"

# サービス停止
stop:
	@echo "⏹️  サービス停止中..."
	@docker-compose down
	@echo "✅ サービス停止完了"

# サービス再起動
restart:
	@echo "🔄 サービス再起動中..."
	@docker-compose restart
	@echo "✅ サービス再起動完了"

# 全ログ表示
logs:
	@docker-compose logs -f

# PostgreSQLログのみ
logs-pg:
	@docker-compose logs -f postgres

# pgAdminログのみ  
logs-admin:
	@docker-compose logs -f pgadmin

# データベース直接接続
db-connect:
	@echo "🐘 PostgreSQLに接続中..."
	@docker-compose exec postgres psql -U readmaker_user -d readmaker

# データベースリセット
db-reset:
	@echo "⚠️  データベースをリセットします..."
	@read -p "本当に実行しますか? [y/N]: " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose down; \
		docker volume rm 2025_readmaker_postgres_data 2>/dev/null || true; \
		docker-compose up -d; \
		echo "✅ データベースリセット完了"; \
	else \
		echo "❌ キャンセルされました"; \
	fi

# データベースバックアップ
db-backup:
	@echo "💾 データベースバックアップ中..."
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U readmaker_user readmaker > backups/readmaker_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ バックアップ完了: backups/"

# データベース復元
db-restore:
	@echo "📥 利用可能なバックアップ:"
	@ls -la backups/*.sql 2>/dev/null || echo "バックアップファイルが見つかりません"
	@read -p "復元するファイル名を入力: " filename; \
	if [ -f "backups/$$filename" ]; then \
		docker-compose exec -T postgres psql -U readmaker_user -d readmaker < backups/$$filename; \
		echo "✅ 復元完了"; \
	else \
		echo "❌ ファイルが見つかりません"; \
	fi

# 完全クリーンアップ
clean:
	@echo "🧹 完全クリーンアップ中..."
	@read -p "全てのデータが削除されます。実行しますか? [y/N]: " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose down -v --remove-orphans; \
		docker system prune -f; \
		echo "✅ クリーンアップ完了"; \
	else \
		echo "❌ キャンセルされました"; \
	fi

# 開発環境情報表示
info:
	@echo "ReadMaker Docker環境情報"
	@echo "========================"
	@echo "Docker Compose Status:"
	@docker-compose ps
	@echo ""
	@echo "アクセス情報:"
	@echo "  pgAdmin4: http://localhost:8080"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis: localhost:6379"