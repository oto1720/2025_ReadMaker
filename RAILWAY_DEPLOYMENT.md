# ReadMaker Railway + EAS デプロイメントガイド

Railway（バックエンド）+ EAS（モバイルアプリ）での本番環境構築の詳細ガイドです。

## 🎯 デプロイ構成概要

```
┌─────────────────────────────────────────────────────────────┐
│                    ReadMaker Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 Mobile App (EAS)    🔄 GitHub Actions    🚀 API (Railway) │
│  ┌─────────────────┐    ┌─────────────────┐   ┌─────────────┐ │
│  │   React Native  │    │  Automated      │   │ Rust API    │ │
│  │   Expo Router   │───▶│  CI/CD          │──▶│ Axum Server │ │
│  │   TypeScript    │    │  Testing        │   │ PostgreSQL  │ │
│  └─────────────────┘    └─────────────────┘   └─────────────┘ │
│         │                                           │        │
│         ▼                                           ▼        │
│  ┌─────────────────┐                         ┌─────────────┐ │
│  │   App Stores    │                         │  Railway    │ │
│  │  • App Store    │                         │  Dashboard  │ │
│  │  • Google Play  │                         │  Monitoring │ │
│  └─────────────────┘                         └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 クイックスタート（30分でデプロイ）

### 前提条件チェックリスト
- [ ] GitHubアカウント
- [ ] Railwayアカウント（GitHubログイン）
- [ ] Expoアカウント
- [ ] Apple Developer Account（iOS配信時）
- [ ] Google Play Console Account（Android配信時）

### 1. Railway バックエンドセットアップ

#### 1-1. Railway プロジェクト作成
```bash
# 1. https://railway.app でGitHubログイン
# 2. "New Project" → "Deploy from GitHub repo"
# 3. ReadMakerリポジトリを選択
# 4. "Add Service" → "Database" → "PostgreSQL"
```

#### 1-2. 環境変数設定
```bash
# Railway Dashboard > Variables で設定
JWT_SECRET=your_32_character_secret_here
RUST_LOG=info
APP_ENV=production
PORT=3000

# DATABASE_URL は PostgreSQL サービスで自動設定されます
```

#### 1-3. デプロイ設定確認
```bash
# Railway が railway.json を自動検出
# backend/Dockerfile.railway を使用してビルド
# ヘルスチェック: /health エンドポイント
```

### 2. EAS モバイルアプリセットアップ

#### 2-1. EAS プロジェクト初期化
```bash
# ReadMaker ディレクトリで実行
cd ReadMaker

# EAS CLI インストール（グローバル）
npm install -g @expo/eas-cli

# Expo ログイン
eas login

# プロジェクト初期化
eas init
```

#### 2-2. プロジェクト設定
```bash
# eas.json が自動生成される
# app.config.js でプロジェクト設定
# src/config/api.js で API エンドポイント設定
```

### 3. CI/CD パイプライン設定

#### 3-1. GitHub Secrets 設定
```bash
# Repository Settings > Secrets and variables > Actions

# Railway 関連
RAILWAY_TOKEN=railway_xxxxxxxx
RAILWAY_DOMAIN=your-project-name-production.up.railway.app

# EAS 関連  
EXPO_TOKEN=expo_xxxxxxxx
EXPO_PROJECT_ID=your-expo-project-id

# 通知（オプション）
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx
```

#### 3-2. 自動デプロイ確認
```bash
# backend/ ファイル変更 → Railway 自動デプロイ
# ReadMaker/ ファイル変更 → EAS 自動ビルド

git add .
git commit -m "Setup Railway + EAS deployment"
git push origin main
```

## 📱 モバイルアプリビルド & 配信

### 開発用ビルド
```bash
cd ReadMaker

# 開発用（Development Client）
eas build --platform all --profile development

# プレビュー用（Internal Testing）
eas build --platform all --profile preview
```

### 本番用ビルド
```bash
# App Store / Google Play 申請用
eas build --platform all --profile production

# ビルド状況確認
eas build:list

# 特定ビルドの詳細
eas build:view [build-id]
```

### ストア申請
```bash
# iOS App Store
eas submit --platform ios

# Google Play Store  
eas submit --platform android

# 申請状況確認
eas submit:list
```

## 🔧 開発ワークフロー

### 日常的な開発フロー
```bash
# 1. 機能開発
git checkout -b feature/new-feature
# コード変更

# 2. プレビューテスト
git push origin feature/new-feature
# GitHub Actions でプレビュービルド自動実行

# 3. メインマージ
git checkout main
git merge feature/new-feature
git push origin main
# 本番デプロイ & プロダクションビルド自動実行
```

### ホットフィックス対応
```bash
# 緊急修正
git checkout -b hotfix/critical-fix
# 修正コード

# 即座にデプロイ
git checkout main
git merge hotfix/critical-fix
git push origin main

# モバイルアプリのホットアップデート
cd ReadMaker
eas update --branch production --message "Critical bug fix"
```

## 📊 監視・運用

### Railway 監視
```bash
# リアルタイム監視
railway logs --tail

