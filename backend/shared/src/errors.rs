use thiserror::Error;

#[derive(Error, Debug)]
pub enum ReadMakerError {
    #[error("データベースエラー: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("認証エラー: {0}")]
    Authentication(String),
    
    #[error("認可エラー: {0}")]
    Authorization(String),
    
    #[error("バリデーションエラー: {0}")]
    Validation(String),
    
    #[error("形態素解析エラー: {0}")]
    Analysis(String),
    
    #[error("内部サーバーエラー: {0}")]
    Internal(String),
}

pub type Result<T> = std::result::Result<T, ReadMakerError>;