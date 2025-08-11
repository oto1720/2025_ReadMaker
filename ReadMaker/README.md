# ReadMaker - 速読マスターアプリ

ReadMakerは、速読スキルの向上と読書習慣の形成を支援するReact Native + Expo Routerベースのモバイルアプリケーションです。

高速形態素解析エンジン（Rust + Vibrato）を搭載し、日本語テキストの精密な解析による最適な速読体験を提供します。

## 🚀 主な機能

### 📱 アプリ構造（app/ディレクトリ）

#### ルーティング構造
- **`app/index.tsx`**: アプリのエントリーポイント - ホーム画面にリダイレクト
- **`app/_layout.tsx`**: ルートレイアウト - Stackナビゲーション（タブとリーダー画面）
- **`app/(tabs)/_layout.tsx`**: タブナビゲーションレイアウト - ホームがデフォルト画面

#### ホーム画面（`app/(tabs)/home.tsx`）
メインのダッシュボード画面として以下の機能を提供：

**📊 ユーザー統計表示**
- 読了冊数の追跡
- 平均WPM（Words Per Minute）の表示
- 総読書時間の記録
- 現在のレベルとポイントシステム
- 今日の読書時間

**⚡ クイックアクション**
- **クイックスタート**: デモテキストで即座に速読練習開始
- **テキスト入力**: ユーザーがコピー&ペーストしたテキストで練習
- **小説選択**: 青空文庫から小説を選んで読書

**🏆 ゲーミフィケーション要素**
- レベルシステム（経験値とレベル進行）
- 実績・バッジシステム（スピードリーダー、継続は力なり等）
- 読書習慣トラッキング（連続日数カウント）

**🎨 UI/UX特徴**
- グラデーション背景とモダンなデザイン
- Ioniconsを使用したアイコン
- カード型レイアウト
- 統計情報の視覚化

### 📁 ソース構造（src/ディレクトリ）
現在は以下のディレクトリ構造が準備されています（開発用の骨組み）：

```
src/
├── assets/      # 画像、フォント等のリソース
├── components/  # 再利用可能なUIコンポーネント
├── constnts/    # アプリ定数（設定値等）
├── hooks/       # カスタムReactフック
├── services/    # API通信、データ処理サービス
├── types/       # TypeScript型定義
└── utils/       # ユーティリティ関数
```

## 🛠 技術スタック

### フロントエンド
- **React Native**: 0.80.2
- **Expo Router**: 5.1.4 - ファイルベースルーティング
- **TypeScript**: 5.0.4 - 型安全性
- **Expo Linear Gradient**: グラデーション背景
- **Expo Vector Icons**: アイコンライブラリ

### バックエンド・解析エンジン
- **Rust**: 高速形態素解析エンジン
- **Vibrato**: 最新の日本語形態素解析ライブラリ
- **IPADIC辞書**: MeCab IPADIC 2.7.0対応
- **C FFI**: React Nativeとの高速ブリッジ通信

### 開発・ビルド
- **Node.js**: 辞書変換スクリプト
- **iconv-lite**: 文字エンコーディング変換
- **Jest**: テストフレームワーク

## 📋 想定機能（開発予定）

1. **速読練習モード**
   - 文字表示速度調整
   - WPM測定機能
   - 理解度テスト

2. **読書管理**
   - 読書履歴追跡
   - 青空文庫連携
   - ブックマーク機能

3. **進捗管理**
   - 統計ダッシュボード
   - 目標設定機能
   - 習慣トラッキング

4. **ユーザー設定**
   - 表示設定カスタマイズ
   - 読書速度設定
   - 通知設定

## 📝 開発状況

### ✅ 完了済み
- **基本アプリ構造**: Expo Router設定、タブナビゲーション
- **ホーム画面**: UI実装、統計表示、クイックアクション
- **Rust形態素解析エンジン**: Vibrato + IPADIC辞書による高速解析
- **辞書セットアップ**: 自動変換スクリプト（EUC-JP→UTF-8）
- **C FFI Bridge**: React Nativeとの連携準備
- **テスト環境**: ユニットテスト、統合テスト（全テストPASS）

### � 進行中
- **速読機能**: 形態素解析結果を活用した表示制御

### 🔲 予定
- **データ永続化**: 読書履歴、設定の保存
- **青空文庫API連携**: 豊富なコンテンツライブラリ
- **詳細統計機能**: WPM分析、理解度測定
- **ユーザー設定**: カスタマイズ機能

---

## 🔧 開発環境セットアップ

### 必要な環境
- Node.js 18+
- React Native開発環境
- Rust（形態素解析エンジンのビルド用）

