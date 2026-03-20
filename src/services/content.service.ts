import api from './api';
import { ApiResponse } from '../types';

export interface ContentItem {
  _id: string;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  targetLanguage: string;
  level: number;
  topic?: string;
  updatedAt: string;
  
  // vocabulary
  word?: string;
  meaning?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  
  // grammar, listening, reading
  title?: string;
  description?: string;
  structure?: string;
  examples?: Array<{text: string; translation: string}>;
  
  // conversation
  dialogues?: Array<{speaker: string; text: string; translation: string}>;
  
  // exampleSentence
  text?: string;
  translation?: string;
  difficulty?: number;
  source?: string;
  license?: string;

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
  level?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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