# メトリクス確認
railway metrics

# 環境変数確認
railway variables

# データベース接続
railway connect postgres

# サービス再起動
railway restart
```

### EAS 監視
```bash
# ビルド履歴
eas build:list

# 配信状況
eas submit:list

# アップデート履歴
eas update:list

# プロジェクト情報
eas project:info

# 使用量確認
eas analytics
```

### API 動作確認
```bash
# ヘルスチェック
curl https://your-railway-domain.up.railway.app/health

# ユーザー登録テスト
curl -X POST https://your-railway-domain.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

## 🔒 セキュリティ設定

### Railway セキュリティ
```bash
# 環境変数暗号化（Railway で自動）
# HTTPS 通信（Railway で自動有効）
# データベース接続暗号化
# 定期的なセキュリティ更新
```

### EAS セキュリティ
```bash
# コード署名証明書管理
# アプリストア配信時の検証
# 機密情報の環境変数管理
# ビルド時の依存関係スキャン
```

### GitHub セキュリティ
```bash
# Secrets の適切な管理
# Dependabot による依存関係更新
# CodeQL による脆弱性スキャン
# ブランチ保護ルール
```

## 💰 コスト見積もり

### Railway コスト
| プラン | 月額料金 | リソース | 用途 |
|--------|---------|----------|------|
| Free | $0 | $5 クレジット | 開発・テスト |
| Hobby | $5 | $5 + 従量課金 | 小規模本番 |
| Pro | $20 | $20 + 従量課金 | 中規模本番 |

### EAS コスト
| プラン | 月額料金 | ビルド数 | 用途 |
|--------|---------|----------|------|
| Free | $0 | 30ビルド/月 | 開発・テスト |
| Production | $99 | 無制限 | 本番運用 |

### 推定総コスト
```bash
# 開発段階: $0-5/月
# 小規模運用: $5-20/月  
# 本格運用: $104-119/月（Railway Pro + EAS Production）
```

## 📈 スケーリング戦略

### Railway スケーリング
```bash
# 垂直スケーリング
# - CPU: 0.5vCPU → 32vCPU
# - Memory: 512MB → 32GB
# - Storage: 自動拡張

# 水平スケーリング
# - 複数リージョンデプロイ
# - ロードバランサー
# - CDN 連携
```

### データベース最適化
```sql
-- インデックス最適化
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_created_at ON users(created_at);

-- 定期メンテナンス
VACUUM ANALYZE;
REINDEX DATABASE readmaker;

-- パフォーマンス監視
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### Railway デプロイエラー
```bash
# ログ確認
railway logs --tail 100

# 環境変数確認
railway variables

# 手動再デプロイ
railway up --detach

# ロールバック
railway rollback
```

#### EAS ビルドエラー
```bash
# ビルドログ確認
eas build:view [build-id]

# キャッシュクリア
eas build --clear-cache

# 依存関係更新
cd ReadMaker && npm update

# 設定確認
eas config
```

#### API接続エラー
```bash
# ネットワーク確認
curl -I https://your-railway-domain.up.railway.app/health

# DNS確認
nslookup your-railway-domain.up.railway.app

# SSL証明書確認
openssl s_client -connect your-railway-domain.up.railway.app:443
```

#### データベース接続エラー
```bash
# 接続テスト
railway connect postgres

# 接続数確認
SELECT count(*) FROM pg_stat_activity;

# ロック確認
SELECT * FROM pg_locks WHERE NOT granted;
```

## 🔄 バックアップ・復旧

### Railway バックアップ
```bash
# データベース自動バックアップ（Railway Pro）
# - 毎日自動バックアップ
# - 7日間保持
# - ワンクリック復元

# 手動バックアップ
railway db backup create

# バックアップ一覧
railway db backup list

# 復元
railway db backup restore [backup-id]
```

### 設定ファイルバックアップ
```bash
# 重要設定ファイル
- railway.json
- backend/Dockerfile.railway
- .github/workflows/
- ReadMaker/eas.json
- ReadMaker/app.config.js

# Git でのバージョン管理が基本
git tag v1.0.0  # リリースタグ
git push origin --tags
```

## 📞 サポート・ヘルプ

### 公式ドキュメント
- [Railway Docs](https://docs.railway.app/)
- [EAS Docs](https://docs.expo.dev/eas/)
- [Expo Docs](https://docs.expo.dev/)

### コミュニティ
- [Railway Discord](https://discord.gg/railway)
- [Expo Discord](https://chat.expo.dev/)
- [GitHub Discussions](https://github.com/oto1720/2025_ReadMaker/discussions)

### 緊急時対応
```bash
# Railway ステータス
https://status.railway.app/

# Expo ステータス  
https://status.expo.dev/

# GitHub ステータス
https://www.githubstatus.com/
```

---

**🎉 これで ReadMaker の本格的な本番環境が完成です！**

Railway で安定したバックエンド、EAS で高品質なモバイルアプリを配信できます。