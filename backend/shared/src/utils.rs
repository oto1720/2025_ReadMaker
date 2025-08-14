use chrono::Utc;
use crate::types::ApiResponse;

pub fn create_success_response<T>(data: T) -> ApiResponse<T> {
    ApiResponse {
        success: true,
        data: Some(data),
        message: None,
        timestamp: Utc::now(),
    }
}

pub fn create_error_response<T>(message: String) -> ApiResponse<T> {
    ApiResponse {
        success: false,
        data: None,
        message: Some(message),
        timestamp: Utc::now(),
    }
}

pub fn estimate_reading_time(word_count: usize) -> f64 {
    // 日本語の平均読書速度: 400-600文字/分
    // ここでは500文字/分として計算
    (word_count as f64) / 500.0
}