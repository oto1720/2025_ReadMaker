# ReadMaker - Rust製形態素解析エンジン

**ReadMakerアプリ向けに開発された、Rust製の高性能な日本語形態素解析エンジンです。**

VibratoライブラリとIPADIC辞書を基盤とし、高速かつ高精度な日本語の単語分割機能を提供します。React Nativeアプリにネイティブモジュールとして統合され、オフラインでも軽快に動作します。

---

## ✨ 主な特徴

- **🚀 高速・高精度**: RustとVibratoによる優れたパフォーマンス。
- **📚 標準辞書搭載**: 一般的な単語に対応するIPADIC辞書を同梱。
- **📱 クロスプラットフォーム**: Androidに完全対応。iOSもmacOS環境でビルド可能です。
- **🔌 簡単な連携**: TypeScriptから非同期関数を呼び出すだけで利用できます。
- **🌐 オフライン動作**: 辞書を内蔵しているため、インターネット接続は不要です。

---

## 📊 対応状況

| プラットフォーム | ステータス | 対応アーキテクチャ |
| :--- | :--- | :--- |
| ✅ **Android** | **統合完了** | `arm64-v8a`, `armeabi-v7a`, `x86_64` |
| ⏳ **iOS** | **ビルド待ち** | `aarch64` (実機), `x86_64` (シミュレータ) |

---

## 使い方

React Native側から`analyzeText`関数を呼び出すだけで、高精度な形態素解析結果がJSON配列で返されます。

```typescript
import { analyzeText } from '../native/bridge/RustBridge';

async function getWords(text: string) {
  try {
    const words = await analyzeText(text);
    console.log(`入力: "${text}"`);
    console.log('解析結果:', words);
    // -> 解析結果: ["今日", "は", "良い", "天気", "です", "。"]
    return words;
  } catch (e) {
    console.error("解析エラー", e);
    return [];
  }
}

getWords("今日は良い天気です。");
```

---

## 開発者向け情報

### 必要な環境
- **共通**: Rust
- **Android**: Android NDK
- **iOS**: macOS & Xcode

### テスト
Rustライブラリの単体テストを実行します。

```bash
cd native/rust
cargo test
```

### ビルド手順
各プラットフォーム向けのライブラリをビルドします。

#### Android
```bash
# Windows/macOS/Linuxでビルド可能
cd native/rust
cargo build --target aarch64-linux-android --release
cargo build --target armv7-linux-androideabi --release
cargo build --target x86_64-linux-android --release
```
ビルドされたライブラリ (`.so`) は自動的に `android/app/src/main/jniLibs` 配下にコピーされます。

#### iOS
```bash
# macOS + Xcode 環境が必須
cd native/rust
cargo build --target aarch64-apple-ios --release
cargo build --target x86_64-apple-ios --release
```
ビルドされたライブラリ (`.a`) は手動でXcodeプロジェクトに配置する必要があります。

---

## 🏛️ アーキテクチャ概要

`React Native (TypeScript)` ↔ `Native Bridge (Java/Kotlin, Obj-C/Swift)` ↔ `Rust Core (FFI)`

- **Rust Core**: 形態素解析のコアロジック。C言語互換のインターフェース(FFI)を公開。
- **Native Bridge**: プラットフォーム固有のコード（Java/Obj-C）でRustの関数を呼び出し、React Nativeに公開。
- **React Native**: TypeScriptからブリッジされた関数を非同期で呼び出し。

