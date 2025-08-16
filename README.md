# ReadMaker - 読書支援アプリ 📚
test
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

## 🐳 Docker初心者ガイド

### Dockerとは？
Dockerは、アプリケーションとその実行環境（データベース、キャッシュサーバーなど）を簡単に管理できるツールです。このプロジェクトでは、複雑なPostgreSQLやRedisの設定を自動化します。

### Docker Desktop のインストール

#### Windows
1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) をダウンロード
2. インストーラーを実行し、指示に従ってインストール
3. 再起動後、Docker Desktopを起動
4. WSL 2バックエンドの使用が推奨されます

#### macOS
1. [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/) をダウンロード
2. dmgファイルをマウントし、Docker.appをApplicationsフォルダにドラッグ
3. Docker Desktopを起動

### Docker動作確認
```bash
# Dockerが正しくインストールされているか確認
docker --version
docker-compose --version
```

### トラブルシューティング
- **Windows**: WSL 2が有効になっていることを確認
- **メモリ不足エラー**: Docker Desktopの設定でメモリを4GB以上に増加
- **ポート競合**: 他のアプリケーションがポート3000, 5432, 6379を使用していないか確認

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

> **💡 Docker初心者の方へ：** Dockerとは、アプリケーションとその実行環境をパッケージ化するツールです。このプロジェクトでは、PostgreSQLデータベースやRedisキャッシュサーバーをDockerで簡単に起動できます。

### 1. リポジトリクローン
```bash
git clone https://github.com/oto1720/2025_ReadMaker.git
cd 2025_ReadMaker
```

### 2. 環境変数の設定

#### macOS/Linux
```bash
# ローカル開発用環境変数
cp .env.example .env

# Docker環境用環境変数
cp .env.docker.example .env.docker

# JWT_SECRETを安全な値に更新（両ファイル）
openssl rand -hex 32
```

#### Windows (PowerShell)
```powershell
# ローカル開発用環境変数
Copy-Item .env.example .env

# Docker環境用環境変数  
Copy-Item .env.docker.example .env.docker

# JWT_SECRETを安全な値に更新（両ファイル）
# PowerShellで32文字のランダム文字列を生成
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

#### Windows (Command Prompt)
```cmd
# ローカル開発用環境変数
copy .env.example .env

# Docker環境用環境変数
copy .env.docker.example .env.docker

# JWT_SECRETは手動で32文字のランダム文字列に変更してください
# 例: your_jwt_secret_here_change_in_production
```

**重要：** `.env`と`.env.docker`の違い
- `.env` → ローカル開発（`localhost`で接続）
- `.env.docker` → Docker環境（コンテナ名で接続）

### 3. バックエンド起動

#### macOS/Linux (makeコマンド使用)
```bash
# データベース・Redis起動
make setup

# Rust API開発サーバー起動（ホットリロード）
make rust-dev
```

#### Windows (Docker Composeコマンド直接実行)
```powershell
# データベース・Redis起動
docker-compose up -d

# Rust API開発サーバー起動（ホットリロード）
# 別のターミナルで実行
cd backend/api
cargo watch -x run
```

> **💡 Windows向け補足：**
> - `make`コマンドが使えない場合は、上記のDocker Composeコマンドを直接実行してください
> - `cargo watch`がインストールされていない場合：`cargo install cargo-watch`

### 4. フロントエンド起動
```bash
cd ReadMaker
npm install
npm start
```

### 5. アプリアクセス
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

#### macOS/Linux
```bash
make rust-setup       # Rust環境セットアップ確認
make rust-dev         # ホットリロード開発サーバー
make rust-test        # テスト実行
make rust-build       # リリースビルド
make api-logs         # APIログ表示
```

#### Windows
```powershell
# Rust環境セットアップ確認
rustc --version
cd backend && cargo check

# ホットリロード開発サーバー
cargo install cargo-watch  # 初回のみ
cd backend/api && cargo watch -x run

# テスト実行
cd backend && cargo test

# リリースビルド
cd backend && cargo build --release

# APIログ表示
docker-compose logs -f api
```

### データベース操作

#### macOS/Linux
```bash
make db-connect       # PostgreSQL接続
make db-reset         # データベースリセット
make db-backup        # バックアップ作成
make logs-pg          # PostgreSQLログ表示
```

#### Windows
```powershell
# PostgreSQL接続
docker-compose exec postgres psql -U readmaker_user -d readmaker

