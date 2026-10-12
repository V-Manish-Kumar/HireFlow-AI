import api from './api';
import { ApiResponse, NotificationItem, PagedResponse } from '../types';

export const notificationService = {
  getNotifications: async (page = 0, size = 20): Promise<PagedResponse<NotificationItem>> => {
    const res = await api.get<ApiResponse<PagedResponse<NotificationItem>>>('/notifications', {
      params: { page, size },
    });
    return res.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return res.data.data.unreadCount;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post<ApiResponse<void>>('/notifications/read-all');
  },
};
