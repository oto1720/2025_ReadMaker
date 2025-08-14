export interface RankingUser {
  id: string;
  username: string;
  level: number;
  points: number;
  rank: number;
  reading_sessions: number;
  total_words_read: number;
  average_wpm: number;
  created_at: string;
}

export interface RankingResponse {
  success: boolean;
  data?: RankingUser[];
  message?: string;
  timestamp: string;
}

export interface UserStats {
  user_id: string;
  level: number;
  points: number;
  reading_sessions: number;
  total_words_read: number;
  average_wpm: number;
  rank: number | null;
}

export interface UserStatsResponse {
  success: boolean;
  data?: UserStats;
  message?: string;
  timestamp: string;
}

export enum RankingPeriod {
  ALL_TIME = 'all_time',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily'
}

export enum RankingType {
  POINTS = 'points',
  WORDS_READ = 'words_read',
  READING_SESSIONS = 'reading_sessions',
  AVERAGE_WPM = 'average_wpm'
}
