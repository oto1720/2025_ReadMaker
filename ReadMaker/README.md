# ReadMaker

## ディレクトリー構造
ReadMaker/
├── src/                   # ソースコード
│   ├── components/        # 再利用可能コンポーネント
│   ├── screens/           # 画面コンポーネント
│   ├── navigation/        # ナビゲーション設定
│   ├── services/          # API呼び出し・外部サービス
│   ├── hooks/             # カスタムフック
│   ├── utils/             # ユーティリティ関数
│   ├── constants/         # 定数
│   ├── types/             # TypeScript型定義
│   └── assets/            # 画像・フォント等
└── app.json

## 機能

- クロスプラットフォーム対応（iOS & Android）
- React Nativeによるネイティブパフォーマンス
- 包括的な型安全性を備えたモダンなTypeScriptコードベース
- ダーク・ライトモード対応のレスポンシブデザイン
- 迅速な開発のためのホットリロード機能

このプロジェクトは[`@react-native-community/cli`](https://github.com/react-native-community/cli)を使用してブートストラップされました。

# はじめに

> **注意**: 続行する前に、[環境セットアップ](https://reactnative.dev/docs/set-up-your-environment)ガイドを完了していることを確認してください。

## ステップ1: Metroの起動

まず、React NativeのJavaScriptビルドツールである**Metro**を実行する必要があります。

Metro開発サーバーを起動するには、React Nativeプロジェクトのルートから以下のコマンドを実行してください：

```sh
# npmを使用
npm start

# またはYarnを使用
yarn start
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