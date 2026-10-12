import api from './api';
import { ApiResponse, AuditEvent, PagedResponse } from '../types';

export const auditService = {
  getAuditEvents: async (page = 0, size = 20): Promise<PagedResponse<AuditEvent>> => {
    const res = await api.get<ApiResponse<PagedResponse<AuditEvent>>>('/audit-events', {
      params: { page, size },
    });
    return res.data.data;
  },
};
