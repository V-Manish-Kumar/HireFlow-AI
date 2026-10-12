import api from './api';
import { ApiResponse, User, Role, AdminCreateUserRequest, AdminUpdateUserRequest } from '../types';

export const adminService = {
  getAllUsers: async (): Promise<User[]> => {
    const res = await api.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return res.data.data;
  },

  createUser: async (data: AdminCreateUserRequest): Promise<User> => {
    const res = await api.post<ApiResponse<User>>('/admin/users', data);
    return res.data.data;
  },

  updateUserRole: async (id: number, role: Role): Promise<User> => {
    const res = await api.put<ApiResponse<User>>(`/admin/users/${id}/role`, { role });
    return res.data.data;
  },

  updateUser: async (id: number, data: AdminUpdateUserRequest): Promise<User> => {
    const res = await api.put<ApiResponse<User>>(`/admin/users/${id}`, data);
    return res.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/admin/users/${id}`);
  },
};
