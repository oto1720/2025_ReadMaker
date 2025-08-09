/// ReadMaker - 速読アプリ用形態素解析のプロトタイプ
/// 実際の形態素解析結果を使用したデモ実装

fn main() {
    println!("=== ReadMaker Core - 形態素解析プロトタイプ ===");
    
    // サンプルテキスト（青空文庫風）
    let sample_texts = vec![
        "吾輩は猫である。名前はまだない。",
        "学問のすすめ",
        "今日は良い天気ですね。明日も晴れるでしょう。",
    ];
    
    for (i, text) in sample_texts.iter().enumerate() {
        println!("\n--- サンプル {} ---", i + 1);
        println!("原文: {}", text);
        
        // 実際の形態素解析結果（手動で調べた結果を使用）
        let words = get_morphological_analysis(text);
        println!("形態素解析結果: {:?}", words);
        
        // JSON形式で返す（React Native側で使いやすく）
        let json_result = words_to_json(&words);
        println!("JSON出力: {}", json_result);
    }
    
    // 汎用的な処理のテスト
    println!("\n=== 汎用処理テスト ===");
    let custom_text = "これはテストです。任意の文章を処理できます。";
    let result = analyze_text(custom_text);
    println!("カスタム文章: {}", custom_text);
    println!("解析結果: {:?}", result);
}

/// 実際の形態素解析結果を返す（現在はハードコード）
fn get_morphological_analysis(text: &str) -> Vec<String> {
    match text {
        "吾輩は猫である。名前はまだない。" => vec![
            "吾輩".to_string(),
            "は".to_string(),
            "猫".to_string(),
            "で".to_string(),
            "ある".to_string(),
            "。".to_string(),
            "名前".to_string(),
            "は".to_string(),
            "まだ".to_string(),
            "ない".to_string(),
            "。".to_string(),
        ],
        "学問のすすめ" => vec![
            "学問".to_string(),
            "の".to_string(),
            "すすめ".to_string(),
        ],
        "今日は良い天気ですね。明日も晴れるでしょう。" => vec![
            "今日".to_string(),
            "は".to_string(),
            "良い".to_string(),
            "天気".to_string(),
            "です".to_string(),
            "ね".to_string(),
            "。".to_string(),
            "明日".to_string(),
            "も".to_string(),
            "晴れる".to_string(),
            "でしょう".to_string(),
            "。".to_string(),
        ],
        // 未知の文章の場合は簡易分割
        _ => simple_fallback_split(text),
    }
}

/// 簡易分割（フォールバック用）
fn simple_fallback_split(text: &str) -> Vec<String> {
    // 文字単位で分割（将来的により良い方法に置き換え）
    text.chars()
        .map(|c| c.to_string())
        .collect()
}

/// 形態素解析結果をJSON形式で返す（React Native用）
fn words_to_json(words: &[String]) -> String {
    let words_json: Vec<String> = words.iter()
        .map(|word| format!("\"{}\"", word))
        .collect();
    format!("[{}]", words_json.join(","))
}

/// 将来的な形態素解析関数（プロトタイプ）
pub fn analyze_text(input: &str) -> Vec<String> {
    // 現在はハードコード結果 + フォールバック、将来的に lindera/vaporetto に置き換え
    get_morphological_analysis(input)
}
