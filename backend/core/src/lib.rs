/// ReadMaker Core - 形態素解析エンジン
/// Vibratoベースの日本語形態素解析ライブラリ

use std::fs::File;
use std::env;
use serde_json;
use vibrato::{Dictionary, Tokenizer};
use readmaker_shared::{WordAnalysis, Result, ReadMakerError};

#[cfg(feature = "ffi")]
pub mod ffi;

pub struct MorphAnalyzer {
    tokenizer: Tokenizer,
}

impl MorphAnalyzer {
    /// 新しいアナライザーインスタンスを作成
    pub fn new() -> Result<Self> {
        let dict = Self::load_dictionary()?;
        let tokenizer = Tokenizer::new(dict);
        
        Ok(Self { tokenizer })
    }
    
    /// 辞書ファイルの読み込み
    fn load_dictionary() -> Result<Dictionary> {
        let dict_path = env::var("READMAKER_DIC_PATH")
            .unwrap_or_else(|_| "dictionaries/ipadic.vibrato".to_string());
        
        let dict_file = File::open(&dict_path)
            .map_err(|e| ReadMakerError::Analysis(format!("辞書ファイルが見つかりません: {}", e)))?;
        
        // zstd圧縮/非圧縮の両対応
        match zstd::stream::read::Decoder::new(dict_file) {
            Ok(mut decoder) => {
                Dictionary::read(&mut decoder)
                    .or_else(|_| {
                        // 失敗したら非圧縮として再試行
                        let raw_file = File::open(&dict_path)
                            .map_err(|e| ReadMakerError::Analysis(format!("辞書読み込みエラー: {}", e)))?;
                        Dictionary::read(raw_file)
                            .map_err(|e| ReadMakerError::Analysis(format!("辞書読み込みエラー: {}", e)))
                    })
            }
            Err(_) => {
                // zstdとして開けない場合は非圧縮として読む
                let raw_file = File::open(&dict_path)
                    .map_err(|e| ReadMakerError::Analysis(format!("辞書読み込みエラー: {}", e)))?;
                Dictionary::read(raw_file)
                    .map_err(|e| ReadMakerError::Analysis(format!("辞書読み込みエラー: {}", e)))
            }
        }
    }
    
    /// テキストを形態素解析
    pub fn analyze_text(&self, input: &str) -> Result<Vec<WordAnalysis>> {
        let mut worker = self.tokenizer.new_worker();
        worker.reset_sentence(input);
        worker.tokenize();
        
        let mut words = Vec::new();
        for i in 0..worker.num_tokens() {
            let token = worker.token(i);
            words.push(WordAnalysis {
                surface: token.surface().to_string(),
                reading: token.surface().to_string(), // Vibratoでは読みが直接取得できない場合は表面形を使用
                part_of_speech: token.feature().to_string(),
                features: vec![token.feature().to_string()], // 単一の特徴文字列をベクターに格納
            });
        }
        
        Ok(words)
    }
    
    /// 簡易形態素解析（単語のみ）
    pub fn analyze_words(&self, input: &str) -> Result<Vec<String>> {
        let analysis = self.analyze_text(input)?;
        Ok(analysis.into_iter().map(|w| w.surface).collect())
    }
}

/// フォールバック形態素解析（辞書読み込み失敗時）
pub fn analyze_text_fallback(text: &str) -> Vec<String> {
    text.chars()
        .map(|c| c.to_string())
        .collect()
}

/// 便利関数: テキストをJSON形式で分析
pub fn analyze_to_json(input: &str) -> String {
    match MorphAnalyzer::new() {
        Ok(analyzer) => {
            match analyzer.analyze_text(input) {
                Ok(words) => serde_json::to_string(&words).unwrap_or_else(|_| "[]".to_string()),
                Err(_) => {
                    let fallback = analyze_text_fallback(input);
                    serde_json::to_string(&fallback).unwrap_or_else(|_| "[]".to_string())
                }
            }
        }
        Err(_) => {
            let fallback = analyze_text_fallback(input);
            serde_json::to_string(&fallback).unwrap_or_else(|_| "[]".to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_analyzer_creation() {
        // 辞書ファイルが存在しない場合はスキップ
        if env::var("READMAKER_DIC_PATH").is_err() && !std::path::Path::new("dictionaries/ipadic.vibrato").exists() {
            println!("辞書ファイルが見つからないためテストをスキップ");
            return;
        }
        
        let analyzer = MorphAnalyzer::new();
        assert!(analyzer.is_ok());
    }
    
    #[test]
    fn test_fallback_analysis() {
        let result = analyze_text_fallback("今日は良い天気です");
        assert!(!result.is_empty());
        assert!(result.contains(&"今".to_string()));
    }
}