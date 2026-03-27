import { UserRole } from './index';

export type MemberProvider = 'google' | 'apple' | 'email';
export type MemberLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type MemberLanguage = 'en' | 'ja' | 'zh';

export interface MemberSettings {
  dailyGoalMinutes: number;
  notificationEnabled: boolean;
  notificationHour: number;
  soundEnabled: boolean;
  effectsEnabled: boolean;
}

export interface MemberLanguageProfile {
  _id: string;
  userId: string;
  targetLanguage: MemberLanguage;
  level: MemberLevel;
  userLevel: number;
  xp: number;
  hearts: number;
  updatedAt: string;
}

export interface MemberItem {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  provider: MemberProvider;
  providerId: string;
  activeLanguage: MemberLanguage;
  onboardingCompleted: boolean;
  isPremium: boolean;
  coins: number;
  settings: MemberSettings;
  level: MemberLevel | null;
  languageProfile: MemberLanguageProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberListParams {
  page?: number;
  limit?: number;
  search?: string;
  provider?: MemberProvider | '';
  role?: UserRole | '';
  targetLanguage?: MemberLanguage | '';
  level?: MemberLevel | '';
  onboardingCompleted?: 'true' | 'false' | '';
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'email' | 'coins';
  sortOrder?: 'asc' | 'desc';
}
