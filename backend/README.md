# ReadMaker Backend - Rust API Server

ReadMakerプロジェクトのRustバックエンドAPI環境です。Vibratoベースの形態素解析エンジンとAxum Webフレームワークを使用しています。

## 🚀 クイックスタート

### 前提条件
- Rust 1.75+ (`rustup` でインストール)
- Docker & Docker Compose
- PostgreSQL (Docker環境に含まれます)

### 1. 環境セットアップ
```bash
# リポジトリルートで実行
make setup          # PostgreSQL + pgAdmin4 + Redis 起動
make rust-setup     # Rust環境確認
```

### 2. 開発サーバー起動
```bash
# ホットリロード有効でAPIサーバー起動
make rust-dev

# または直接実行
cd backend/api
cargo watch -x run
```

## 📁 プロジェクト構造

```
backend/
├── Cargo.toml              # ワークスペース設定
├── Dockerfile              # 本番用コンテナビルド
├── README.md               # このファイル
│
├── api/                    # Web API サーバー
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs         # サーバーエントリーポイント
│       ├── config.rs       # 設定管理
│       ├── routes/         # API エンドポイント
│       ├── middleware/     # 認証・ログ等
│       ├── models/         # データモデル
│       └── database/       # DB接続・クエリ
│
├── core/                   # 形態素解析エンジン
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs          # メイン解析ロジック
│       └── ffi.rs          # React Native FFI ブリッジ
│
└── shared/                 # 共通ライブラリ
    ├── Cargo.toml
    └── src/
        ├── lib.rs
        ├── types.rs        # 共通型定義
        ├── utils.rs        # ユーティリティ関数
        └── errors.rs       # エラー型定義
```

## 🎯 API エンドポイント

### ヘルスチェック
```bash
GET /health
```

### 認証 (実装予定)
```bash
POST /auth/login          # ユーザーログイン
POST /auth/register       # ユーザー登録
```

### ユーザー管理 (実装予定)
```bash
GET  /users/profile       # プロフィール取得
PUT  /users/profile       # プロフィール更新
```

### 形態素解析・読書管理 (実装予定)
```bash
POST /reading/analyze     # テキスト解析
GET  /reading/stats       # 読書統計
```

## 🛠️ 開発コマンド

### Rust開発
```bash
# 環境確認
make rust-setup

# 開発サーバー起動 (ホットリロード)
make rust-dev

# テスト実行
make rust-test

# リリースビルド
make rust-build

# Dockerビルド確認
make rust-docker-build
```

### Docker管理
```bash
# 全サービス起動
make start

# 全サービス停止
make stop

# 全サービス再起動
make restart

# ログ表示
make logs           # 全サービス
make logs-pg        # PostgreSQL
make logs-admin     # pgAdmin4
make api-logs       # Rust API
```

### データベース操作
```bash
# データベース接続
make db-connect

# データベースリセット
make db-reset

# バックアップ・復元
make db-backup
make db-restore
```

## 🔧 設定

### 環境変数
```bash
# データベース接続
DATABASE_URL=postgresql://readmaker_user:readmaker_password@localhost:5432/readmaker

# Redis接続
REDIS_URL=redis://localhost:6379

# JWT認証 (本番環境では変更必須)
JWT_SECRET=your_jwt_secret_here_change_in_production

# サーバーポート
PORT=3000

# ログレベル
RUST_LOG=debug

# 形態素解析辞書パス (オプション)
READMAKER_DIC_PATH=dictionaries/ipadic.vibrato
```

### Docker環境設定
- **Rust API**: `http://localhost:3000`
- **pgAdmin4**: `http://localhost:8080`
  - Email: `admin@readmaker.com`
  - Password: `readmaker_password`
- **PostgreSQL**: `localhost:5432`
  - Username: `readmaker_user`
  - Password: `readmaker_password`
  - Database: `readmaker`
- **Redis**: `localhost:6379`

## 🏗️ 技術スタック

### Webフレームワーク
- **Axum**: 高速・型安全なWebフレームワーク
- **Tokio**: 非同期ランタイム
- **Tower**: ミドルウェア・サービス抽象化

### データベース
- **PostgreSQL**: メインデータベース
- **SQLx**: 型安全なSQL実行・マイグレーション
- **Redis**: セッション・キャッシュ管理

### 認証・セキュリティ
- **JWT**: トークンベース認証
- **bcrypt**: パスワードハッシュ化
- **UUID**: 一意識別子生成

### 形態素解析
- **Vibrato**: 高速日本語形態素解析エンジン
- **zstd**: 辞書圧縮・展開

### 開発・デプロイ
- **cargo-watch**: ホットリロード開発
- **Docker**: コンテナ化・本番デプロイ
- **serde**: JSON シリアライゼーション
- **tracing**: 構造化ログ

## 🧪 テスト

```bash
# 全テスト実行
make rust-test

# 特定クレートのテスト
cd backend/core && cargo test
cd backend/shared && cargo test
cd backend/api && cargo test

# 統合テスト (実装予定)
cd backend && cargo test --test integration_tests
```

## 📦 ビルド・デプロイ

### 開発ビルド
```bash
cargo build
```

### リリースビルド
```bash
make rust-build
# または
cargo build --release
```

### Dockerビルド
```bash
# コンテナビルド
docker-compose build api

# 起動確認
docker-compose up api
```

## 🐛 トラブルシューティング

### よくある問題

#### 1. データベース接続エラー
```bash
# PostgreSQLが起動しているか確認
make logs-pg

# データベース再起動
make restart
```

#### 2. ポート競合
```bash
# ポート使用状況確認
lsof -i :3000  # API
lsof -i :5432  # PostgreSQL
lsof -i :8080  # pgAdmin4
```

#### 3. 辞書ファイルが見つからない
```bash
# 辞書ファイルパスを確認
ls -la ReadMaker/native/rust/dictionaries/

# 環境変数設定
export READMAKER_DIC_PATH=path/to/your/dictionary.vibrato
```

#### 4. Rust依存関係の問題
```bash
# キャッシュクリア
cargo clean

# 依存関係更新
cargo update

# 再ビルド
cargo build
```

## 🔒 セキュリティ注意事項

### 開発環境
- デフォルトパスワードは開発用です
- JWT秘密鍵は開発用です

### 本番環境では必須変更
- PostgreSQLパスワード
- pgAdminパスワード
- JWT秘密鍵
- HTTPS接続設定
- ファイアウォール設定

## 📚 次のステップ

### 実装予定機能
1. **JWT認証システム**完成
2. **ユーザー管理API**実装
3. **形態素解析API**統合
4. **読書統計機能**実装
5. **Expo フロントエンド**統合
6. **本番環境デプロイ**準備

### 開発優先度
1. 認証ミドルウェア実装
2. データベースモデル定義
3. 形態素解析APIエンドポイント
4. ユーザー関連API完成
5. テストカバレッジ向上

## 📖 参考資料

- [Axum ドキュメント](https://docs.rs/axum/)
- [SQLx ガイド](https://github.com/launchbadge/sqlx)
- [Vibrato 形態素解析](https://github.com/daac-tools/vibrato)
- [Tokio 非同期プログラミング](https://tokio.rs/)
- [Rust Docker ベストプラクティス](https://docs.docker.com/language/rust/)

---

🦀 **Happy Coding with Rust!**