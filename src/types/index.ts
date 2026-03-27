export type UserRole = 'learner' | 'editor' | 'reviewer' | 'admin';

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

export * from './import';
export * from './workflow';
export * from './member';
