import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const DEFAULT_API_BASE = 'https://levo-be.vercel.app/api/v1';

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_API_BASE;
  const normalized = base.replace(/\/+$/, '');

  if (normalized.endsWith('/api/v1')) {
    return normalized;
  }

  if (normalized.endsWith('/api')) {
    return `${normalized}/v1`;
  }

  return `${normalized}/api/v1`;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const tokens = useAuthStore.getState().tokens;
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${api.defaults.baseURL}/admin/auth/refresh`, {
          refreshToken: tokens.refreshToken,
        });
        
        const newTokens = response.data.data.tokens;
        const user = useAuthStore.getState().user;
        if (user) {
          useAuthStore.getState().setAuthenticated(user, newTokens);
        }
        
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
