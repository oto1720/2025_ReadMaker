import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

// AI判定のシミュレーション関数
const evaluateComprehension = (userInput: string, originalText: string): { rank: 'S' | 'A' | 'B', comment: string } => {
  const inputLength = userInput.trim().length;
  
  // 簡単な判定ロジック（実際にはAPIを使用）
  if (inputLength >= 100) {
    return {
      rank: 'S',
      comment: '素晴らしい理解力です！文章の要点を的確に捉えており、速読スキルが非常に高いレベルに達しています。'
    };
  } else if (inputLength >= 50) {
    return {
      rank: 'A',
      comment: 'とても良い理解ができています！もう少し詳細を加えることで、さらに完璧な要約になりそうです。'
    };
  } else {
    return {
      rank: 'B',
      comment: '基本的な内容は理解できています！次回はもう少し詳しく要約してみると、さらに理解が深まりますよ。'
    };
  }
};

interface ResultProps {
  originalText?: string;
  readingSpeed?: number;
  displayMode?: 'normal' | 'word';
  onRetry?: () => void;
  onHome?: () => void;
}

const Result: React.FC<ResultProps> = ({ 
  originalText = "デフォルトテキスト",
  readingSpeed = 300,
  displayMode = 'normal',
  onRetry,
  onHome 
}) => {
  const [userInput, setUserInput] = useState('');
  const [evaluation, setEvaluation] = useState<{ rank: 'S' | 'A' | 'B', comment: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (userInput.trim().length === 0) {
      Alert.alert('入力エラー', 'まずは読んだ内容を入力してください。');
      return;
    }

    setIsEvaluating(true);
    
    // AI判定のシミュレーション（実際にはAPI呼び出し）
    setTimeout(() => {
      const result = evaluateComprehension(userInput, originalText);
      setEvaluation(result);
      setIsEvaluating(false);
    }, 2000);
  };

  const getRankColor = (rank: 'S' | 'A' | 'B') => {
    switch (rank) {
      case 'S': return '#FFD700'; // ゴールド
      case 'A': return '#FF6B35'; // オレンジ
      case 'B': return '#4CAF50'; // グリーン
      default: return '#333333';
    }
  };

  const getRankEmoji = (rank: 'S' | 'A' | 'B') => {
    switch (rank) {
      case 'S': return '🏆';
      case 'A': return '🥈';
      case 'B': return '🥉';
      default: return '📖';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>速読結果</Text>
          <Text style={styles.subtitle}>読んだ内容をまとめて入力してください</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              読み取り速度: {readingSpeed}文字/分 | モード: {displayMode === 'normal' ? '通常表示' : '単語分割'}
            </Text>
          </View>
        </View>

        {/* テキスト入力エリア */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>内容のまとめ</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={8}
            placeholder="ここに読んだ文章の内容をまとめて入力してください..."
            placeholderTextColor="#999999"
            value={userInput}
            onChangeText={setUserInput}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {userInput.length} 文字
          </Text>
        </View>

        {/* 判定ボタン */}
        <TouchableOpacity
          style={[
            styles.evaluateButton,
            isEvaluating && styles.evaluateButtonDisabled
          ]}
          onPress={handleEvaluate}
          disabled={isEvaluating}
        >
          <Text style={styles.evaluateButtonText}>
            {isEvaluating ? '🤖 AIが判定中...' : '🎯 AI判定を開始'}
          </Text>
        </TouchableOpacity>

        {/* 判定結果表示 */}
        {evaluation && (
          <View style={styles.resultSection}>
            <View style={styles.rankDisplay}>
              <Text style={styles.rankEmoji}>
                {getRankEmoji(evaluation.rank)}
              </Text>
              <Text style={styles.rankText}>
                あなたは
                <Text style={[
                  styles.rankHighlight,
                  { color: getRankColor(evaluation.rank) }
                ]}>
                  "{evaluation.rank}ランク"
                </Text>
                です！
              </Text>
            </View>
            
            <View style={styles.commentSection}>
              <Text style={styles.commentText}>
                {evaluation.comment}
              </Text>
            </View>

            {/* アクションボタン */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.retryBtn]}
                onPress={onRetry}
              >
                <Text style={styles.retryBtnText}>🔄 もう一度挑戦</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionBtn, styles.homeBtn]}
                onPress={onHome}
              >
                <Text style={styles.homeBtnText}>🏠 ホームに戻る</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterCount: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
  },
  evaluateButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  evaluateButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  evaluateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  rankDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rankEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  rankText: {
    fontSize: 20,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  rankHighlight: {
    fontSize: 24,
    fontWeight: '700',
  },
  commentSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  commentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: '#ff6b35',
  },
  homeBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});

export default Result;