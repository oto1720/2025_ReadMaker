use std::time::Instant;
use readmaker_core::analyze_text;

fn main() {
    println!("=== ReadMaker形態素解析 - パフォーマンステスト ===\n");
    
    // 辞書読み込みのウォームアップ（1回だけ）
    println!("🔄 辞書読み込み中...");
    let warmup_start = Instant::now();
    let _ = analyze_text("テスト", &[]);
    let warmup_time = warmup_start.elapsed();
    println!("✅ 辞書読み込み完了: {:.0}ms\n", warmup_time.as_secs_f64() * 1000.0);
    
    // テストケース
    let test_cases = vec![
        ("短文（11文字）", "今日は良い天気ですね。"),
        ("中文（39文字）", "昨日の夜、友人と一緒に新しくオープンしたレストランで美味しい料理を食べました。"),
        ("長文（112文字）", "人工知能技術の発展により、自然言語処理分野においても大きな進歩が見られます。特に形態素解析や機械翻訳、文書要約などの技術は実用レベルに達しており、多くの企業や研究機関で活用されています。今後もさらなる技術革新が期待されます。"),
    ];
    
    for (label, text) in test_cases {
        println!("🔍 {}", label);
        println!("テキスト: {}", text);
        println!("文字数: {}文字", text.chars().count());
        
        // 複数回実行して最小時間を測定（純粋な解析時間）
        let mut min_duration = std::time::Duration::from_secs(1);
        let mut result = Vec::new();
        let iterations = 100;
        
        for _ in 0..iterations {
            let start = Instant::now();
            result = analyze_text(text, &[]);
            let duration = start.elapsed();
            min_duration = min_duration.min(duration);
        }
        
        println!("解析結果: {:?}", &result[..std::cmp::min(5, result.len())]);
        println!("語数: {}語", result.len());
        println!("⏱️ 最速処理時間: {:.3}ms", min_duration.as_secs_f64() * 1000.0);
        println!();
    }
}
