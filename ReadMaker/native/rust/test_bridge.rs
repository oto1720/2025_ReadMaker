/// C FFI Bridge詳細テスト用バイナリ（直接Rust関数を呼ぶ安全版）
use serde_json;
use readmaker_core::{analyze_text, words_to_json};

fn main() {
    println!("=== React Native Bridge - 直接呼び出しテスト ===\n");
    println!("📡 テスト1: ライブラリ関数の基本動作確認");
    let hello = analyze_text("今日は良い天気です。", &[]);
    println!("✅ 結果: {}", words_to_json(&hello));
    
    // テスト2: 基本的な形態素解析
    println!("\n🔍 テスト2: 基本的な形態素解析");
    let test_inputs = vec![
        "今日は晴れです。",
        "学問のすすめ",
        "吾輩は猫である。",
        "React Nativeは素晴らしい。",
    ];
    
    for (i, input) in test_inputs.iter().enumerate() {
        println!("\n--- テスト2-{} ---", i + 1);
        println!("入力: {}", input);
        
        let words = analyze_text(input, &[]);
        let result_str = words_to_json(&words);
        println!("✅ JSON結果: {}", result_str);
        // JSONパース確認
        if let Ok(words) = serde_json::from_str::<Vec<String>>(&result_str) {
            println!("📋 解析語数: {}語", words.len());
            println!("📋 単語リスト: {:?}", words);
        } else {
            println!("⚠️ JSONパースエラー");
        }
    }
    
    // テスト3: エラーハンドリング
    println!("\n🛡️ テスト3: エラーハンドリング");
    
    // 空文字列テスト
    println!("--- 空文字列テスト ---");
    let empty_words = analyze_text("", &[]);
    println!("✅ 空文字列結果: {}", words_to_json(&empty_words));
    
    // 長文テスト
    println!("\n--- 長文テスト ---");
    let long_input = "これは長い文章のテストです。形態素解析エンジンが長文に対してどのような動作をするかを確認します。パフォーマンスとメモリ使用量を観察することが重要です。";
    let words = analyze_text(long_input, &[]);
    println!("✅ 長文解析成功: {}語に分割", words.len());
    println!("📋 最初の10語: {:?}", &words[..std::cmp::min(10, words.len())]);
    
    println!("\n=== C FFI Bridge テスト完了 ===");
}
