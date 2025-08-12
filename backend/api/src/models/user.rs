use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify, DEFAULT_COST};
use readmaker_shared::{Result, ReadMakerError};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub created_at: DateTime<Utc>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            email: user.email,
            username: user.username,
            created_at: user.created_at,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

impl User {
    pub async fn create(pool: &PgPool, req: CreateUserRequest) -> Result<User> {
        // メールアドレスの重複チェック
        if Self::find_by_email(pool, &req.email).await.is_ok() {
            return Err(ReadMakerError::Validation("このメールアドレスは既に使用されています".to_string()));
        }

        // ユーザー名の重複チェック
        if Self::find_by_username(pool, &req.username).await.is_ok() {
            return Err(ReadMakerError::Validation("このユーザー名は既に使用されています".to_string()));
        }

        // パスワードハッシュ化
        let password_hash = hash(&req.password, DEFAULT_COST)
            .map_err(|e| ReadMakerError::Internal(format!("パスワードハッシュ化エラー: {}", e)))?;

        let user_id = Uuid::new_v4();
        let now = Utc::now();

        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, username, password_hash, created_at, updated_at
            "#
        )
        .bind(user_id)
        .bind(req.email)
        .bind(req.username)
        .bind(password_hash)
        .bind(now)
        .bind(now)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    pub async fn find_by_email(pool: &PgPool, email: &str) -> Result<User> {
        let user = sqlx::query_as::<_, User>(
            "SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE email = $1"
        )
        .bind(email)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    pub async fn find_by_username(pool: &PgPool, username: &str) -> Result<User> {
        let user = sqlx::query_as::<_, User>(
            "SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE username = $1"
        )
        .bind(username)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    pub async fn find_by_id(pool: &PgPool, user_id: Uuid) -> Result<User> {
        let user = sqlx::query_as::<_, User>(
            "SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE id = $1"
        )
        .bind(user_id)
        .fetch_one(pool)
        .await?;

        Ok(user)
    }

    pub fn verify_password(&self, password: &str) -> Result<bool> {
        verify(password, &self.password_hash)
            .map_err(|e| ReadMakerError::Authentication(format!("パスワード検証エラー: {}", e)))
    }

    pub async fn authenticate(pool: &PgPool, req: LoginRequest) -> Result<User> {
        let user = Self::find_by_email(pool, &req.email).await?;
        
        if user.verify_password(&req.password)? {
            Ok(user)
        } else {
            Err(ReadMakerError::Authentication("無効なメールアドレスまたはパスワードです".to_string()))
        }
    }
}