# データベースリセット
docker-compose down
docker volume rm 2025_readmaker_postgres_data
docker-compose up -d

# PostgreSQLログ表示
docker-compose logs -f postgres
```

### Docker管理

#### macOS/Linux
```bash
make start            # 全サービス起動
make stop             # 全サービス停止
make restart          # 全サービス再起動
make clean            # 完全クリーンアップ
```

#### Windows
```powershell
# 全サービス起動
docker-compose up -d

# 全サービス停止
docker-compose down

# 全サービス再起動
docker-compose restart

# 完全クリーンアップ
docker-compose down -v --remove-orphans
docker system prune -f
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

## 🚀 本番環境デプロイ（Railway + EAS）

### 概要
**Railway**でバックエンドAPI、**Expo Application Services (EAS)**でモバイルアプリをデプロイする構成です。開発チームに最適化された実用的なデプロイ方法です。

**推定コスト**: 月額$10-25（Railway + EAS）
**構築時間**: 1-2時間
**難易度**: 初級〜中級

### アーキテクチャ
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   EAS Build     │    │   Railway API   │    │  Railway DB     │
│   (Mobile App)  │───▶│   (Rust API)    │───▶│  (PostgreSQL)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│   App Store     │    │   Web Access    │
│   Google Play   │    │   API Endpoint  │
└─────────────────┘    └─────────────────┘
```

---

## 📋 STEP 1: Railway バックエンドデプロイ

### 1-1. Railway アカウント設定
```bash
# 1. https://railway.app でアカウント作成
# 2. GitHubアカウントでログイン
# 3. New Project → Deploy from GitHub repo
```

### 1-2. Railway CLI インストール
```bash
# macOS
brew install railway

# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Linux
curl -fsSL https://railway.app/install.sh | sh

# ログイン
railway login
```

### 1-3. プロジェクト設定
```bash
# プロジェクトディレクトリで実行
cd 2025_ReadMaker
railway init

# サービス作成
railway add --database postgres
railway add --service api
```

---

## 📋 STEP 2: Railway用Docker設定

### 2-1. Railway用Dockerfileの最適化
既存の`backend/Dockerfile`をRailway用に最適化：

```dockerfile
# backend/Dockerfile.railway
FROM rust:1.75-slim as builder

WORKDIR /app

# システム依存関係インストール
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 依存関係のキャッシュ用
COPY Cargo.toml Cargo.lock ./
COPY api/Cargo.toml ./api/
COPY core/Cargo.toml ./core/
COPY shared/Cargo.toml ./shared/

# 空のsrcディレクトリを作成してキャッシュ
RUN mkdir -p api/src core/src shared/src && \
    echo "fn main() {}" > api/src/main.rs && \
    echo "// lib" > core/src/lib.rs && \
    echo "// lib" > shared/src/lib.rs

# 依存関係ビルド
RUN cargo build --release --bin api
RUN rm -rf api/src core/src shared/src

# 実際のソースコードをコピー
COPY . .

# アプリケーションビルド
RUN cargo build --release --bin api

# 本番用イメージ
FROM debian:bullseye-slim

# 必要なランタイム依存関係
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl1.1 \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ビルドされたバイナリをコピー
COPY --from=builder /app/target/release/api ./api

# 非rootユーザー作成
RUN useradd -m -u 1001 appuser && chown appuser:appuser /app/api
USER appuser

EXPOSE 3000

CMD ["./api"]
```

### 2-2. Railway設定ファイル
```json
{
  "name": "readmaker-api",
  "build": {
    "dockerfile": "backend/Dockerfile.railway"
  },
  "deploy": {
    "healthcheckPath": "/health",
    "restartPolicyType": "on-failure"
  }
}
```

### 2-3. 環境変数設定
```bash
# Railway環境変数設定
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set RUST_LOG=info
railway variables set APP_ENV=production
railway variables set PORT=3000

# PostgreSQL接続（Railwayが自動設定）
# DATABASE_URL は自動で設定されます
```

---

## 📋 STEP 3: EAS フロントエンドデプロイ

### 3-1. EAS CLI セットアップ
```bash
# EAS CLIインストール
npm install -g @expo/eas-cli

# Expoアカウントログイン
eas login

