# ReadMaker Core - Rustバックエンド

速読アプリ「ぱらぱら読書メーカー」のRust実装部分です。  
形態素解析とテキスト処理を担当します。

## 現在の実装状況

✅ **プロトタイプ版**: 簡単な文字分割とデータ構造  
🚧 **開発予定**: 本格的な形態素解析（lindera等）  

## 実行方法

```bash
# Rustディレクトリに移動
cd ReadMaker/native/rust

# 実行
cargo run
```

## サンプル出力

```
=== ReadMaker Core - 形態素解析プロトタイプ ===

--- サンプル 1 ---
原文: 吾輩は猫である。名前はまだない。
形態素解析結果: ["吾輩は猫である", "名前はまだない"]
JSON出力: ["吾輩は猫である","名前はまだない"]
```

## API関数

### analyze_text(input: &str) -> Vec<String>

テキストを形態素解析して、単語・文節のベクターを返します。

```rust
let words = analyze_text("吾輩は猫である。");
// 結果: ["吾輩は猫である"]
```

### words_to_json(words: &[String]) -> String

形態素解析結果をJSON文字列に変換します（React Native連携用）。

```rust
let json = words_to_json(&["吾輩は猫である", "名前はまだない"]);
// 結果: ["吾輩は猫である","名前はまだない"]
```

## 今後の開発予定

1. **形態素解析ライブラリの導入**（lindera/vaporetto）
2. **React Nativeとの連携API**
3. **パフォーマンス最適化**
4. **エラーハンドリング強化**

## 開発環境

- Rust 1.89.0
- Cargo 1.89.0
- Edition 2024

---

**開発者**: @oto1720  
**ブランチ**: feature/rust-backend
