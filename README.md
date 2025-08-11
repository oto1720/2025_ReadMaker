# ReadMaker - 速読マスターアプリ

React Native + Expo Router + Rust製形態素解析エンジンによる次世代速読アプリ

## 🚀 特徴

- **高速形態素解析**: Rust + Vibrato + IPADIC辞書による精密な日本語解析
- **クロスプラットフォーム**: iOS & Android対応
- **モダンUI**: TypeScript + Expo Routerによる型安全な開発
- **ゲーミフィケーション**: レベルシステム・実績・統計機能

## 📁 プロジェクト構造

```
ReadMaker/
├── app/                    # Expo Router（画面・ナビゲーション）
├── native/rust/           # 形態素解析エンジン（Rust）
│   ├── src/lib.rs         # メイン解析ロジック
│   ├── dictionaries/      # IPADIC辞書ファイル
│   └── tests/             # 統合テスト
├── scripts/               # ビルドスクリプト
└── package.json           # 依存関係管理
```

## 🛠 技術スタック

- **Frontend**: React Native 0.80.2, Expo Router 5.1.4, TypeScript 5.0.4
- **Backend**: Rust, Vibrato, MeCab IPADIC 2.7.0
- **Bridge**: C FFI (React Native ↔ Rust)

## 🔧 開発環境

```bash
cd ReadMaker
npm install

# 形態素解析エンジンのテスト
cd native/rust
cargo test -- --nocapture
```

詳細は `ReadMaker/README.md` を参照