use axum::{
    routing::{post},
    Router, Json, http::StatusCode,
    extract::Extension,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::PgPool;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserData,
}

#[derive(Serialize)]
pub struct UserData {
    pub id: uuid::Uuid,
    pub email: String,
    pub username: String,
}

pub fn routes() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
}

async fn login(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: 実装
    Ok(Json(json!({
        "message": "Login endpoint - 実装予定",
        "email": payload.email
    })))
}

async fn register(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: 実装
    Ok(Json(json!({
        "message": "Register endpoint - 実装予定",
        "username": payload.username
    })))
}