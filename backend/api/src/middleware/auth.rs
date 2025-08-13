use axum::{
    extract::{Extension, Request},
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use axum::http::header::AUTHORIZATION;
use readmaker_shared::{JwtService, Claims};
use std::sync::Arc;

#[derive(Clone)]
pub struct AuthState {
    pub user_id: uuid::Uuid,
    pub email: String,
}

pub async fn auth_middleware(
    Extension(jwt_service): Extension<Arc<JwtService>>,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = JwtService::extract_token_from_header(auth_header)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let claims = jwt_service
        .validate_token(token)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let auth_state = AuthState {
        user_id: claims.user_id,
        email: claims.email,
    };

    request.extensions_mut().insert(auth_state);

    Ok(next.run(request).await)
}