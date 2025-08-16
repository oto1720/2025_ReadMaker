/// ZSTD圧縮された辞書ファイルを展開するユーティリティ
use std::fs::File;
use std::io::{self, BufReader, BufWriter};

fn main() -> io::Result<()> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 3 {
        eprintln!("使用方法: cargo run --bin extract_dict <input.zst> <output>");
        std::process::exit(1);
    }
    
    let input_path = &args[1];
    let output_path = &args[2];
    
    println!("展開中: {} -> {}", input_path, output_path);
    
    let input_file = File::open(input_path)?;
    let output_file = File::create(output_path)?;
    
    let mut decoder = zstd::Decoder::new(BufReader::new(input_file))?;
    let mut writer = BufWriter::new(output_file);
    
    io::copy(&mut decoder, &mut writer)?;
    
    println!("展開完了: {}", output_path);
    Ok(())
}
