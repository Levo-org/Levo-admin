import api from './api';
import { ApiResponse } from '../types';

export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

export const DIFFICULTY_OPTIONS: Array<{ value: DifficultyLevel; label: string }> = [
  { value: 'beginner', label: '입문' },
  { value: 'elementary', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

export interface ContentItem {
  _id: string;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  targetLanguage: string;
  level?: DifficultyLevel;
  difficulty?: DifficultyLevel;
  chapter?: number;
  topic?: string;
  updatedAt: string;
  
  // vocabulary
  word?: string;
  meaning?: string;
  meanings?: string[];
  meaningExamples?: Array<{
    meaning: string;
    exampleSentence: string;
    exampleTranslation: string;
  }>;
  pronunciation?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
  
  // grammar, conversation, reading
  title?: string;
  icon?: string;
  subtitle?: string;
  englishTitle?: string;
  explanation?: string;
  formula?: string;
  formulaExample?: string;
  structure?: string;
  examples?: Array<{ text?: string; sentence?: string; translation: string }>;
  quizzes?: Array<{ question: string; options: string[]; correctAnswer?: number; explanation?: string }>;
  
  // conversation
  dialogs?: Array<{ speaker: string; text: string; translation: string; isUserRole?: boolean }>;
  keyExpressions?: Array<{ expression: string; meaning: string }>;
  
  // exampleSentence
  text?: string;
  originalText?: string;
  translation?: string;
  source?: string;
  license?: string;

  // listening
  audioText?: string;
  correctAnswer?: string;
  hint?: string;

  // reading
  content?: string;

  // shared
  sourceType?: string;
  createdBy?: { _id: string; name: string; email: string };
  lastEditedBy?: { _id: string; name: string; email: string };
  reviewedBy?: { _id: string; name: string; email: string };
  publishedBy?: { _id: string; name: string; email: string };
}

export interface ContentListParams {
  page?: number;
  limit?: number;
  status?: string;
  targetLanguage?: string;
  level?: DifficultyLevel;
  chapter?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function getContentDifficulty(item: Pick<ContentItem, 'level' | 'difficulty'>): DifficultyLevel | undefined {
  return item.difficulty ?? item.level;
}

export function formatDifficultyLabel(level?: DifficultyLevel): string {
  if (!level) {
    return '-';
  }

  return DIFFICULTY_OPTIONS.find((option) => option.value === level)?.label ?? level;
}

export const contentService = {
  async getList(contentType: string, params: ContentListParams = {}): Promise<ApiResponse<ContentItem[]>> {
    const { data } = await api.get(`/admin/content/${contentType}`, { params });
    return data;
  },

  async getDetail(contentType: string, id: string): Promise<ApiResponse<ContentItem>> {
    const { data } = await api.get(`/admin/content/${contentType}/${id}`);
    return data;
  },

  async create(contentType: string, payload: Partial<ContentItem>): Promise<ApiResponse<ContentItem>> {
    const { data } = await api.post(`/admin/content/${contentType}`, payload);
    return data;
  },

  async update(contentType: string, id: string, payload: Partial<ContentItem>): Promise<ApiResponse<ContentItem>> {
    const { data } = await api.put(`/admin/content/${contentType}/${id}`, payload);
    return data;
  },

  async delete(contentType: string, id: string): Promise<ApiResponse<null>> {
    const { data } = await api.delete(`/admin/content/${contentType}/${id}`);
    return data;
  }
};
