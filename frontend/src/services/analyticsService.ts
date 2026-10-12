import api from './api';
import { ApiResponse, ApplicationTrendItem, DashboardStats, PipelineFunnelItem } from '../types';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data.data;
  },

  getPipelineFunnel: async (): Promise<PipelineFunnelItem[]> => {
    const res = await api.get<ApiResponse<PipelineFunnelItem[]>>('/analytics/pipeline');
    return res.data.data;
  },

  getApplicationTrends: async (): Promise<ApplicationTrendItem[]> => {
    const res = await api.get<ApiResponse<ApplicationTrendItem[]>>('/analytics/applications-over-time');
    return res.data.data;
  },

  getApplicationsByJob: async (): Promise<any[]> => {
    const res = await api.get<ApiResponse<any[]>>('/analytics/jobs');
    return res.data.data;
  },
};
