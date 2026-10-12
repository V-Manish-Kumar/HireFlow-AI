import api from './api';
import { ApiResponse, Candidate, CandidateRequest, PagedResponse } from '../types';

export interface CandidateFilterParams {
  page?: number;
  size?: number;
  sortField?: string;
  sortDir?: string;
  minExperience?: number;
  keyword?: string;
}

export const candidateService = {
  getCandidates: async (params: CandidateFilterParams = {}): Promise<PagedResponse<Candidate>> => {
    const res = await api.get<ApiResponse<PagedResponse<Candidate>>>('/candidates', { params });
    return res.data.data;
  },

  getCandidateById: async (id: number): Promise<Candidate> => {
    const res = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`);
    return res.data.data;
  },

  createCandidate: async (data: CandidateRequest): Promise<Candidate> => {
    const res = await api.post<ApiResponse<Candidate>>('/candidates', data);
    return res.data.data;
  },

  updateCandidate: async (id: number, data: CandidateRequest): Promise<Candidate> => {
    const res = await api.put<ApiResponse<Candidate>>(`/candidates/${id}`, data);
    return res.data.data;
  },

  uploadResume: async (id: number, file: File): Promise<Candidate> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<Candidate>>(`/candidates/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  deleteCandidate: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/candidates/${id}`);
  },
};
