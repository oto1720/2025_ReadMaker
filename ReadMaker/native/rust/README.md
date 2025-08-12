# ReadMaker - Rust形態素解析エンジン

ReadMakerアプリ用の高速形態素解析エンジンです。Vibratoライブラリを使用し、日本語文書の形態素解析を提供します。

## 機能

- **Vibrato形態素解析**: 高速・高品質形態素解析エンジン
- **IPADIC辞書**: 標準的な日本語形態素解析辞書
- **React Native Bridge**: TypeScriptから直接呼び出し可能
- **JSON出力**: React Native側で扱いやすい形式

## 使い方

### Rustテスト実行
```bash
cd native/rust
cargo test -- --nocapture
```

### React Nativeから使用
```typescript
import { analyzeText } from '../native/bridge/RustBridge';

const words = await analyzeText("吾輩は猫である。");
console.log(words); // ["吾輩", "は", "猫", "で", "ある", "。"]
```

## パフォーマンス
- 短文（10文字程度）: 約1ms
- 中文（40文字程度）: 約1ms  
- 長文（100文字程度）: 約1ms

*注：現在は毎回辞書読み込みが発生（約900ms）。将来的にTokenizer使い回しで高速化予定*

## 実装状況

- ✅ Vibrato v0.5統合
- ✅ IPADIC辞書セットアップ
- ✅ TypeScript bridgeインターフェース
- ✅ JSON出力対応
- ⏳ Tokenizer使い回し最適化
- ⏳ ネイティブモジュール統合

## サンプル出力

```
原文: 今日は良い天気です。
結果: ["今日", "は", "良い", "天気", "です", "。"]
```
