use axum::{
    routing::{get, put},
    Router, Json, http::StatusCode,
    extract::Extension,
};
use serde_json::{json, Value};
use sqlx::PgPool;

pub fn routes() -> Router {
    Router::new()
        .route("/profile", get(get_profile))
        .route("/profile", put(update_profile))
}

async fn get_profile(
    Extension(pool): Extension<PgPool>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: JWT認証実装後に実装
    Ok(Json(json!({
        "message": "Get profile endpoint - 実装予定"
    })))
}

async fn update_profile(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: JWT認証実装後に実装
    Ok(Json(json!({
        "message": "Update profile endpoint - 実装予定"
    })))
}