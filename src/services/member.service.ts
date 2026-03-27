import api from './api';
import { ApiResponse } from '../types';
import { MemberItem, MemberListParams } from '../types/member';

export const memberService = {
  async getList(params: MemberListParams = {}): Promise<ApiResponse<MemberItem[]>> {
    const { data } = await api.get('/admin/members', { params });
    return data;
  },
};
