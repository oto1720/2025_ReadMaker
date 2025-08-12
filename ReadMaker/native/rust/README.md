# ReadMaker - Rust形態素解析ネイティブモジュール

ReadMakerアプリ用の高速形態素解析エンジンです。Vibratoライブラリを使用し、高品質・高速な日本語文書の形態素解析を提供します。

## 機能

- **Vibrato形態素解析**: 最新の高速・高品質形態素解析エンジン
- **IPADIC辞書**: 標準的な日本語形態素解析辞書を使用
- **JSON API**: React Native側で使いやすいJSON形式での結果出力
- **フォールバック実装**: 辞書読み込みエラー時の安全な退避処理

## 技術仕様

### 使用ライブラリ
- **Vibrato v0.5**: 高速形態素解析エンジン
- **IPADIC v2.7.0**: 標準日本語辞書
- **serde/serde_json**: JSON形式での結果出力
- **zstd**: 辞書ファイル圧縮/展開

### パフォーマンス
- 短文（20文字程度）: < 1ms目標
- 中文（100文字程度）: < 5ms目標
- 長文（1000文字程度）: < 50ms目標

## 使用方法

### 基本実行
```bash
cargo run --bin main
```

### 実行例
```text
=== ReadMaker Core - Vibrato形態素解析エンジン ===

--- サンプル 1 ---
原文: 吾輩は猫である。名前はまだない。
Vibrato解析結果: ["吾輩", "は", "猫", "で", "ある", "。", "名前", "は", "まだ", "ない", "。"]
JSON出力: ["吾輩","は","猫","で","ある","。","名前","は","まだ","ない","。"]
```

### API関数
```rust
pub fn analyze_text(input: &str) -> Vec<String>
```

入力文字列を形態素解析し、単語のベクターを返します。エラー時は自動的にフォールバック実装にフォールバックします。

## React Native連携

将来的にReact Native bridgeを実装予定：

1. **C FFI**: RustからC互換インターフェースを公開
2. **JSON形式**: React Native側で扱いやすいJSON出力
3. **WASM**: WebAssembly出力でのクロスプラットフォーム対応

## 開発・メンテナンス

### 辞書ファイル
- 場所: `dictionaries/ipadic-mecab-2_7_0/system.dic`
- サイズ: 約48MB
- 圧縮版: `system.dic.zst`（約8MB）

### 辞書展開
```bash
cargo run --bin extract_dict dictionaries/ipadic-mecab-2_7_0/system.dic.zst dictionaries/ipadic-mecab-2_7_0/system.dic
```

### 辞書パスの指定（任意）
実行時に環境変数 `READMAKER_DIC_PATH` を設定すると、辞書の場所を切り替えられます。

```powershell
$env:READMAKER_DIC_PATH = "C:\\path\\to\\system.dic"; cargo run --bin main
```
```bash
export READMAKER_DIC_PATH=/path/to/system.dic && cargo run --bin main
```

### テスト実行
```bash
cargo run --bin main
```

## 実装ステータス

- ✅ Vibrato v0.5 統合完了
- ✅ IPADIC辞書セットアップ完了
- ✅ 基本形態素解析機能実装完了
- ✅ JSON出力対応完了
- ✅ エラーハンドリング・フォールバック完了
- ⏳ パフォーマンス最適化
- ⏳ React Native bridge実装
- ⏳ WASM出力対応

---

**開発者向け**: この実装により、ReadMakerアプリは高品質な形態素解析により、正確な読みやすさ指標計算と、効果的な速読支援が可能になります。

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

## 内部関数

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
2. **React Nativeとのネイティブブリッジ連携**
3. **パフォーマンス最適化**
4. **エラーハンドリング強化**

## 開発環境

- Rust 1.89.0
- Cargo 1.89.0
- Edition 2024

---

**開発者**: @otonasi-muonn 
**ブランチ**: feature/rust-backend
