import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import Library from './library';
import { getWords } from '../../src/services/textAnalyzer';
import { useLocalSearchParams } from 'expo-router';

// サンプルテキスト（実際にはNewsAPIから取得する想定）
const SAMPLE_TEXT = `最新の研究によると、人工知能の発達により、多くの業界で働き方が変化している。特に、医療分野では診断の精度が向上し、患者により良い治療を提供できるようになった。また、教育分野でも個別指導が可能となり、学習効率が大幅に改善されている。しかし、これらの技術進歩には新たな課題も伴う。プライバシーの保護やデータセキュリティの確保が重要な議題となっており、適切な規制の整備が求められている。`;

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  const minSpeed = 100;
  const maxSpeed = 1000;

  const handleSpeedChange = (value: number) => {
    const roundedValue = Math.round(value);
    onSpeedChange(roundedValue);
  };

  return (
    <View style={styles.speedControlContainer}>
      <Text style={styles.speedControlLabel}>読み取り速度</Text>
      <View style={styles.speedDisplay}>
        <Text style={styles.speedValue}>{speed} 文字/分</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.minMaxLabel}>{minSpeed}</Text>
        <Slider
          style={styles.slider}
          minimumValue={minSpeed}
          maximumValue={maxSpeed}
          value={speed}
          onValueChange={handleSpeedChange}
          minimumTrackTintColor="#FF6B35"
          maximumTrackTintColor="#E0E0E0"
          step={50}
        />
        <Text style={styles.minMaxLabel}>{maxSpeed}</Text>
      </View>
      <View style={styles.speedLabels}>
        <Text style={styles.speedLabel}>遅い</Text>
        <Text style={styles.speedLabel}>速い</Text>
      </View>
    </View>
  );
};

interface DisplayModeToggleProps {
  currentMode: 'normal' | 'word';
  onModeChange: (mode: 'normal' | 'word') => void;
  disabled?: boolean;
}

