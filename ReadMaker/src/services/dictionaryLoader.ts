import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

class DictionaryLoader {
  private static instance: DictionaryLoader;
  private dictionaryData: Uint8Array | null = null;
  private initialized = false;

  static getInstance(): DictionaryLoader {
    if (!this.instance) {
      this.instance = new DictionaryLoader();
    }
    return this.instance;
  }

  async loadDictionary(): Promise<Uint8Array> {
    if (this.dictionaryData && this.initialized) {
      return this.dictionaryData;
    }

    try {
      console.log('辞書読み込み開始...');
      
      // 既存パスから辞書を読み込み
      // require()で相対パスを解決
      const dictionaryAsset = Asset.fromModule(
        require('../../native/rust/dictionaries/ipadic.vibrato')
      );
      
      // アセットをダウンロード（初回のみ）
      if (!dictionaryAsset.downloaded) {
        console.log('辞書ファイルをダウンロード中...');
        await dictionaryAsset.downloadAsync();
      }

      // ローカルURIを取得
      const localUri = dictionaryAsset.localUri || dictionaryAsset.uri;
      console.log('辞書パス:', localUri);

      // ファイルを読み込み（バイナリデータとして）
      const base64Data = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Base64をUint8Arrayに変換
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      this.dictionaryData = bytes;
      this.initialized = true;
      
      console.log(`辞書読み込み完了: ${bytes.length} bytes`);
      return bytes;

    } catch (error: any) {
      console.error('辞書読み込みエラー:', error);
      throw new Error(`辞書の読み込みに失敗しました: ${error.message}`);
    }
  }

  // 辞書が読み込み済みかチェック
  isLoaded(): boolean {
    return this.initialized && this.dictionaryData !== null;
  }

  // 辞書データを取得
  getDictionary(): Uint8Array | null {
    return this.dictionaryData;
  }

  // メモリ使用量確認用
  getDictionarySize(): number {
    return this.dictionaryData ? this.dictionaryData.length : 0;
  }
}

export const dictionaryLoader = DictionaryLoader.getInstance();
