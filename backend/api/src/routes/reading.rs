use axum::{
    routing::{get, post},
    Router, Json, http::StatusCode,
    extract::Extension,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::PgPool;

#[derive(Deserialize)]
pub struct AnalyzeRequest {
    pub text: String,
}

#[derive(Serialize)]
pub struct AnalyzeResponse {
    pub words: Vec<WordInfo>,
    pub reading_stats: ReadingStats,
}

#[derive(Serialize)]
pub struct WordInfo {
    pub surface: String,
    pub reading: String,
    pub part_of_speech: String,
}

#[derive(Serialize)]
pub struct ReadingStats {
    pub total_words: usize,
    pub unique_words: usize,
    pub reading_time_estimate: f64,
}

pub fn routes() -> Router {
    Router::new()
        .route("/analyze", post(analyze_text))
        .route("/stats", get(get_reading_stats))
}

async fn analyze_text(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<AnalyzeRequest>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: readmaker-core の形態素解析機能を統合
    Ok(Json(json!({
        "message": "Text analysis endpoint - 実装予定",
        "text_length": payload.text.len()
    })))
}

async fn get_reading_stats(
    Extension(pool): Extension<PgPool>,
) -> Result<Json<Value>, StatusCode> {
    // TODO: ユーザーの読書統計取得
    Ok(Json(json!({
        "message": "Reading stats endpoint - 実装予定"
    })))
}