const DisplayModeToggle: React.FC<DisplayModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false
}) => {
  return (
    <View style={styles.displayModeContainer}>
      <Text style={styles.modeLabel}>表示モード</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'normal' && styles.modeButtonActive,
            disabled && styles.modeButtonDisabled
          ]}
          onPress={() => onModeChange('normal')}
          disabled={disabled}
        >
          <Text style={styles.modeIcon}>📄</Text>
          <Text style={[
            styles.modeText,
            currentMode === 'normal' && styles.modeTextActive,
            disabled && styles.modeTextDisabled
          ]}>
            通常表示
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'word' && styles.modeButtonActive,
            disabled && styles.modeButtonDisabled
          ]}
          onPress={() => onModeChange('word')}
          disabled={disabled}
        >
          <Text style={styles.modeIcon}>🔤</Text>
          <Text style={[
            styles.modeText,
            currentMode === 'word' && styles.modeTextActive,
            disabled && styles.modeTextDisabled
          ]}>
            単語分割
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface TextDisplayProps {
  text?: string;
  speed: number;
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
    if (!inputText || typeof inputText !== 'string') {
      return ['テキストが読み込まれていません'];
    }

    if (mode === 'word') {
      return inputText
        .replace(/([。！？])/g, '$1\n')
        .split(/[\s\n、。！？]+/)
        .filter(segment => segment.trim().length > 0);
    } else {
      return inputText
        .replace(/([、。！？])/g, '$1\n')
        .split(/\n/)
        .filter(segment => segment.trim().length > 0);
    }
  }, []);

  // テキスト分割の初期化
  useEffect(() => {
    const textToProcess = text || SAMPLE_TEXT;
    const segments = segmentText(textToProcess, displayMode);
    setTextSegments(segments);
    setCurrentIndex(0);
    setDisplayText(segments[0] || '');
  }, [text, displayMode, segmentText]);

  // 自動再生ロジック
  useEffect(() => {
    if (!isPlaying || textSegments.length === 0) return;

    const averageCharPerSegment = displayMode === 'word' ? 2 : 4;
    const intervalTime = (averageCharPerSegment / speed) * 60 * 1000;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= textSegments.length) {
          onComplete?.();
          return prevIndex;
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
                  width: (progressPercentage / 100) * 200
                }
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

interface MainDisplayProps {
  onNavigateToResult?: () => void;
}

const MainDisplay: React.FC<MainDisplayProps> = ({ onNavigateToResult }) => {
  const router = useRouter();

  const params = useLocalSearchParams();
  
  // パラメータからテキストを取得、なければSAMPLE_TEXTを使用
  const [inputText, setInputText] = useState(params.text as string || SAMPLE_TEXT);
  const [inputTitle, setInputTitle] = useState(params.title as string || 'サンプルテキスト');
  const [displayMode, setDisplayMode] = useState<'normal' | 'word'>(
    (params.howToShow as 'normal' | 'word') || 'normal'
  );
  const [speed, setSpeed] = useState(parseInt(params.WPM as string) || 300);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('解析結果：');

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const words = await getWords(inputText); // SAMPLE_TEXTの代わりにinputTextを使用
        setAnalysisResult('解析結果：' + words.join(' | '));
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
        setAnalysisResult('解析エラー：' + errorMessage);
      }
    };
    runAnalysis();
  }, [inputText]); // inputTextが変更されたときに再実行

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const handleModeChange = (mode: 'normal' | 'word') => {
    if (!isPlaying) {
      setDisplayMode(mode);
    }
  };

  const handleNavigateToResult = () => {
    // Expo Routerを使用した遷移
    router.push({
      pathname: '/result',
      params: {
        originalText: inputText,
        readingSpeed: speed.toString(),
        displayMode: displayMode,
      }
    });
    
    // プロパティで渡されたコールバックも実行（あれば）
    if (onNavigateToResult) {
      onNavigateToResult();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>{inputTitle}</Text> {/* タイトルを表示 */}
        </View>

        {/* 解析結果表示 */}
        <View style={styles.analysisResultContainer}>
          <Text style={styles.analysisResultText}>{analysisResult}</Text>
        </View>

        {/* コントロールセクション */}
        <View style={styles.controlsSection}>
          <SpeedControl 
            speed={speed}
            onSpeedChange={setSpeed}
          />
          <DisplayModeToggle
            currentMode={displayMode}
            onModeChange={handleModeChange}
            disabled={isPlaying}
          />
        </View>

        {/* テキスト表示セクション */}
        <View style={styles.displaySection}>
          <TextDisplay
            text={inputText} // SAMPLE_TEXTの代わりにinputTextを使用
            speed={speed}
            isPlaying={isPlaying}
            displayMode={displayMode}
            onComplete={handleComplete}
          />
        </View>

        {/* 制御ボタン */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[
              styles.controlBtn,
              styles.playPauseBtn,
              isCompleted && styles.controlBtnDisabled
            ]}
            onPress={handlePlayPause}
            disabled={isCompleted}
          >
            <Text style={styles.controlBtnText}>
              {isPlaying ? '⏸️ 一時停止' : '▶️ 開始'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, styles.resetBtn]}
            onPress={handleReset}
          >
            <Text style={styles.resetBtnText}>🔄 リセット</Text>
          </TouchableOpacity>
        </View>

        {/* 完了メッセージ */}
        {isCompleted && (
          <TouchableOpacity 
            style={styles.completionMessage}
            onPress={handleNavigateToResult}
            activeOpacity={0.8}
          >
            <Text style={styles.completionTitle}>🎉 読書完了！</Text>
            <Text style={styles.completionText}>タップして理解度判定に進む</Text>
            <View style={styles.tapIndicator}>
              <Text style={styles.tapIcon}>👆</Text>
              <Text style={styles.tapHint}>タップしてください</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 5,
  },
    title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },
  analysisResultContainer: {
    backgroundColor: '#e8f5e9', // Light green background
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  analysisResultText: {
    fontSize: 14,
    color: '#2e7d32', // Dark green text
    fontWeight: '500',
    textAlign: 'center',
  },
  controlsSection: {
    marginBottom: 20,
  },
  // Speed Control Styles
  speedControlContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speedControlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  speedDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },
  speedValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  minMaxLabel: {
    fontSize: 12,
    color: '#666666',
    width: 40,
    textAlign: 'center',
  },
  speedLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  speedLabel: {
    fontSize: 12,
    color: '#999999',
  },
  // Display Mode Toggle Styles
  displayModeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'transparent',
    minWidth: 120,
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  modeButtonActive: {
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modeButtonDisabled: {
    opacity: 0.5,
  },
  modeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  modeTextDisabled: {
    color: '#cccccc',
  },
  // Text Display Styles
  displaySection: {
    marginBottom: 20,
    minHeight: 200,
  },
  textDisplayArea: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  currentTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
    marginBottom: 20,
  },
  currentText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 36,
    textAlign: 'center',
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#ff6b35',
    borderRadius: 2,
  },
  // Control Buttons Styles
  controlButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  controlBtn: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  playPauseBtn: {
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resetBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#dddddd',
  },
  controlBtnDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  controlBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  // Completion Message Styles
  completionMessage: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff6b35',
    marginBottom: 10,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  tapIndicator: {
    alignItems: 'center',
  },
  tapIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  tapHint: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
});

export default MainDisplay;