# ReadMaker Docker環境

PostgreSQL + pgAdmin4のDocker開発環境セットアップガイド

## 🚀 クイックスタート

### 1. 自動セットアップ（推奨）

```bash
# 初回セットアップ
make setup

# または手動で
./scripts/docker-setup.sh
```

### 2. 手動セットアップ

```bash
# 環境ファイル作成
cp .env.docker .env

# Docker起動
docker-compose up -d

# 起動確認
docker-compose ps
```

## 📊 アクセス情報

### pgAdmin4 Web Interface
- **URL**: http://localhost:8080
- **Email**: admin@readmaker.com  
- **Password**: readmaker_admin_2024

### PostgreSQL直接接続
- **Host**: localhost
- **Port**: 5432
- **Database**: readmaker
- **Username**: readmaker_user
- **Password**: readmaker_password

### Redis（将来のセッション管理用）
- **Host**: localhost
- **Port**: 6379

## 🛠️ 基本操作

### Makeコマンド
```bash
make help         # ヘルプ表示
make start        # サービス起動
make stop         # サービス停止
make restart      # サービス再起動
make logs         # ログ表示
make db-connect   # データベース接続
make clean        # 完全削除
```

### Docker Composeコマンド
```bash
docker-compose up -d           # バックグラウンド起動
docker-compose down            # 停止・削除
docker-compose logs -f postgres # PostgreSQLログ
docker-compose restart         # 再起動
```

## 🐘 PostgreSQL操作

### データベース接続
```bash
# コンテナ経由で接続
make db-connect

# または
docker-compose exec postgres psql -U readmaker_user -d readmaker
```

### よく使うSQLコマンド
```sql
-- テーブル一覧
\dt

-- テーブル構造確認
\d users

-- ユーザー一覧確認
SELECT id, email, username, created_at FROM users;

-- データベース情報
\l

-- 接続情報
\conninfo

-- 終了
\q
```

### スキーマ再実行
```bash
# コンテナ内でスキーマ実行
docker-compose exec postgres psql -U readmaker_user -d readmaker -f /docker-entrypoint-initdb.d/01-schema.sql
```

## 📋 pgAdmin4使用方法

### 1. 初回ログイン
1. http://localhost:8080 にアクセス
2. Email: `admin@readmaker.com`
3. Password: `readmaker_admin_2024`

### 2. サーバー接続
左パネルの **"ReadMaker PostgreSQL"** をクリック
- パスワード入力: `readmaker_password`
- 「Save Password」にチェック

### 3. データベース操作
- **Tables** → 各テーブルを展開
- **右クリック** → **View/Edit Data** → **All Rows**
- **Tools** → **Query Tool** でSQL実行

## 🔧 トラブルシューティング

### PostgreSQL起動しない
```bash
# ログ確認
docker-compose logs postgres

# ポート競合確認
lsof -i :5432

# 完全リセット
make clean
make setup
```

### pgAdmin4アクセスできない
```bash
# ログ確認
docker-compose logs pgadmin

# ポート確認
lsof -i :8080

# コンテナ再起動
docker-compose restart pgadmin
```

### データ消失を防ぐ
```bash
# バックアップ作成
make db-backup

# 復元
make db-restore
```

## 📁 ディレクトリ構造

```
docker/
├── postgres/
│   └── postgresql.conf    # PostgreSQL設定
├── pgadmin/
│   └── servers.json      # pgAdmin自動サーバー設定
└── README.md             # このファイル

scripts/
└── docker-setup.sh       # 自動セットアップスクリプト

.env.docker               # 環境変数テンプレート
docker-compose.yml        # Docker Compose設定
Makefile                  # 管理コマンド
```

## 🔒 セキュリティ注意事項

### 本番環境では必須変更
- PostgreSQLパスワード
- pgAdminパスワード  
- JWTシークレット

### 開発環境のみ使用
- デフォルトパスワードは開発用
- 本番環境では強力なパスワード使用
- HTTPS接続推奨

## 🎯 パフォーマンス最適化

### PostgreSQL設定済み項目
- `shared_buffers`: 256MB
- `effective_cache_size`: 1GB
- `work_mem`: 16MB
- ログ設定: スロークエリ検出

### 監視
```bash
# リソース使用量確認
docker stats

# データベース接続数確認
docker-compose exec postgres psql -U readmaker_user -d readmaker -c "SELECT count(*) FROM pg_stat_activity;"
```

## 📚 次のステップ

1. **Rustバックエンド**開発環境セットアップ
2. **JWT認証API**実装
3. **Expoフロントエンド**との統合
4. **本番環境**デプロイ準備