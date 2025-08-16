/**
 * ReadMaker Rust Bridge
 * React NativeからRustの形態素解析を呼び出すためのブリッジ
 */

import { NativeModules, Platform } from 'react-native';

// TypeScript型定義
export interface MorphologyAnalysis {
  analyzeText(input: string, dictPath: string): Promise<string[]>;
  testBridge(): Promise<string>;
}

// ネイティブモジュール型定義
interface RustBridgeNative {
  analyzeText(input: string, dictPath: string): Promise<string>;
  testBridge(): Promise<string>;
}

class RustBridge implements MorphologyAnalysis {
  private nativeModule: RustBridgeNative | null;
  private available = false;

  constructor() {
    // プラットフォーム別ネイティブモジュール取得
    this.nativeModule = (NativeModules as any)?.ReadMakerRustBridge ?? null;
    this.available = !!this.nativeModule;

    if (!this.available) {
      // ネイティブ未組み込みでもアプリを落とさず、フォールバックに切り替える
      console.warn(
        `ReadMaker Rust Bridge not found. Platform: ${Platform.OS}. ` +
          'Falling back to JS-only tokenizer. Install native bridge to enable Rust acceleration.'
      );
    }
  }

  /**
   * 形態素解析実行
   * @param input 解析対象の日本語テキスト
   * @param dictPath 辞書ファイルの絶対パス
   * @returns 形態素解析結果の配列
   */
  async analyzeText(input: string, dictPath: string): Promise<string[]> {
    try {
      // バリデーション
      if (typeof input !== 'string') {
        throw new Error('Input must be a string');
      }
      if (typeof dictPath !== 'string' || dictPath.trim().length === 0) {
        throw new Error('Dictionary path must be a non-empty string');
      }
      
      if (input.trim().length === 0) {
        return [];
      }
      
      // ネイティブ未利用時は早期フォールバック
      if (!this.available || !this.nativeModule) {
        return this.fallbackAnalysis(input);
      }

      // Rustネイティブ関数呼び出し
      const jsonResult = await this.nativeModule.analyzeText(input, dictPath);
      
      // JSON文字列をパース
      const words: string[] = JSON.parse(jsonResult);
      
      return words;
      
    } catch (error) {
      console.error('RustBridge.analyzeText error:', error);
      
      // フォールバック: 簡易分割
      return this.fallbackAnalysis(input);
    }
  }

  /**
   * ブリッジ接続テスト
   * @returns 接続確認メッセージ
   */
  async testBridge(): Promise<string> {
    try {
      if (!this.available || !this.nativeModule) {
        return 'ReadMaker Rust Bridge not available (fallback mode)';
      }
      const result = await this.nativeModule.testBridge();
      return result;
    } catch (error) {
      console.error('RustBridge.testBridge error:', error);
      throw new Error(`Bridge connection failed: ${error}`);
    }
  }

  /**
   * フォールバック形態素解析（Rustが利用できない場合）
   * @param input 入力テキスト
   * @returns 簡易分割結果
   */
  private fallbackAnalysis(input: string): string[] {
    // 簡易実装: 句読点で分割
    return input
      .split(/([。、！？\s]+)/)
      .filter(word => word.trim().length > 0);
  }
}

// シングルトンインスタンス
let rustBridgeInstance: RustBridge | null = null;

/**
 * RustBridge インスタンス取得
 * @returns RustBridge シングルトンインスタンス
 */
export const getRustBridge = (): RustBridge => {
  if (!rustBridgeInstance) {
    rustBridgeInstance = new RustBridge();
  }
  return rustBridgeInstance;
};

/**
 * 便利関数: 形態素解析実行
 * @param input 解析対象テキスト
 * @param dictPath 辞書ファイルの絶対パス
 * @returns 形態素解析結果
 */
export const analyzeText = async (input: string, dictPath: string): Promise<string[]> => {
  const bridge = getRustBridge();
  return bridge.analyzeText(input, dictPath);
};

/**
 * 便利関数: ブリッジテスト
 * @returns 接続確認結果
 */
export const testRustBridge = async (): Promise<string> => {
  const bridge = getRustBridge();
  return bridge.testBridge();
};

// デフォルトエクスポート
export default RustBridge;