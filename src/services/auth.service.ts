import api from './api';
import { ApiResponse, AuthTokens, AdminUser } from '../types';

export interface LoginResponse {
  tokens: AuthTokens;
  user: AdminUser;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/admin/auth/login', { email, password });
    return response.data.data;
  },
  
  logout: async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {
      console.warn('Logout API failed, proceeding to clear local state', e);
    }
  },
  
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await api.post<ApiResponse<RefreshResponse>>('/admin/auth/refresh', { refreshToken });
    return response.data.data;
  }
};
