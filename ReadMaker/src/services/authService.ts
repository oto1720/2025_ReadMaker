import ApiClient from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User, ApiResponse } from '../types/auth';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * ユーザー登録
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>('/auth/register', data);
      
      if (response.success && response.data?.token) {
        // トークンを安全に保存
        await ApiClient.saveToken(response.data.token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || '登録に失敗しました');
    }
  }

  /**
   * ユーザーログイン
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>('/auth/login', data);
      
      if (response.success && response.data?.token) {
        // トークンを安全に保存
        await ApiClient.saveToken(response.data.token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'ログインに失敗しました');
    }
  }

  /**
   * ログアウト
   */
  async logout(): Promise<void> {
    try {
      await ApiClient.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * 認証状態チェック
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await ApiClient.getToken();
      return token !== null;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * 現在のユーザー情報取得
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await ApiClient.get<ApiResponse<User>>('/auth/me');
      return response.success ? response.data || null : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * ヘルスチェック（API接続確認）
   */
  async healthCheck(): Promise<boolean> {
    try {
      await ApiClient.get('/health');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default AuthService.getInstance();