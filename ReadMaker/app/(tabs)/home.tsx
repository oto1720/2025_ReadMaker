
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// 型定義
interface UserStats {
  totalBooksRead: number;
  averageWPM: number;
  totalReadingTime: number; // 分
  currentLevel: number;
  currentPoints: number;
  todayReadingTime: number; // 分
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  isUnlocked: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  // 認証チェック
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  // ローディング中または未認証の場合は何も表示しない
  if (isLoading || !isAuthenticated) {
    return null;
  }
  
  // ユーザー統計（後でAsyncStorageから取得）
  const [userStats, setUserStats] = useState<UserStats>({
    totalBooksRead: 12,
    averageWPM: 280,
    totalReadingTime: 1240, // 20時間40分
    currentLevel: 5,
    currentPoints: 2850,
    todayReadingTime: 25,
  });

  // 最近の実績
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([
    { id: '1', title: 'スピードリーダー', icon: '⚡', isUnlocked: true },
    { id: '2', title: '継続は力なり', icon: '📚', isUnlocked: true },
    { id: '3', title: 'ワードマスター', icon: '🏆', isUnlocked: false },
  ]);

  // クイックスタート機能
  const handleQuickStart = () => {
    // デモテキストで即座に速読開始
    router.push('/reader/demo');
  };

  // テキスト入力画面へ
  const handleTextInput = () => {
    router.push('/(tabs)/library?mode=input');
  };

  // 小説選択画面へ
  const handleNovelSelection = () => {
    router.push('/(tabs)/library?mode=novels');
  };

  // 設定画面へ（将来実装）
  const handleSettings = () => {
    Alert.alert(
      '設定',
      `ログインユーザー: ${user?.email || '不明'}`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'ログアウト', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'ログアウト',
              '本当にログアウトしますか？',
              [
                { text: 'キャンセル', style: 'cancel' },
                { 
                  text: 'ログアウト', 
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/(auth)/login');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  // レベル進捗の計算
  const getLevelProgress = () => {
    const pointsForNextLevel = userStats.currentLevel * 1000;
    const currentLevelPoints = userStats.currentPoints % 1000;
    return (currentLevelPoints / pointsForNextLevel) * 100;
  };

  // 読書時間を時間:分形式に変換
  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* ヘッダー部分 */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>おかえりなさい！</Text>
            <Text style={styles.appTitle}>
              {user?.username || 'ゲスト'}さん
            </Text>
          </View>
          
          <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* レベル・ポイント表示 */}
        <View style={styles.levelSection}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {userStats.currentLevel}</Text>
            <Text style={styles.pointsText}>{userStats.currentPoints.toLocaleString()} pts</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${getLevelProgress()}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* 今日の統計 */}
      <View style={styles.todayStats}>
        <Text style={styles.sectionTitle}>今日の成果</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{userStats.todayReadingTime}</Text>
            <Text style={styles.statLabel}>分</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="speedometer-outline" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{userStats.averageWPM}</Text>
            <Text style={styles.statLabel}>WPM</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="library-outline" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{userStats.totalBooksRead}</Text>
            <Text style={styles.statLabel}>冊</Text>
          </View>
        </View>
      </View>

      {/* クイックアクション */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>読書を始める</Text>
        
        <TouchableOpacity style={styles.primaryAction} onPress={handleQuickStart}>
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={styles.actionGradient}
          >
            <Ionicons name="play-circle" size={32} color="#ffffff" />
            <Text style={styles.primaryActionText}>クイックスタート</Text>
            <Text style={styles.primaryActionSubtext}>デモテキストで即座に開始</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={handleTextInput}>
            <View style={styles.actionContent}>
              <Ionicons name="create-outline" size={28} color="#34C759" />
              <Text style={styles.secondaryActionText}>テキスト入力</Text>
              <Text style={styles.secondaryActionSubtext}>コピペで読書</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleNovelSelection}>
            <View style={styles.actionContent}>
              <Ionicons name="book-outline" size={28} color="#FF9500" />
              <Text style={styles.secondaryActionText}>小説を選ぶ</Text>
              <Text style={styles.secondaryActionSubtext}>青空文庫から</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 最近の実績 */}
      <View style={styles.achievements}>
        <Text style={styles.sectionTitle}>最近の実績</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentAchievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementCard,
                !achievement.isUnlocked && styles.achievementLocked
              ]}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text 
                style={[
                  styles.achievementTitle,
                  !achievement.isUnlocked && styles.achievementTitleLocked
                ]}
              >
                {achievement.title}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 読書習慣継続 */}
      <View style={styles.habitTracker}>
        <View style={styles.habitHeader}>
          <Text style={styles.sectionTitle}>読書習慣</Text>
          <Text style={styles.habitStreak}>🔥 7日連続</Text>
        </View>
        <Text style={styles.habitDescription}>
          毎日少しずつでも読書を続けて、スキルアップしましょう！
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
  },
  levelSection: {
    marginTop: 10,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pointsText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  todayStats: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
  },
  primaryAction: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  primaryActionSubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionContent: {
    padding: 16,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 8,
  },
  secondaryActionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievements: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementLocked: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#999',
  },
  habitTracker: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitStreak: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});