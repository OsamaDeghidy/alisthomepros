import { apiClient } from './api';

export interface Notification {
  id: number;
  type: 'system' | 'payment' | 'project_created' | 'project_update' | 'new_message' | 'payment_received' | 'contract_signed' | 'review_received' | string;
  title: string;
  message: string;
  is_read: boolean;
  data?: {
    project_id?: number;
    project_slug?: string;
    [key: string]: any;
  };
  created_at: string;
  read_at: string | null;
  user: number;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_by_type: Record<string, number>;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

// Notifications API service
export const notificationsApi = {
  // Get all notifications for the current user
  getNotifications: async (params?: {
    type?: string;
    is_read?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<NotificationListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const url = `/notifications/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  },

  // Get notification details
  getNotification: async (id: number): Promise<Notification> => {
    try {
      const response = await apiClient.get(`/notifications/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/update/`, {
        is_read: true
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string; updated_count: number }> => {
    try {
      const response = await apiClient.post('/notifications/mark-all-read/');
      return response.data;
    } catch (error: any) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  // Get notification statistics
  getStats: async (): Promise<NotificationStats> => {
    try {
      const response = await apiClient.get('/notifications/stats/');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch notification stats:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    try {
      const stats = await notificationsApi.getStats();
      return stats.unread_notifications;
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  },

  // Get recent notifications (last 10)
  getRecentNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await notificationsApi.getNotifications({ page_size: 10 });
      return response.results;
    } catch (error: any) {
      console.error('Failed to fetch recent notifications:', error);
      return [];
    }
  }
};

export default notificationsApi;