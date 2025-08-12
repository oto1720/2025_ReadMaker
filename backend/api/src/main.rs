use axum::{
    extract::Extension,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde_json::{json, Value};
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tracing::{info, Level};
use tracing_subscriber;

mod routes;
mod middleware;
mod models;
mod database;
mod config;

use crate::config::Config;
use crate::database::DatabaseConnection;
use crate::routes::{auth, users, reading, health};

#[tokio::main]
async fn main() {
    // ログ初期化
    tracing_subscriber::fmt()
        .with_target(false)
        .with_max_level(Level::DEBUG)
        .init();

    // 設定読み込み
    let config = Config::from_env().expect("設定の読み込みに失敗しました");
    
    // データベース接続
    let db = DatabaseConnection::new(&config.database_url)
        .await
        .expect("データベース接続に失敗しました");

    // ルーター設定
    let app = Router::new()
        .route("/health", get(health::health_check))
        .nest("/auth", auth::routes())
        .nest("/users", users::routes())
        .nest("/reading", reading::routes())
        .layer(CorsLayer::permissive())
        .layer(Extension(db.pool()));

    // サーバー起動
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    info!("🚀 ReadMaker API サーバーを起動: http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}