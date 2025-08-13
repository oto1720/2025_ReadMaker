use std::error::Error;

// 辞書ビルドは Node スクリプト + vibrato CLI を利用する方針に切替。
// このbinは build-tools フィーチャを有効にして実行すると案内のみを表示します。
fn main() -> Result<(), Box<dyn Error>> {
    println!("ReadMaker: 辞書ビルド手順");
    println!("1) npm run dic:build-lex で lex_utf8.csv / *_utf8.def を生成");
    println!("2) vibrato の compile ツールで ipadic.vibrato を生成");
    println!("   例: compile -l lex_utf8.csv -o dictionaries/ipadic.vibrato \");
    println!("          --unk unk_utf8.def --char char_utf8.def --matrix matrix_utf8.def");
    println!("\nこのバイナリは案内のみです。処理は行いません。");
    Ok(())
}
