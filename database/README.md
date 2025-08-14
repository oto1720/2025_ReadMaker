# ReadMaker Database Schema

ReadMakerアプリのPostgreSQLデータベース設計とマイグレーション管理。

## データベース構造

### 認証関連テーブル

#### `users`
- **目的**: ユーザーの基本認証情報
- **主要フィールド**:
  - `id`: UUID主キー
  - `email`: 一意のメールアドレス
  - `username`: 一意のユーザー名
  - `password_hash`: bcryptハッシュ化パスワード
  - `email_verified`: メール認証状態
  - `is_active`: アカウント有効状態

#### `user_sessions`
- **目的**: アクティブセッション管理
- **主要フィールド**:
  - `user_id`: ユーザーID（外部キー）
  - `token_hash`: JWTトークンハッシュ
  - `expires_at`: 有効期限
  - `device_info`: デバイス情報

#### `password_reset_tokens`
- **目的**: パスワードリセット機能
- **有効期限**: 24時間

#### `email_verification_tokens`
- **目的**: メール認証機能
- **有効期限**: 24時間

### ユーザープロフィール関連テーブル

#### `user_profiles`
- **目的**: ユーザーの詳細情報と設定
- **主要フィールド**:
  - `reading_goal_daily`: 1日の読書目標（分）
  - `reading_streak_current`: 現在の連続読書日数
  - `language_preference`: 言語設定

#### `reading_stats`
- **目的**: 日次読書統計
- **主要フィールド**:
  - `date`: 統計日付
  - `reading_time_minutes`: 読書時間
  - `words_read`: 読んだ単語数
  - `articles_completed`: 完了記事数

#### `user_reading_preferences`
- **目的**: 読書表示設定
- **主要フィールド**:
  - `font_size`: フォントサイズ
  - `theme`: テーマ（light/dark/sepia）
  - `reading_speed_wpm`: 読書速度

#### `user_achievements`
- **目的**: ユーザー実績管理
- **Achievement Types**:
  - `reading_streak`: 連続読書日数
  - `words_read`: 累計読書単語数
  - `articles_completed`: 完了記事数

## セットアップ

### 1. PostgreSQLデータベース作成

```bash
# PostgreSQL接続
psql -U postgres

# データベース作成
CREATE DATABASE readmaker;
CREATE USER readmaker_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE readmaker TO readmaker_user;
```

### 2. スキーマ実行

```bash
# 完全スキーマ実行
psql -U readmaker_user -d readmaker -f database/schema.sql

# または段階的マイグレーション
psql -U readmaker_user -d readmaker -f database/migrations/001_create_users.sql
psql -U readmaker_user -d readmaker -f database/migrations/002_create_user_profiles.sql
```

### 3. 環境変数設定

```bash
# .env ファイル
DATABASE_URL=postgresql://readmaker_user:your_password@localhost:5432/readmaker
JWT_SECRET=your_jwt_secret_key
```

## 主要機能

### 自動生成される機能

1. **デフォルトプロフィール作成**: 新規ユーザー登録時に自動でプロフィール作成
2. **タイムスタンプ更新**: `updated_at`フィールドの自動更新
3. **読書ストリーク計算**: 連続読書日数の自動計算

### クリーンアップ機能

```sql
-- 期限切れセッション削除
SELECT cleanup_expired_sessions();

-- 期限切れトークン削除
SELECT cleanup_expired_tokens();
```

### 読書ストリーク更新

```sql
-- 読書統計追加時のストリーク更新
SELECT update_reading_streak('user_id', '2024-01-15');
```

## インデックス戦略

### パフォーマンス最適化

- **Email/Username検索**: B-treeインデックス
- **日付範囲検索**: 複合インデックス（user_id, date）
- **セッション管理**: 有効期限インデックス

### 制約

- **Email形式**: 正規表現による検証
- **Username形式**: 英数字とアンダースコアのみ
- **読書目標**: 非負数制約
- **フォントサイズ**: 8-72ピクセル範囲

## セキュリティ考慮事項

1. **パスワード**: bcryptハッシュ化必須
2. **UUID使用**: 推測困難な主キー
3. **カスケード削除**: ユーザー削除時の関連データ自動削除
4. **トークン有効期限**: 適切な期限設定

## 拡張予定

- 記事コンテンツテーブル
- ブックマーク機能
- ソーシャル機能（フォロー/フォロワー）
- 読書グループ機能