# マルチステージビルドでバイナリサイズを最適化
FROM rust:latest AS builder

# ベースイメージによりますが、一般的にはrustupを使います
RUN rustup update stable

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# ワークディレクトリを設定
WORKDIR /app

# 依存関係のみを先にビルド（キャッシュ効率化）
COPY Cargo.toml Cargo.lock ./
COPY api/Cargo.toml ./api/
COPY core/Cargo.toml ./core/
COPY shared/Cargo.toml ./shared/

# ダミーソースファイルを作成して依存関係をビルド
RUN mkdir -p api/src core/src shared/src \
    && echo "fn main() {}" > api/src/main.rs \
    && echo "// dummy" > core/src/lib.rs \
    && echo "// dummy" > shared/src/lib.rs \
    && cargo build --release --bin readmaker-api \
    && rm -rf api/src core/src shared/src

# 実際のソースコードをコピー
COPY . .

# 本番バイナリをビルド
RUN cargo build --release --bin readmaker-api

# 本番イメージ
FROM debian:bookworm-slim

# 必要なランタイムライブラリをインストール
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# アプリケーション用ユーザーを作成
RUN useradd -m -u 1000 appuser

# バイナリをコピー
COPY --from=builder /app/target/release/readmaker-api /usr/local/bin/readmaker-api

# 辞書ファイル用ディレクトリを作成
RUN mkdir -p /app/dictionaries \
    && chown -R appuser:appuser /app

# ユーザーを切り替え
USER appuser

# ワークディレクトリを設定
WORKDIR /app

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["readmaker-api"]