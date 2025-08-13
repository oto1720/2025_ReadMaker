use sqlx::{PgPool, postgres::PgPoolOptions};
use std::time::Duration;

pub struct DatabaseConnection {
    pool: PgPool,
}

impl DatabaseConnection {
    pub async fn new(database_url: &str) -> Result<Self, sqlx::Error> {
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .acquire_timeout(Duration::from_secs(30))
            .connect(database_url)
            .await?;

        // データベース接続テスト
        sqlx::query("SELECT 1").execute(&pool).await?;
        
        tracing::info!("✅ データベース接続成功");

        Ok(Self { pool })
    }

    pub fn pool(&self) -> PgPool {
        self.pool.clone()
    }
}