import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Library from './library';

interface TextDisplayProps {
  text?: string; // オプショナルに変更
  speed: number; // 文字/分
  isPlaying: boolean;
  displayMode: 'normal' | 'word';
  onComplete?: () => void;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  speed,
  isPlaying,
  displayMode,
  onComplete
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [textSegments, setTextSegments] = useState<string[]>([]);

  // テキストを分割する関数
  const segmentText = useCallback((inputText: string, mode: 'normal' | 'word') => {
    // inputTextがundefinedまたは空文字の場合のエラーハンドリング
    if (!inputText || typeof inputText !== 'string') {
      return ['テキストが読み込まれていません'];
    }

    if (mode === 'word') {
      // 単語分割モード（形態素解析の代替として簡単な分割を実装）
      return inputText
        .replace(/([。！？])/g, '$1\n')
        .split(/[\s\n、。！？]+/)
        .filter(segment => segment.trim().length > 0);
    } else {
      // 通常モード（文節での分割）
      return inputText
        .replace(/([、。！？])/g, '$1\n')
        .split(/\n/)
        .filter(segment => segment.trim().length > 0);
    }
  }, []);

  // テキスト分割の初期化
  useEffect(() => {
    // textが存在しない場合のデフォルト値を設定
    const textToProcess = text || 'テキストが読み込まれていません。';
    const segments = segmentText(textToProcess, displayMode);
    setTextSegments(segments);
    setCurrentIndex(0);
    setDisplayText(segments[0] || '');
  }, [text, displayMode, segmentText]);

  // 自動再生ロジック
  useEffect(() => {
    if (!isPlaying || textSegments.length === 0) return;

    // 文字/分を基にした間隔計算
    const averageCharPerSegment = displayMode === 'word' ? 2 : 4; // 単語は平均2文字、文節は平均4文字と仮定
    const intervalTime = (averageCharPerSegment / speed) * 60 * 1000; // ミリ秒に変換

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= textSegments.length) {
          onComplete?.();
          return prevIndex; // 最後のインデックスで停止
        }
        setDisplayText(textSegments[nextIndex]);
        return nextIndex;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speed, textSegments, displayMode, onComplete]);

  const progressPercentage = textSegments.length > 0 
    ? ((currentIndex + 1) / textSegments.length) * 100 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.textDisplayArea}>
        <View style={styles.currentTextContainer}>
          <Text style={styles.currentText}>{displayText}</Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {textSegments.length}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: (progressPercentage / 100) * 200 // 200pxの何%かを計算
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textDisplayArea: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  currentTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
    marginBottom: 30,
  },
  currentText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 40,
    textAlign: 'center',
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: 200,
    alignItems: 'center',
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#ff6b35',
    borderRadius: 2,
  },
});

export default TextDisplay;