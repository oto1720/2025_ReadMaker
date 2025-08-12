/// 統合テスト - ライブラリとして動作確認
use readmaker_core::{analyze_text, words_to_json};

#[test]
fn test_integrated_analysis() {
    println!("=== 統合テスト: 形態素解析 ===");
    
    let test_cases = vec![
        "今日は晴れです。",
        "学問のすすめ",
        "吾輩は猫である。",
        "これはテストです。",
    ];
    
    for (i, input) in test_cases.iter().enumerate() {
        println!("\nテスト {}: {}", i + 1, input);
        
        let words = analyze_text(input);
        let json_output = words_to_json(&words);
        
        println!("  形態素: {:?}", words);
        println!("  JSON: {}", json_output);
        println!("  語数: {}", words.len());
        
        assert!(!words.is_empty(), "形態素解析結果が空です");
        assert!(json_output.starts_with('['), "JSON形式が正しくありません");
        assert!(json_output.ends_with(']'), "JSON形式が正しくありません");
    }
}

#[test]
fn test_empty_input() {
    println!("=== 空文字列テスト ===");
    
    let words = analyze_text("");
    println!("空文字列の結果: {:?}", words);
    
    // 空文字列の場合、空配列または1文字の配列が期待される
    assert!(words.len() <= 1, "空文字列の解析結果が期待と異なります");
}

#[test]
fn test_long_text() {
    println!("=== 長文テスト ===");
    
    let long_text = "これは長い文章のテストです。形態素解析エンジンが長文に対してどのような動作をするかを確認します。パフォーマンスとメモリ使用量を観察することが重要です。ReadMakerアプリケーションでは、このような長文の処理が頻繁に行われる可能性があります。";
    
    let words = analyze_text(long_text);
    let json_output = words_to_json(&words);
    
    println!("長文解析結果:");
    println!("  語数: {}", words.len());
    println!("  最初の10語: {:?}", &words[..std::cmp::min(10, words.len())]);
    println!("  JSON長: {} bytes", json_output.len());
    
    assert!(words.len() > 20, "長文の解析語数が少なすぎます");
    assert!(json_output.len() > 100, "JSON出力が短すぎます");
}
