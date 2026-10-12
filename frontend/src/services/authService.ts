import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    const data = res.data.data;
    localStorage.setItem('hireflow_token', data.token);
    localStorage.setItem('hireflow_user', JSON.stringify(data.user));
    return data;
  },

  register: async (email: string, password: string, fullName: string, company?: string): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      fullName,
      company,
    });
    const data = res.data.data;
    localStorage.setItem('hireflow_token', data.token);
    localStorage.setItem('hireflow_user', JSON.stringify(data.user));
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    const user = res.data.data;
    localStorage.setItem('hireflow_user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('hireflow_token');
    localStorage.removeItem('hireflow_user');
  },

  getStoredUser: (): User | null => {
    const u = localStorage.getItem('hireflow_user');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('hireflow_token');
  },
};
