import api from './api';
import { ApiResponse, ContentItem, AuditLog } from '../types';

export const workflowService = {
  transitionContent: async (contentType: string, id: string, targetStatus: string, notes?: string): Promise<ApiResponse<ContentItem>> => {
    const response = await api.post<ApiResponse<ContentItem>>(`/admin/workflow/${contentType}/${id}/transition`, { targetStatus, notes });
    return response.data;
  },

  getAuditLogs: async (params?: { page?: number; limit?: number; contentId?: string }): Promise<ApiResponse<AuditLog[]>> => {
    const response = await api.get<ApiResponse<AuditLog[]>>('/admin/workflow/audit-log', { params });
    return response.data;
  },

  getContentByStatus: async (contentType: string, status: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<ContentItem[]>> => {
    const response = await api.get<ApiResponse<ContentItem[]>>(`/admin/content/${contentType}`, { params: { ...params, status } });
    return response.data;
  }
};