# ReadMakerディレクトリで初期化
cd ReadMaker
eas init --id your-expo-project-id
```

### 3-2. EAS設定ファイル作成
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium",
        "simulator": true
      },
      "android": {
        "resourceClass": "medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "resourceClass": "medium"
      },
      "env": {
        "API_BASE_URL": "https://readmaker-api-production.up.railway.app"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3-3. アプリ設定更新
```javascript
// ReadMaker/app.config.js
export default {
  expo: {
    name: "ReadMaker",
    slug: "readmaker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.readmaker.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.readmaker.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
      eas: {
        projectId: "your-expo-project-id"
      }
    }
  }
};
```

---

## 📋 STEP 4: API接続設定

### 4-1. フロントエンド環境変数設定
```javascript
// ReadMaker/src/config/api.js
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_BASE_URL;
```

### 4-2. APIサービス更新
```javascript
// ReadMaker/src/services/auth.js
import axios from 'axios';
import { apiConfig } from '../config/api';

const api = axios.create(apiConfig);

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async getCurrentUser(token) {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }
};
```

---

## 📋 STEP 5: デプロイ実行

### 5-1. Railway バックエンドデプロイ
```bash
# プロジェクトディレクトリで実行
cd 2025_ReadMaker

# Railwayにデプロイ
railway up

# デプロイ状況確認
railway status

# ログ確認
railway logs

# ドメイン確認
railway domain
# 例: https://readmaker-api-production.up.railway.app
```

### 5-2. EAS モバイルアプリビルド
```bash
cd ReadMaker

# 開発用ビルド
eas build --platform all --profile development

# プレビュー用ビルド（テスター配布）
eas build --platform all --profile preview

# 本番用ビルド（ストア申請用）
eas build --platform all --profile production
```

### 5-3. EAS Submit（ストア配信）
```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

---

## 📋 STEP 6: CI/CD パイプライン

### 6-1. GitHub Actions for Railway
```yaml
# .github/workflows/deploy-railway.yml
name: Deploy to Railway

on:
  push:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Install Railway CLI
      run: npm install -g @railway/cli

    - name: Deploy to Railway
      run: railway up --service backend
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 6-2. GitHub Actions for EAS
```yaml
# .github/workflows/eas-build.yml
name: EAS Build

on:
  push:
    branches: [ main ]
    paths: [ 'ReadMaker/**' ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Setup Expo and EAS
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        eas-version: latest
        token: ${{ secrets.EXPO_TOKEN }}

    - name: Install dependencies
      run: cd ReadMaker && npm install

    - name: Build app
      run: cd ReadMaker && eas build --platform all --profile preview --non-interactive
```

---

## 📋 STEP 7: 運用・監視

### 7-1. Railway 監視設定
```bash
# Railway Dashboard での設定項目:
# - Health Check: /health
# - Auto-restart: Enabled
# - Resource Usage Alerts
# - Custom Domain (オプション)

# メトリクス確認
railway metrics

# アラート設定
# Railway Dashboard > Settings > Alerts
```

### 7-2. EAS 監視設定
```bash
# EAS Dashboard での確認項目:
# - Build Status
# - Distribution
# - Crash Reports
# - Usage Analytics

# アプリアップデート配信
eas update --branch production --message "Bug fixes and improvements"
```

---

## 🎯 完了確認

### デプロイ完了チェックリスト
```bash
# ✅ Railway API確認
curl https://your-railway-domain.railway.app/health

# ✅ Railway環境変数確認
railway variables

# ✅ データベース接続確認
railway connect postgres

# ✅ EAS ビルド確認
eas build:list

# ✅ モバイルアプリ動作確認
# TestFlightまたはInternal App Sharingでテスト
```

### アクセス情報
- **API Endpoint**: `https://your-railway-domain.railway.app`
- **Railway Dashboard**: `https://railway.app/dashboard`
- **EAS Dashboard**: `https://expo.dev/accounts/your-account/projects/readmaker`
- **Mobile App**: TestFlight (iOS) / Internal Testing (Android)

### トラブルシューティング
```bash
# Railway
railway logs --tail 100
railway status
railway restart

# EAS
eas build:list
eas build:view [build-id]
eas diagnostics
```

**推定デプロイ時間**: 
- Railway: 5-10分
- EAS Build: 15-25分

**月額コスト**: 
- Railway: $5-20（使用量による）
- EAS: $99/月（プロプラン）または従量課金

---

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
