import { dictionaryLoader } from './dictionaryLoader';
import { getRustBridge } from '../native/bridge/RustBridge';

class TextAnalyzer {
  private static instance: TextAnalyzer;
  private initialized = false;
  private dictionaryData: Uint8Array | null = null;

  static getInstance(): TextAnalyzer {
    if (!this.instance) {
      this.instance = new TextAnalyzer();
    }
    return this.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      console.log('形態素解析エンジン初期化開始...');
      
      // 辞書データを読み込み
      this.dictionaryData = await dictionaryLoader.loadDictionary();
      console.log('辞書データサイズ:', this.dictionaryData.length, 'bytes');

      // ブリッジが利用可能かテスト
      const bridge = getRustBridge();
      const testResult = await bridge.testBridge();
      console.log('Bridge Test Result:', testResult);

      if (this.dictionaryData) {
        this.initialized = true;
        console.log('✅ 形態素解析エンジン初期化完了');
        console.log('📁 辞書パス: native/rust/dictionaries/ipadic.vibrato (バンドル済み)');
      } else {
        console.error('❌ 辞書データの読み込みに失敗');
      }

      return this.initialized;
    } catch (error) {
      console.error('初期化エラー:', error);
      return false;
    }
  }

  async analyzeText(text: string): Promise<string[]> {
    try {
      // 未初期化の場合は初期化
      if (!this.initialized) {
        const success = await this.initialize();
        if (!success) {
          throw new Error('形態素解析エンジンの初期化に失敗');
        }
      }

      if (!this.dictionaryData) {
        throw new Error('辞書データが利用できません');
      }

      const bridge = getRustBridge();
      // 形態素解析実行
      const words = await bridge.analyzeText(text, this.dictionaryData);

      console.log(`📝 入力: "${text}"`);
      console.log('🔍 解析結果:', words);
      console.log('📊 語数:', words.length);

      return words;

    } catch (error) {
      console.error('解析エラー:', error);
      return [];
    }
  }

  // バッチ処理対応
  async analyzeBatch(texts: string[]): Promise<string[][]> {
    const results = [];
    for (const text of texts) {
      const words = await this.analyzeText(text);
      results.push(words);
    }
    return results;
  }

  // 統計情報取得
  getStatus() {
    return {
      initialized: this.initialized,
      dictionaryLoaded: dictionaryLoader.isLoaded(),
      dictionarySize: dictionaryLoader.getDictionarySize(),
      dictionaryPath: 'native/rust/dictionaries/ipadic.vibrato'
    };
  }
}

export const textAnalyzer = TextAnalyzer.getInstance();

// あなたの既存コードと完全互換のインターフェース
export async function analyzeText(text: string): Promise<string[]> {
  // textAnalyzerの初期化を待つ
  await textAnalyzer.initialize();
  return await textAnalyzer.analyzeText(text);
}

// 便利関数
export async function getWords(text: string): Promise<string[]> {
  return await analyzeText(text);
}
