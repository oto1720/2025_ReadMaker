import { testRustBridge, analyzeText } from '../../native/bridge/RustBridge';

/**
 * ネイティブモジュール統合テスト
 * 
 * 使用方法:
 * 1. React Nativeアプリを起動
 * 2. この関数を呼び出してテスト実行
 * 3. コンソールで結果確認
 */
export const testNativeIntegration = async () => {
  console.log('=== ネイティブモジュール統合テスト開始 ===');
  
  try {
    // 1. ブリッジ接続テスト
    console.log('1. ブリッジ接続テスト...');
    const bridgeResult = await testRustBridge();
    console.log('ブリッジテスト結果:', bridgeResult);
    
    // 2. 基本的な形態素解析テスト
    console.log('\n2. 基本的な形態素解析テスト...');
    const testCases = [
      '吾輩は猫である。',
      '今日は良い天気です。',
      '学問のすすめ',
      'これはテストです。'
    ];
    
    for (const testText of testCases) {
      console.log(`\n入力: "${testText}"`);
      const words = await analyzeText(testText);
      console.log('解析結果:', words);
      console.log('語数:', words.length);
    }
    
    // 3. 空文字列テスト
    console.log('\n3. 空文字列テスト...');
    const emptyResult = await analyzeText('');
    console.log('空文字列結果:', emptyResult);
    
    // 4. 長文テスト
    console.log('\n4. 長文テスト...');
    const longText = 'これは長い文章のテストです。形態素解析エンジンが正しく動作することを確認するための長いテキストを用意しました。';
    const longResult = await analyzeText(longText);
    console.log('長文入力:', longText);
    console.log('長文解析結果:', longResult);
    console.log('長文語数:', longResult.length);
    
    console.log('\n=== テスト完了！すべて成功しました ===');
    
  } catch (error: any) {
    console.error('=== テストエラー ===');
    console.error('エラー詳細:', error);
    
    if (error?.message && error.message.includes('LIBRARY_ERROR')) {
      console.log('\n💡 解決策: Rustライブラリのビルドとリンクを確認してください');
      console.log('1. cd native/rust');
      console.log('2. cargo build --target aarch64-linux-android --release');
      console.log('3. React Nativeアプリを再ビルド');
    }
  }
};

// デフォルトエクスポート
export default testNativeIntegration;
