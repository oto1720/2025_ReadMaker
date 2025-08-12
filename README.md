# ReadMaker - 読書支援アプリ 📚

ReadMakerは日本語文章の読書体験を向上させるクロスプラットフォーム・モバイルアプリケーションです。Vibratoベースの形態素解析エンジンとJWT認証システムを搭載したRust製バックエンドと、React Native/Expoフロントエンドで構成されています。

## 🚀 主要機能

### ✅ 実装済み
- **JWT認証システム** - ユーザー登録・ログイン・セキュアトークン管理
- **Rust高性能バックエンド** - Axum + PostgreSQL + Redis
- **形態素解析エンジン** - Vibrato辞書による日本語解析
- **React Native UI** - 美しいグラデーション認証画面
- **Docker環境** - 開発・本番両対応の完全なコンテナ化

### 🔄 開発予定
- **テキスト解析API** - 読書統計・語彙解析
- **読書セッション管理** - 進捗追跡・時間計測
- **ユーザープロフィール** - 読書履歴・成績表示

## 🏗️ アーキテクチャ

### バックエンド（Rust）
```
backend/
├── api/           # Axum Web API サーバー
├── core/          # Vibrato 形態素解析エンジン
├── shared/        # 共通ライブラリ・型定義
└── Dockerfile     # 本番環境デプロイ用
```

### フロントエンド（React Native/Expo）
```
ReadMaker/
├── app/
│   ├── auth/      # 認証画面（ログイン・登録）
│   └── (tabs)/    # メインアプリケーション
└── src/
    ├── contexts/  # グローバル状態管理
    ├── services/  # API通信・認証サービス
    └── types/     # TypeScript型定義
```

## 🔧 技術スタック

### バックエンド
- **言語**: Rust 1.75+
- **Webフレームワーク**: Axum + Tokio
- **データベース**: PostgreSQL + SQLx
- **認証**: JWT + bcrypt
- **形態素解析**: Vibrato + zstd圧縮
- **キャッシュ**: Redis
- **コンテナ**: Docker + Docker Compose

### フロントエンド  
- **言語**: TypeScript
- **フレームワーク**: React Native + Expo
- **ナビゲーション**: Expo Router
- **HTTP通信**: Axios
- **セキュリティ**: Expo SecureStore
- **状態管理**: React Context API

## ⚡ クイックスタート

### 前提条件
- Node.js 18+
- Rust 1.75+
- Docker & Docker Compose
- iOS/Android開発環境（シミュレータ用）

### 1. リポジトリクローン
```bash
git clone https://github.com/oto1720/2025_ReadMaker.git
cd 2025_ReadMaker
```

### 2. バックエンド起動
```bash
# データベース・Redis起動
make setup

# Rust API開発サーバー起動（ホットリロード）
make rust-dev
```

### 3. フロントエンド起動
```bash
cd ReadMaker
npm install
npm start
```

### 4. アプリアクセス
- **Rust API**: http://localhost:3000
- **pgAdmin4**: http://localhost:8080
- **Expo Dev**: QRコードでスマートフォンアクセス

## 📋 API エンドポイント

### 認証系
```http
POST /auth/register   # ユーザー登録
POST /auth/login      # ユーザーログイン
GET  /health          # ヘルスチェック
```

### 実装予定
```http
POST /reading/analyze # テキスト形態素解析
GET  /reading/stats   # 読書統計取得
GET  /users/profile   # ユーザープロフィール
PUT  /users/profile   # プロフィール更新
```

## 🔨 開発コマンド

### バックエンド開発
```bash
make rust-setup       # Rust環境セットアップ確認
make rust-dev         # ホットリロード開発サーバー
make rust-test        # テスト実行
make rust-build       # リリースビルド
make api-logs         # APIログ表示
```

### データベース操作
```bash
make db-connect       # PostgreSQL接続
make db-reset         # データベースリセット
make db-backup        # バックアップ作成
make logs-pg          # PostgreSQLログ表示
```

### Docker管理
```bash
make start            # 全サービス起動
make stop             # 全サービス停止
make restart          # 全サービス再起動
make clean            # 完全クリーンアップ
```

## 📱 認証システム使用方法

### ユーザー登録
```json
POST /auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

### ログイン
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### レスポンス形式
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1Q...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "username": "username",
      "created_at": "2025-01-01T00:00:00Z"
    }
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 🔒 セキュリティ機能

### バックエンド
- **JWT認証** - 24時間有効トークン
- **bcryptパスワードハッシュ化** - ソルト付き暗号化
- **入力バリデーション** - SQLインジェクション対策
- **CORS設定** - クロスオリジン制御

### フロントエンド
- **SecureStore** - OS レベルセキュア储存
- **自動トークン付与** - API リクエスト認証ヘッダー
- **認証状態管理** - セッション自動検出・復元

## 📊 データベース設計

### users テーブル
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛠️ 開発環境設定

### 環境変数
```bash
# backend/.env
DATABASE_URL=postgresql://readmaker_user:readmaker_password@localhost:5432/readmaker
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here_change_in_production
PORT=3000
RUST_LOG=debug
```

### Docker環境アクセス情報
- **PostgreSQL**: `localhost:5432`
  - User: `readmaker_user`
  - Password: `readmaker_password`
  - Database: `readmaker`
- **pgAdmin4**: `localhost:8080`
  - Email: `admin@readmaker.com`
  - Password: `readmaker_password`
- **Redis**: `localhost:6379`

## 🧪 テスト

```bash
# バックエンドテスト
make rust-test

# フロントエンドテスト（実装予定）
cd ReadMaker && npm test
```

## 📝 プロジェクト構成

```
2025_ReadMaker/
├── backend/                    # Rust バックエンド
│   ├── api/                   # Web API サーバー
│   ├── core/                  # 形態素解析コア
│   ├── shared/                # 共通ライブラリ
│   ├── Dockerfile            # コンテナ設定
│   └── README.md             # バックエンド詳細ドキュメント
├── ReadMaker/                 # React Native フロントエンド
│   ├── app/                  # Expo Router ページ
│   └── src/                  # アプリケーションソース
├── database/                  # データベーススキーマ
├── docker/                   # Docker設定・pgAdmin設定
├── scripts/                  # セットアップ・管理スクリプト
├── docker-compose.yml        # 開発環境構成
├── Makefile                  # 開発コマンド定義
└── README.md                 # このファイル
```

## 🚧 今後の開発予定

### Phase 2: コア機能実装
- [ ] テキスト解析APIの完成
- [ ] 読書セッション管理
- [ ] 語彙統計・進捗可視化
- [ ] ユーザープロフィール機能

### Phase 3: 機能拡張
- [ ] オフライン読書モード
- [ ] 読書目標設定・達成システム
- [ ] ソーシャル機能（読書記録共有）
- [ ] 多言語対応（英語・中国語）

### Phase 4: 本番運用
- [ ] CI/CD パイプライン
- [ ] ヘルスモニタリング
- [ ] パフォーマンス最適化
- [ ] App Store / Google Play 配信

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご確認ください。

## 📞 サポート・問い合わせ

- **Issues**: [GitHub Issues](https://github.com/oto1720/2025_ReadMaker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oto1720/2025_ReadMaker/discussions)

---

**ReadMaker** - より良い読書体験を、すべての人に 📖✨
