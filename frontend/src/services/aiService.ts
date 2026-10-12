import api from './api';
import { ApiResponse, MatchResult } from '../types';

export const aiService = {
  matchApplication: async (applicationId: number): Promise<MatchResult> => {
    const res = await api.post<ApiResponse<MatchResult>>(`/applications/${applicationId}/match`);
    return res.data.data;
  },

  getMatchResults: async (applicationId: number): Promise<MatchResult> => {
    const res = await api.get<ApiResponse<MatchResult>>(`/applications/${applicationId}/match-results`);
    return res.data.data;
  },

  getMatchForPair: async (candidateId: number, jobId: number): Promise<MatchResult> => {
    const res = await api.get<ApiResponse<MatchResult>>(`/candidates/${candidateId}/jobs/${jobId}/match`);
    return res.data.data;
  },
};