### インストール
```bash
cd ReadMaker
npm install
```

### 形態素解析エンジンのテスト
```bash
cd native/rust
# 辞書パスを指定してテスト実行
$env:READMAKER_DIC_PATH = "dictionaries\ipadic.vibrato"
cargo test -- --nocapture
```

### 辞書の再構築（必要時のみ）
```bash
# MeCab辞書からVibrato辞書への変換
npm run dic:build-lex
# 出力: lex_utf8.csv, *_utf8.def

# Vibrato辞書のコンパイル（vibrato CLIが必要）
compile -l lex_utf8.csv -o dictionaries/ipadic.vibrato \
  --unk unk_utf8.def --char char_utf8.def --matrix matrix_utf8.def
```

**クロスプラットフォーム対応** - iOS & Android  
**React Nativeによるネイティブパフォーマンス** - TypeScript完全対応  
**高速形態素解析** - Rust + Vibrato搭載  
**モダンなUI/UX** - グラデーションとアニメーション

> **注意**: 続行する前に、[環境セットアップ](https://reactnative.dev/docs/set-up-your-environment)ガイドを完了していることを確認してください。

## 🚀 開発・起動方法

### 依存関係のインストール
```bash
npm install
```

### 開発サーバー起動
```bash
# Expoを使用
npm start
# または
npx expo start
```

## ステップ2: アプリのビルドと実行

Metroが実行されている状態で、React Nativeプロジェクトのルートから新しいターミナルウィンドウ/ペインを開き、以下のコマンドのいずれかを使用してAndroidまたはiOSアプリをビルドして実行します：

### Android

```sh
# npmを使用
npm run android

# またはYarnを使用
yarn android
```

### iOS

iOSの場合、CocosPodsの依存関係をインストールすることを忘れないでください（これは最初のクローン時またはネイティブ依存関係の更新後にのみ実行する必要があります）。

新しいプロジェクトを初めて作成する場合は、Ruby bundlerを実行してCocoaPods自体をインストールします：

```sh
bundle install
```

その後、ネイティブ依存関係を更新するたびに、以下を実行します：

```sh
bundle exec pod install
```

詳細については、[CocoaPods入門ガイド](https://guides.cocoapods.org/using/getting-started.html)をご覧ください。

```sh
# npmを使用
npm run ios

# またはYarnを使用
yarn ios
```

すべてが正しく設定されていれば、Androidエミュレーター、iOSシミュレーター、または接続されたデバイスで新しいアプリが実行されているのを確認できます。

これはアプリを実行する方法の一つです — Android StudioまたはXcodeから直接ビルドすることもできます。

## ステップ3: アプリの変更

アプリの実行に成功したので、変更を加えてみましょう！

お好みのテキストエディターで`App.tsx`を開き、変更を加えてください。保存すると、アプリは自動的に更新され、これらの変更が反映されます — これは[Fast Refresh](https://reactnative.dev/docs/fast-refresh)によって実現されています。

アプリの状態をリセットするなど、強制的にリロードしたい場合は、フルリロードを実行できます：

- **Android**: <kbd>R</kbd>キーを2回押すか、<kbd>Ctrl</kbd> + <kbd>M</kbd>（Windows/Linux）または<kbd>Cmd ⌘</kbd> + <kbd>M</kbd>（macOS）でアクセスできる**開発メニュー**から**「Reload」**を選択します。
- **iOS**: iOSシミュレーターで<kbd>R</kbd>を押します。

## おめでとうございます！ :tada:

React Nativeアプリの実行と変更に成功しました。 :partying_face:

### 次は何をしますか？

- この新しいReact Nativeコードを既存のアプリケーションに追加したい場合は、[統合ガイド](https://reactnative.dev/docs/integration-with-existing-apps)をご確認ください。
- React Nativeについてさらに詳しく知りたい場合は、[ドキュメント](https://reactnative.dev/docs/getting-started)をご覧ください。

# トラブルシューティング

上記の手順で問題が発生している場合は、[トラブルシューティング](https://reactnative.dev/docs/troubleshooting)ページを参照してください。

# さらに詳しく

React Nativeについてさらに詳しく学ぶには、以下のリソースをご覧ください：

- [React Native Website](https://reactnative.dev) - React Nativeについてさらに詳しく学習できます。
- [Getting Started](https://reactnative.dev/docs/environment-setup) - React Nativeの**概要**と環境設定方法。
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - React Nativeの**基本**の**ガイドツアー**。
- [Blog](https://reactnative.dev/blog) - 最新の公式React Native**ブログ**投稿を読む。
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React NativeのオープンソースGitHub**リポジトリ**。