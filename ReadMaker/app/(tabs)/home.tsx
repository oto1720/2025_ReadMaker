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
  Animated,
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
  totalReadingTime: number;
  currentLevel: number;
  currentPoints: number;
  todayReadingTime: number;
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  isUnlocked: boolean;
  color: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  
  // 認証チェック
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading]);

  // アニメーション
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // ローディング中または未認証の場合は何も表示しない
  if (isLoading || !isAuthenticated) {
    return null;
  }
  
  // ユーザー統計
  const [userStats, setUserStats] = useState<UserStats>({
    totalBooksRead: 12,
    averageWPM: 280,
    totalReadingTime: 1240,
    currentLevel: 5,
    currentPoints: 2850,
    todayReadingTime: 25,
  });

  // 最近の実績
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([
    { id: '1', title: 'スピードリーダー', icon: '⚡', isUnlocked: true, color: '#FFD60A' },
    { id: '2', title: '継続は力なり', icon: '📚', isUnlocked: true, color: '#30D158' },
    { id: '3', title: 'ワードマスター', icon: '🏆', isUnlocked: false, color: '#FF9F0A' },
    { id: '4', title: '集中力の達人', icon: '🎯', isUnlocked: true, color: '#007AFF' },
  ]);

  // クイックスタート機能
  const handleQuickStart = () => {
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

  // 設定画面へ
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A23" />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー部分 */}
        <LinearGradient
          colors={['#0A0A23', '#1E1B4B', '#3730A3']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.userName}>
                {user?.username || 'Guest'}
              </Text>
            </View>
            
            <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
              <View style={styles.settingsIconContainer}>
                <Ionicons name="settings-outline" size={22} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 今日の読書時間をヘッダーに表示 */}
          <View style={styles.todayReadingCard}>
            <View style={styles.todayReadingContent}>
              <View style={styles.todayReadingIcon}>
                <Ionicons name="book-outline" size={24} color="#ffffff" />
              </View>
              <View style={styles.todayReadingText}>
                <Text style={styles.todayReadingLabel}>今日の読書時間</Text>
                <Text style={styles.todayReadingTime}>{formatReadingTime(userStats.todayReadingTime)}</Text>
              </View>
              <View style={styles.todayReadingStreak}>
                <Text style={styles.streakText}>🔥 7日連続</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 週間統計 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>週間の成果</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#1976D2' }]}>
                <Ionicons name="time" size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{Math.floor(userStats.totalReadingTime / 60)}</Text>
              <Text style={styles.statLabel}>時間読書</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#388E3C' }]}>
                <Ionicons name="speedometer" size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{userStats.averageWPM}</Text>
              <Text style={styles.statLabel}>平均WPM</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F57C00' }]}>
                <Ionicons name="library" size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>{userStats.totalBooksRead}</Text>
              <Text style={styles.statLabel}>読了冊数</Text>
            </View>
          </View>
        </View>

        {/* クイックアクション */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>読書を始める</Text>
          
          <TouchableOpacity style={styles.primaryAction} onPress={handleQuickStart}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryActionGradient}
            >
              <View style={styles.primaryActionContent}>
                <View style={styles.primaryActionIcon}>
                  <Ionicons name="play" size={24} color="#ffffff" />
                </View>
                <View style={styles.primaryActionText}>
                  <Text style={styles.primaryActionTitle}>クイックスタート</Text>
                  <Text style={styles.primaryActionSubtitle}>デモテキストで即座に開始</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleTextInput}>
              <LinearGradient
                colors={['#11998E', '#38EF7D']}
                style={styles.secondaryActionGradient}
              >
                <Ionicons name="create" size={24} color="#ffffff" />
                <Text style={styles.secondaryActionTitle}>テキスト入力</Text>
                <Text style={styles.secondaryActionSubtitle}>コピペで読書</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryAction} onPress={handleNovelSelection}>
              <LinearGradient
                colors={['#FC466B', '#3F5EFB']}
                style={styles.secondaryActionGradient}
              >
                <Ionicons name="book" size={24} color="#ffffff" />
                <Text style={styles.secondaryActionTitle}>小説を選ぶ</Text>
                <Text style={styles.secondaryActionSubtitle}>青空文庫から</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* 実績セクション */}
        <View style={styles.achievementsSection}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>実績</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>すべて見る</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {recentAchievements.map((achievement, index) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  { marginLeft: index === 0 ? 20 : 0 },
                  !achievement.isUnlocked && styles.achievementLocked
                ]}
              >
                <View style={[
                  styles.achievementIconContainer,
                  { backgroundColor: achievement.isUnlocked ? achievement.color : '#E5E5EA' }
                ]}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.isUnlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                {achievement.isUnlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 読書習慣 */}
        <View style={styles.habitSection}>
          <LinearGradient
            colors={['#FF9A9E', '#FECFEF']}
            style={styles.habitCard}
          >
            <View style={styles.habitContent}>
              <View style={styles.habitHeader}>
                <View>
                  <Text style={styles.habitTitle}>読書習慣を育てよう</Text>
                  <Text style={styles.habitSubtitle}>継続的な読書でスキルアップ</Text>
                </View>
                <View style={styles.habitIcon}>
                  <Ionicons name="trending-up" size={24} color="#8B5CF6" />
                </View>
              </View>
              <Text style={styles.habitDescription}>
                毎日少しずつでも読書を続けることで、読解力と集中力が向上します。あなたのペースで進めましょう。
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* 下部余白 */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  settingsButton: {
    marginTop: 4,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayReadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
  },
  todayReadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayReadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  todayReadingText: {
    flex: 1,
  },
  todayReadingLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  todayReadingTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 2,
  },
  todayReadingStreak: {
    alignItems: 'flex-end',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD60A',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryAction: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  primaryActionGradient: {
    borderRadius: 20,
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  primaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  secondaryActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  secondaryActionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
  secondaryActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#667EEA',
    fontWeight: '600',
  },
  achievementsScroll: {
    paddingVertical: 8,
  },
  achievementCard: {
    width: 120,
    marginRight: 12,
    marginLeft: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementTitleLocked: {
    color: '#94A3B8',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#30D158',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  habitCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  habitContent: {
    padding: 24,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  habitSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});