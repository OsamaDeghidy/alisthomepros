import { apiClient } from './api';

export interface DashboardStats {
  active_jobs: number;
  total_earned: number;
  proposals_sent: number;
  success_rate: number;
  completed_jobs: number;
  pending_payments: number;
  average_rating: number;
  total_clients: number;
  monthly_earnings: number;
  weekly_earnings: number;
  jobs_this_month: number;
  proposals_this_month: number;
}

export interface Project {
  id: number;
  title: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  progress: number;
  budget: number;
  deadline: string;
  location: string;
  category: string;
  priority: string;
  last_update: string;
  contract_type: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  from: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  message: string;
  time: string;
  unread: boolean;
  project: {
    id: number;
    title: string;
  };
  created_at: string;
}

export interface Payment {
  id: number;
  project: {
    id: number;
    title: string;
  };
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number;
  date: string;
  status: string;
  type: string;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  active_jobs: Project[];
  recent_messages: Message[];
  recent_earnings: Payment[];
  analytics: {
    earnings_chart: {
      labels: string[];
      data: number[];
    };
    jobs_chart: {
      labels: string[];
      data: number[];
    };
    proposals_chart: {
      labels: string[];
      data: number[];
    };
    ratings_chart: {
      labels: string[];
      data: number[];
    };
  };
}

export const dashboardApi = {
  // Get client dashboard data
  getClientDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/dashboard/client/');
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats/');
    return response.data;
  },

  // Get active jobs
  getActiveJobs: async (): Promise<Project[]> => {
    const response = await apiClient.get('/dashboard/active-jobs/');
    return response.data;
  },

  // Get recent messages
  getRecentMessages: async (): Promise<Message[]> => {
    const response = await apiClient.get('/dashboard/recent-messages/');
    return response.data;
  },

  // Get recent earnings/payments
  getRecentEarnings: async (): Promise<Payment[]> => {
    const response = await apiClient.get('/dashboard/recent-earnings/');
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (timeframe: string = 'month') => {
    const response = await apiClient.get(`/dashboard/analytics/?timeframe=${timeframe}`);
    return response.data;
  },

  // Mark message as read
  markMessageAsRead: async (messageId: number): Promise<void> => {
    await apiClient.post(`/dashboard/messages/${messageId}/read/`);
  },

  // Update job progress
  updateJobProgress: async (jobId: number, progress: number, status?: string, notes?: string): Promise<void> => {
    await apiClient.put(`/dashboard/jobs/${jobId}/progress/`, {
      progress,
      status,
      notes
    });
  }
};