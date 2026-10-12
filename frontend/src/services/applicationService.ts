import api from './api';
import { ApiResponse, Application, ApplicationHistoryItem, ApplicationStage, PagedResponse } from '../types';

export interface ApplicationFilterParams {
  page?: number;
  size?: number;
  sortField?: string;
  sortDir?: string;
  jobId?: number;
  stage?: ApplicationStage;
  keyword?: string;
}

export const applicationService = {
  getApplications: async (params: ApplicationFilterParams = {}): Promise<PagedResponse<Application>> => {
    const res = await api.get<ApiResponse<PagedResponse<Application>>>('/applications', { params });
    return res.data.data;
  },

  getApplicationsForJob: async (jobId: number): Promise<Application[]> => {
    const res = await api.get<ApiResponse<Application[]>>(`/applications/job/${jobId}`);
    return res.data.data;
  },

  getApplicationById: async (id: number): Promise<Application> => {
    const res = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    return res.data.data;
  },

  createApplication: async (candidateId: number, jobId: number, notes?: string): Promise<Application> => {
    const res = await api.post<ApiResponse<Application>>('/applications', {
      candidateId,
      jobId,
      notes,
    });
    return res.data.data;
  },

  updateStage: async (
    id: number,
    stage: ApplicationStage,
    comments?: string,
    interviewDate?: string
  ): Promise<Application> => {
    const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/stage`, {
      stage,
      comments,
      interviewDate,
    });
    return res.data.data;
  },

  getApplicationHistory: async (id: number): Promise<ApplicationHistoryItem[]> => {
    const res = await api.get<ApiResponse<ApplicationHistoryItem[]>>(`/applications/${id}/history`);
    return res.data.data;
  },
};
