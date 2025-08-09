/// ReadMaker Core - React Native Bridge
/// JavaScript/TypeScriptから呼び出し可能なC FFI実装

use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::ptr;
use std::fs::File;
use std::io;
use serde_json;
use vibrato::{Dictionary, Tokenizer};

/// Vibrato実装の形態素解析関数
fn vibrato_analyze_text(input: &str) -> Result<Vec<String>, io::Error> {
    // 辞書ファイルパス（プロジェクトルートからの相対パス）
    let dict_path = "dictionaries/ipadic-mecab-2_7_0/system.dic";
    
    // 辞書ファイルの読み込み
    let dict_file = File::open(dict_path)?;
    let dict = Dictionary::read(dict_file)
        .map_err(|e| io::Error::new(io::ErrorKind::Other, format!("辞書読み込みエラー: {}", e)))?;
    
    // トークナイザーの作成
    let tokenizer = Tokenizer::new(dict);
    let mut worker = tokenizer.new_worker();
    
    // 解析の実行
    worker.reset_sentence(input);
    worker.tokenize();
    
    // 結果の収集
    let mut words = Vec::new();
    for i in 0..worker.num_tokens() {
        let token = worker.token(i);
        words.push(token.surface().to_string());
    }
    
    Ok(words)
}

/// フォールバック形態素解析
fn analyze_text_fallback(text: &str) -> Vec<String> {
    // 簡易分割（フォールバック用）
    text.chars()
        .map(|c| c.to_string())
        .collect()
}

/// 公開API: 形態素解析関数（Vibrato実装）
pub fn analyze_text(input: &str) -> Vec<String> {
    // Vibrato実装を試し、エラー時はフォールバック
    match vibrato_analyze_text(input) {
        Ok(words) => words,
        Err(_) => analyze_text_fallback(input),
    }
}

/// 形態素解析結果をJSON形式で返す（React Native用）
pub fn words_to_json(words: &[String]) -> String {
    serde_json::to_string(words).unwrap_or_else(|_| "[]".to_string())
}

/// JavaScript用のC FFI形態素解析関数
/// 
/// # 使用方法（JavaScript側）
/// ```javascript
/// const result = await analyzeText("吾輩は猫である。");
/// console.log(result); // ["吾輩", "は", "猫", "で", "ある", "。"]
/// ```
#[no_mangle]
pub extern "C" fn js_analyze_text(input: *const c_char) -> *mut c_char {
    // NULLポインタチェック
    if input.is_null() {
        return ptr::null_mut();
    }
    
    // C文字列 → Rust文字列変換
    let c_str = unsafe { CStr::from_ptr(input) };
    let input_str = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return ptr::null_mut(),
    };
    
    // 形態素解析実行
    let words = analyze_text(input_str);
    
    // JSON文字列として出力
    let json_result = words_to_json(&words);
    
    // Rust文字列 → C文字列変換
    match CString::new(json_result) {
        Ok(c_string) => c_string.into_raw(),
        Err(_) => ptr::null_mut(),
    }
}

/// JavaScript用のメモリ解放関数
/// 
/// # 重要
/// js_analyze_text()で返されたポインタは必ずこの関数で解放すること
#[no_mangle]
pub extern "C" fn js_free_string(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe {
            let _ = CString::from_raw(ptr);
        }
    }
}

/// Bridge初期化確認用関数
#[no_mangle]
pub extern "C" fn js_test_bridge() -> *mut c_char {
    let test_message = "ReadMaker Rust Bridge - OK";
    match CString::new(test_message) {
        Ok(c_string) => c_string.into_raw(),
        Err(_) => ptr::null_mut(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::ffi::CString;
    
    #[test]
    fn test_js_bridge_basic() {
        let input = CString::new("今日は良い天気です。").unwrap();
        let result_ptr = js_analyze_text(input.as_ptr());
        
        assert!(!result_ptr.is_null());
        
        let result_cstr = unsafe { CStr::from_ptr(result_ptr) };
        let result_str = result_cstr.to_str().unwrap();
        
        // JSON配列形式かチェック
        assert!(result_str.starts_with('['));
        assert!(result_str.ends_with(']'));
        assert!(result_str.contains("今日"));
        
        // メモリ解放
        js_free_string(result_ptr);
    }
    
    #[test]
    fn test_js_bridge_test() {
        let result_ptr = js_test_bridge();
        assert!(!result_ptr.is_null());
        
        let result_cstr = unsafe { CStr::from_ptr(result_ptr) };
        let result_str = result_cstr.to_str().unwrap();
        
        assert_eq!(result_str, "ReadMaker Rust Bridge - OK");
        
        js_free_string(result_ptr);
    }
}
