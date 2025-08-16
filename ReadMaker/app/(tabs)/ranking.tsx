import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RankingService from '../../src/services/rankingService';
import {
  RankingUser,
  UserStats,
  RankingPeriod,
  RankingType,
} from '../../src/types/ranking';

const { width } = Dimensions.get('window');

export default function RankingScreen() {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>(RankingPeriod.ALL_TIME);
  const [selectedType, setSelectedType] = useState<RankingType>(RankingType.POINTS);

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rankingData, statsData] = await Promise.all([
        RankingService.getRanking(selectedType, selectedPeriod),
        RankingService.getCurrentUserStats(),
      ]);
      setRankings(rankingData);
      setUserStats(statsData);
    } catch (error: any) {
      Alert.alert('エラー', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderUserStatsCard = () => {
    if (!userStats) return null;

    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.userStatsCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.userStatsContent}>
          <Text style={styles.userStatsTitle}>あなたの成績</Text>
          <View style={styles.userStatsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.level}</Text>
              <Text style={styles.statLabel}>レベル</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.points.toLocaleString()}</Text>
              <Text style={styles.statLabel}>ポイント</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.rank || '---'}</Text>
              <Text style={styles.statLabel}>順位</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.reading_sessions}</Text>
              <Text style={styles.statLabel}>読書回数</Text>
            </View>
          </View>
          <Text style={styles.userTitle}>
            {RankingService.getLevelTitle(userStats.level)}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {Object.values(RankingPeriod).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                selectedPeriod === period && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPeriod === period && styles.filterButtonTextActive,
                ]}
              >
                {RankingService.getRankingPeriodLabel(period)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {Object.values(RankingType).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                selectedType === type && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === type && styles.filterButtonTextActive,
                ]}
              >
                {RankingService.getRankingTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderRankingItem = (user: RankingUser, index: number) => {
    const isTopThree = user.rank <= 3;
    const isCurrentUser = userStats && user.id === userStats.user_id;

    return (
      <View
        key={user.id}
        style={[
          styles.rankingItem,
          isTopThree && styles.topThreeItem,
          isCurrentUser && styles.currentUserItem,
        ]}
      >
        <View style={styles.rankInfo}>
          <Text style={styles.rankIcon}>
            {RankingService.getRankIcon(user.rank)}
          </Text>
          <Text style={[styles.rankNumber, isTopThree && styles.topThreeRank]}>
            {user.rank}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.username, isCurrentUser && styles.currentUserText]}>
            {user.username}
          </Text>
          <Text style={styles.levelText}>
            Lv.{user.level} - {RankingService.getLevelTitle(user.level)}
          </Text>
        </View>

        <View style={styles.scoreInfo}>
          <Text style={[styles.scoreValue, isCurrentUser && styles.currentUserText]}>
            {getScoreValue(user)}
          </Text>
          <Text style={styles.scoreLabel}>
            {RankingService.getRankingTypeLabel(selectedType)}
          </Text>
        </View>
      </View>
    );
  };

  const getScoreValue = (user: RankingUser): string => {
    switch (selectedType) {
      case RankingType.POINTS:
        return user.points.toLocaleString();
      case RankingType.WORDS_READ:
        return user.total_words_read.toLocaleString();
      case RankingType.READING_SESSIONS:
        return user.reading_sessions.toString();
      case RankingType.AVERAGE_WPM:
        return `${user.average_wpm} WPM`;
      default:
        return user.points.toLocaleString();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>ランキングを読み込み中...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#f8f9ff', '#e6eaff']}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <Ionicons name="trophy" size={32} color="#667eea" />
          <Text style={styles.headerTitle}>ランキング</Text>
          <Text style={styles.headerSubtitle}>
            読書で競い合おう！ 📚
          </Text>
        </View>

        {/* ユーザー統計カード */}
        {renderUserStatsCard()}

        {/* フィルタボタン */}
        {renderFilterButtons()}

        {/* ランキングリスト */}
        <View style={styles.rankingList}>
          <Text style={styles.rankingTitle}>
            {RankingService.getRankingPeriodLabel(selectedPeriod)}の
            {RankingService.getRankingTypeLabel(selectedType)}ランキング
          </Text>
          
          {rankings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#999" />
              <Text style={styles.emptyText}>
                まだランキングデータがありません
              </Text>
              <Text style={styles.emptySubtext}>
                読書を始めてランキングに参加しよう！
              </Text>
            </View>
          ) : (
            rankings.map((user, index) => renderRankingItem(user, index))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  userStatsCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userStatsContent: {
    alignItems: 'center',
  },
  userStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  userStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  userTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  rankingList: {
    margin: 16,
  },
  rankingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topThreeItem: {
    borderWidth: 2,
    borderColor: '#ffd700',
    backgroundColor: '#fffdf0',
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: '#f8f9ff',
  },
  rankInfo: {
    alignItems: 'center',
    marginRight: 16,
  },
  rankIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  topThreeRank: {
    color: '#ffa500',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currentUserText: {
    color: '#667eea',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
