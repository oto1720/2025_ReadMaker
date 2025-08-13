use axum::{
    routing::{post, get},
    Router, Json, http::StatusCode,
    extract::Extension,
    response::Json as ResponseJson,
    middleware,
};
use serde::{Serialize};
use sqlx::PgPool;
use readmaker_shared::{JwtService, create_success_response, create_error_response};
use crate::models::{User, CreateUserRequest, LoginRequest, UserResponse};
use crate::middleware::auth::{AuthState, auth_middleware};
use std::sync::Arc;

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

pub fn routes() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/register", post(register))
        .route("/me", get(get_current_user).layer(middleware::from_fn(auth_middleware)))
}

async fn login(
    Extension(pool): Extension<PgPool>,
    Extension(jwt_service): Extension<Arc<JwtService>>,
    Json(payload): Json<LoginRequest>,
) -> Result<ResponseJson<serde_json::Value>, StatusCode> {
    match User::authenticate(&pool, payload).await {
        Ok(user) => {
            match jwt_service.generate_token(user.id, user.email.clone()) {
                Ok(token) => {
                    let auth_response = AuthResponse {
                        token,
                        user: user.into(),
                    };
                    Ok(ResponseJson(serde_json::to_value(create_success_response(auth_response)).unwrap()))
                }
                Err(e) => {
                    tracing::error!("JWT生成エラー: {}", e);
                    Ok(ResponseJson(serde_json::to_value(create_error_response::<()>("認証処理に失敗しました".to_string())).unwrap()))
                }
            }
        }
        Err(e) => {
            tracing::warn!("ログイン失敗: {}", e);
            Ok(ResponseJson(serde_json::to_value(create_error_response::<()>("無効なメールアドレスまたはパスワードです".to_string())).unwrap()))
        }
    }
}

async fn register(
    Extension(pool): Extension<PgPool>,
    Extension(jwt_service): Extension<Arc<JwtService>>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<ResponseJson<serde_json::Value>, StatusCode> {
    // 簡単なバリデーション
    if payload.email.is_empty() || payload.username.is_empty() || payload.password.len() < 6 {
        return Ok(ResponseJson(serde_json::to_value(create_error_response::<()>("無効な入力データです。パスワードは6文字以上である必要があります".to_string())).unwrap()));
    }

    match User::create(&pool, payload).await {
        Ok(user) => {
            match jwt_service.generate_token(user.id, user.email.clone()) {
                Ok(token) => {
                    let auth_response = AuthResponse {
                        token,
                        user: user.into(),
                    };
                    tracing::info!("新規ユーザー登録成功: {}", auth_response.user.email);
                    Ok(ResponseJson(serde_json::to_value(create_success_response(auth_response)).unwrap()))
                }
                Err(e) => {
                    tracing::error!("JWT生成エラー: {}", e);
                    Ok(ResponseJson(serde_json::to_value(create_error_response::<()>("アカウント作成に失敗しました".to_string())).unwrap()))
                }
            }
        }
        Err(e) => {
            tracing::warn!("ユーザー登録失敗: {}", e);
            let error_msg = match e {
                readmaker_shared::ReadMakerError::Validation(msg) => msg,
                _ => "アカウント作成に失敗しました".to_string(),
            };
            Ok(ResponseJson(serde_json::to_value(create_error_response::<()>(error_msg)).unwrap()))
        }
    }
}

async fn get_current_user(
    Extension(pool): Extension<PgPool>,
    Extension(auth_state): Extension<AuthState>,
) -> Result<ResponseJson<serde_json::Value>, StatusCode> {
    match User::find_by_id(&pool, auth_state.user_id).await {
        Ok(user) => {
            let user_response: UserResponse = user.into();
            Ok(ResponseJson(serde_json::to_value(create_success_response(user_response)).unwrap()))
        }
        Err(e) => {
            tracing::error!("ユーザー情報取得エラー: {}", e);
            Ok(ResponseJson(serde_json::to_value(create_error_response::<()>("ユーザー情報の取得に失敗しました".to_string())).unwrap()))
        }
    }
}