import api from './api';
import { ApiResponse } from '../types';
import { ImportBatch, UploadPreviewResponse } from '../types/import';

export const importService = {
  uploadFile: async (file: File, contentType: string, targetLanguage: string): Promise<ApiResponse<UploadPreviewResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    formData.append('targetLanguage', targetLanguage);

    const response = await api.post<ApiResponse<UploadPreviewResponse>>('/admin/import/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  confirmBatch: async (batchId: string): Promise<ApiResponse<{ imported: number }>> => {
    const response = await api.post<ApiResponse<{ imported: number }>>(`/admin/import/${batchId}/confirm`);
    return response.data;
  },

  cancelBatch: async (batchId: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/admin/import/${batchId}/cancel`);
    return response.data;
  },

  getBatches: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<ImportBatch[]>> => {
    const response = await api.get<ApiResponse<ImportBatch[]>>('/admin/import/batches', { params });
    return response.data;
  },

  getBatch: async (batchId: string): Promise<ApiResponse<ImportBatch>> => {
    const response = await api.get<ApiResponse<ImportBatch>>(`/admin/import/${batchId}`);
    return response.data;
  },

  getBatchErrors: async (batchId: string): Promise<ApiResponse<unknown>> => {
    const response = await api.get<ApiResponse<unknown>>(`/admin/import/${batchId}/errors`);
    return response.data;
  }
};
