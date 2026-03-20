import { create } from 'zustand';
import { AdminUser, AuthTokens } from '../types';

interface AuthState {
  user: AdminUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: (user: AdminUser, tokens: AuthTokens) => void;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  setAuthenticated: (user, tokens) => {
    localStorage.setItem('admin_user', JSON.stringify(user));
    localStorage.setItem('admin_tokens', JSON.stringify(tokens));
    set({ user, tokens, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_tokens');
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  },
  restoreSession: () => {
    const userStr = localStorage.getItem('admin_user');
    const tokensStr = localStorage.getItem('admin_tokens');
    if (userStr && tokensStr) {
      try {
        const user = JSON.stringify(userStr);
        const tokens = JSON.parse(tokensStr);
        set({ user: JSON.parse(userStr), tokens, isAuthenticated: true, isLoading: false });
        return;
      } catch (err) {
        console.warn('Failed to restore auth session:', err);
      }
    }
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  }
}));
