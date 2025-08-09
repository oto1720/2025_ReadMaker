/**
 * RustBridge テストコンポーネント
 * 形態素解析のデモと動作確認
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { analyzeText, testRustBridge } from './RustBridge';

const RustBridgeTest: React.FC = () => {
  const [inputText, setInputText] = useState('吾輩は猫である。名前はまだない。');
  const [morphemes, setMorphemes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<string>('未確認');

  // コンポーネント初期化時にブリッジテスト
  useEffect(() => {
    testBridgeConnection();
  }, []);

  /**
   * Rustブリッジ接続テスト
   */
  const testBridgeConnection = async () => {
    try {
      const result = await testRustBridge();
      setBridgeStatus(`✅ ${result}`);
    } catch (error) {
      setBridgeStatus(`❌ 接続失敗: ${error}`);
    }
  };

  /**
   * 形態素解析実行
   */
  const handleAnalyze = async () => {
    if (inputText.trim().length === 0) {
      Alert.alert('エラー', 'テキストを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const words = await analyzeText(inputText);
      setMorphemes(words);
    } catch (error) {
      Alert.alert('エラー', `形態素解析に失敗しました: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * サンプルテキスト設定
   */
  const setSampleText = (text: string) => {
    setInputText(text);
    setMorphemes([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ReadMaker - Rust形態素解析テスト</Text>
      
      {/* ブリッジステータス */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Rustブリッジステータス:</Text>
        <Text style={styles.statusText}>{bridgeStatus}</Text>
      </View>

      {/* サンプルテキストボタン */}
      <View style={styles.sampleContainer}>
        <Text style={styles.sampleLabel}>サンプルテキスト:</Text>
        <View style={styles.sampleButtons}>
          <TouchableOpacity 
            style={styles.sampleButton}
            onPress={() => setSampleText('今日は良い天気ですね。明日も晴れるでしょう。')}
          >
            <Text style={styles.sampleButtonText}>天気</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sampleButton}
            onPress={() => setSampleText('学問のすすめ')}
          >
            <Text style={styles.sampleButtonText}>学問</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sampleButton}
            onPress={() => setSampleText('これはテストです。任意の文章を処理できます。')}
          >
            <Text style={styles.sampleButtonText}>テスト</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 入力エリア */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>解析対象テキスト:</Text>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="日本語テキストを入力してください"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* 解析ボタン */}
      <TouchableOpacity 
        style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]}
        onPress={handleAnalyze}
        disabled={isLoading}
      >
        <Text style={styles.analyzeButtonText}>
          {isLoading ? '解析中...' : '🔍 形態素解析実行'}
        </Text>
      </TouchableOpacity>

      {/* 結果表示 */}
      {morphemes.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>解析結果 ({morphemes.length}語):</Text>
          <View style={styles.morphemeContainer}>
            {morphemes.map((word, index) => (
              <View key={index} style={styles.morphemeBox}>
                <Text style={styles.morphemeText}>{word}</Text>
                <Text style={styles.morphemeIndex}>{index + 1}</Text>
              </View>
            ))}
          </View>
          
          {/* JSON表示 */}
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonLabel}>JSON形式:</Text>
            <Text style={styles.jsonText}>{JSON.stringify(morphemes, null, 2)}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
  },
  sampleContainer: {
    marginBottom: 16,
  },
  sampleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  sampleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sampleButton: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  sampleButtonText: {
    color: '#2196f3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  morphemeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  morphemeBox: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#add8e6',
    alignItems: 'center',
  },
  morphemeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  morphemeIndex: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  jsonContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  jsonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  jsonText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
});

export default RustBridgeTest;
