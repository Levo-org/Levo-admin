import api from './api';
import { AuthTokens, AdminUser } from '../types';

export interface LoginResponse {
  tokens: AuthTokens;
  user: AdminUser;
}

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/admin/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch (e) {
      console.warn('Logout API failed, proceeding to clear local state', e);
    }
  },
  
  refresh: async (refreshToken: string) => {
    const response = await api.post('/admin/auth/refresh', { refreshToken });
    return response.data;
  }
};
