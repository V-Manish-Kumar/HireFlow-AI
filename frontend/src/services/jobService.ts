import api from './api';
import { ApiResponse, Job, JobRequest, JobStatus, PagedResponse } from '../types';

export interface JobFilterParams {
  page?: number;
  size?: number;
  sortField?: string;
  sortDir?: string;
  status?: JobStatus;
  department?: string;
  keyword?: string;
}

export const jobService = {
  getJobs: async (params: JobFilterParams = {}): Promise<PagedResponse<Job>> => {
    const res = await api.get<ApiResponse<PagedResponse<Job>>>('/jobs', { params });
    return res.data.data;
  },

  getJobById: async (id: number): Promise<Job> => {
    const res = await api.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data.data;
  },

  createJob: async (data: JobRequest): Promise<Job> => {
    const res = await api.post<ApiResponse<Job>>('/jobs', data);
    return res.data.data;
  },

  updateJob: async (id: number, data: JobRequest): Promise<Job> => {
    const res = await api.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return res.data.data;
  },

  updateStatus: async (id: number, status: JobStatus): Promise<Job> => {
    const res = await api.patch<ApiResponse<Job>>(`/jobs/${id}/status`, { status });
    return res.data.data;
  },

  deleteJob: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/jobs/${id}`);
  },

  getDepartments: async (): Promise<string[]> => {
    const res = await api.get<ApiResponse<string[]>>('/jobs/departments');
    return res.data.data;
  },
};
