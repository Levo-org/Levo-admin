import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  });

  it('setAuthenticated sets user and tokens and updates state', () => {
    const user = { _id: '1', email: 'test@levo.com', name: 'Test', role: 'admin' as const };
    const tokens = { accessToken: 'access', refreshToken: 'refresh' };

    useAuthStore.getState().setAuthenticated(user, tokens);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.tokens).toEqual(tokens);
    expect(state.isAuthenticated).toBe(true);
    
    // Check localStorage
    expect(JSON.parse(localStorage.getItem('admin_user')!)).toEqual(user);
    expect(JSON.parse(localStorage.getItem('admin_tokens')!)).toEqual(tokens);
  });

  it('logout clears state and localStorage', () => {
    const user = { _id: '1', email: 'test@levo.com', name: 'Test', role: 'admin' as const };
    const tokens = { accessToken: 'access', refreshToken: 'refresh' };

    useAuthStore.getState().setAuthenticated(user, tokens);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.tokens).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    
    expect(localStorage.getItem('admin_user')).toBeNull();
    expect(localStorage.getItem('admin_tokens')).toBeNull();
  });
});
