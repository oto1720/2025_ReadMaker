import ApiClient from './api';
import { 
  RankingUser, 
  RankingResponse, 
  UserStats, 
  UserStatsResponse, 
  RankingPeriod, 
  RankingType 
} from '../types/ranking';

class RankingService {
  private static instance: RankingService;

  private constructor() {}

  public static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService();
    }
    return RankingService.instance;
  }

  /**
   * ランキング一覧取得
   */
  async getRanking(
    type: RankingType = RankingType.POINTS,
    period: RankingPeriod = RankingPeriod.ALL_TIME,
    limit: number = 50
  ): Promise<RankingUser[]> {
    try {
      const params = new URLSearchParams({
        type,
        period,
        limit: limit.toString()
      });

      const response = await ApiClient.get<RankingResponse>(`/ranking?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error: any) {
      console.error('Get ranking error:', error);
      throw new Error(error.response?.data?.message || 'ランキングの取得に失敗しました');
    }
  }

  /**
   * 現在のユーザーの統計情報取得
   */
  async getCurrentUserStats(): Promise<UserStats | null> {
    try {
      const response = await ApiClient.get<UserStatsResponse>('/users/stats');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error: any) {
      console.error('Get user stats error:', error);
      throw new Error(error.response?.data?.message || 'ユーザー統計の取得に失敗しました');
    }
  }

  /**
   * 読書セッション記録（ポイント獲得）
   */
  async recordReadingSession(data: {
    words_read: number;
    reading_time_seconds: number;
    wpm: number;
    difficulty_level: number;
  }): Promise<boolean> {
    try {
      const response = await ApiClient.post<{ success: boolean }>('/reading/session', data);
      return response.success;
    } catch (error: any) {
      console.error('Record reading session error:', error);
      throw new Error(error.response?.data?.message || '読書セッションの記録に失敗しました');
    }
  }

  /**
   * ランキング期間別の説明文取得
   */
  getRankingPeriodLabel(period: RankingPeriod): string {
    switch (period) {
      case RankingPeriod.ALL_TIME:
        return '全期間';
      case RankingPeriod.MONTHLY:
        return '今月';
      case RankingPeriod.WEEKLY:
        return '今週';
      case RankingPeriod.DAILY:
        return '今日';
      default:
        return '全期間';
    }
  }

  /**
   * ランキング種別の説明文取得
   */
  getRankingTypeLabel(type: RankingType): string {
    switch (type) {
      case RankingType.POINTS:
        return 'ポイント';
      case RankingType.WORDS_READ:
        return '読了文字数';
      case RankingType.READING_SESSIONS:
        return '読書回数';
      case RankingType.AVERAGE_WPM:
        return '平均読書速度';
      default:
        return 'ポイント';
    }
  }

  /**
   * ランキング順位に応じたメダル絵文字取得
   */
  getRankIcon(rank: number): string {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank <= 10 ? '🏆' : '👤';
    }
  }

  /**
   * レベルに応じた称号取得
   */
  getLevelTitle(level: number): string {
    if (level >= 50) return '読書マスター';
    if (level >= 30) return '読書エキスパート';
    if (level >= 20) return '読書上級者';
    if (level >= 10) return '読書愛好者';
    if (level >= 5) return '読書習慣者';
    return '読書初心者';
  }
}

export default RankingService.getInstance();
