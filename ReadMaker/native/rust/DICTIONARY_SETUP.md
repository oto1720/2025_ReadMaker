# Vibrato用辞書セットアップガイド

## 概要
VibratoはUniDicバイナリ辞書を使用した高速形態素解析ライブラリです。
実装を完了するためには、辞書ファイルの準備が必要です。

## 1. UniDic辞書の入手方法

### オプションA: 公式UniDicからの変換
1. **公式UniDicのダウンロード**
   ```
   https://clrd.ninjal.ac.jp/unidic/
   ```
   - unidic-mecab-2.1.2_src.zip などをダウンロード

2. **Vibratoバイナリ辞書への変換**
   ```bash
   # Vibratoツールでの変換（要rustツールチェーン）
   cargo install vibrato-cli
   vibrato compile unidic-mecab-2.1.2_src/ unidic.dic
   ```

### オプションB: 既成バイナリ辞書の利用
- Vibratoコミュニティで配布されているバイナリ辞書を利用
- GitHubリリースページやパッケージマネージャーを確認

## 2. 現在のVibratoコード構造

### 依存関係（Cargo.toml）
```toml
[dependencies]
vibrato = "0.5"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### コード構造（main.rs）
- `vibrato_analyze_text()`: 実装予定の本体関数
- `analyze_text_fallback()`: 辞書準備まで使用するフォールバック
- `words_to_json()`: React Native用JSON変換

## 3. 実装ステップ

### 3.1 辞書ファイルの配置
```
ReadMaker/native/rust/
├── src/
│   └── main.rs
├── dictionaries/           ← 作成予定
│   └── unidic.dic         ← 辞書ファイル
├── Cargo.toml
└── DICTIONARY_SETUP.md
```

### 3.2 コード実装
1. **辞書パス設定**
   - 環境変数 or 設定ファイルから読み込み
   - フォールバック: 相対パス `./dictionaries/unidic.dic`

2. **エラーハンドリング強化**
   - 辞書ファイル不存在
   - 解析エラー
   - メモリ不足

3. **パフォーマンス最適化**
   - Tokenizer/Worker再利用
   - バッチ処理対応

### 3.3 テスト準備
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_vibrato_basic() {
        let result = vibrato_analyze_text("吾輩は猫である。");
        assert!(result.is_ok());
        let words = result.unwrap();
        assert!(words.len() > 3);
    }
}
```

## 4. React Native連携準備

### 4.1 WASM出力設定
```toml
[lib]
crate-type = ["cdylib"]
```

### 4.2 公開API設計
```rust
// 文字列入力 → JSON出力（React Native用）
#[no_mangle]
pub extern "C" fn analyze_text_json(input: *const c_char) -> *mut c_char {
    // C FFI wrapper for React Native
}
```

## 5. パフォーマンス目標

### ベンチマーク基準
- 短文（20文字程度）: < 1ms
- 中文（100文字程度）: < 5ms  
- 長文（1000文字程度）: < 50ms

### メモリ使用量
- 辞書ファイル: ~100MB（メモリ上）
- 解析処理: 入力文字数に比例

## 6. 次のアクション

### 即座に実行可能
1. ✅ Cargo.toml依存追加（完了）
2. ✅ コード構造準備（完了）
3. ⏳ 辞書ファイル入手・配置
4. ⏳ `vibrato_analyze_text()`実装完成
5. ⏳ テストケース追加

### 中期計画
1. React Native bridgeの実装
2. WASM出力対応
3. パフォーマンス計測・最適化
4. エラーハンドリング強化

---

**注意**: 辞書ファイルは容量が大きい（100MB程度）ため、Git LFSまたは.gitignore対象として管理することを推奨します。
