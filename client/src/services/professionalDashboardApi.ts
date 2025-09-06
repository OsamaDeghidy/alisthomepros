import { apiClient } from './api';

export interface ProfessionalDashboardStats {
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

export interface ActiveJob {
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

export interface NewJob {
  id: number;
  title: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  budget_min: number;
  budget_max: number;
  location: string;
  category: string;
  posted_time: string;
  proposals_count: number;
  time_left: string;
  verified: boolean;
  urgent: boolean;
  description: string;
  created_at: string;
}

export interface RecentMessage {
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

export interface RecentEarning {
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

export interface DashboardAnalytics {
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
}

export interface ProfessionalDashboardData {
  stats: ProfessionalDashboardStats;
  active_jobs: ActiveJob[];
  new_jobs: NewJob[];
  recent_messages: RecentMessage[];
  recent_earnings: RecentEarning[];
  analytics: DashboardAnalytics;
}

export const professionalDashboardApi = {
  // Get professional dashboard data
  getProfessionalDashboard: async (): Promise<ProfessionalDashboardData> => {
    const response = await apiClient.get('/dashboard/professional/');
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<ProfessionalDashboardStats> => {
    const response = await apiClient.get('/dashboard/stats/');
    return response.data;
  },

  // Get active jobs
  getActiveJobs: async (): Promise<ActiveJob[]> => {
    const response = await apiClient.get('/dashboard/active-jobs/');
    return response.data;
  },

  // Get new job opportunities
  getNewJobs: async (): Promise<NewJob[]> => {
    const response = await apiClient.get('/projects/?status=open&limit=5');
    return response.data.results || response.data;
  },

  // Get recent messages
  getRecentMessages: async (): Promise<RecentMessage[]> => {
    const response = await apiClient.get('/dashboard/recent-messages/');
    return response.data;
  },

  // Get recent earnings
  getRecentEarnings: async (): Promise<RecentEarning[]> => {
    const response = await apiClient.get('/dashboard/recent-earnings/');
    return response.data;
  },

  // Get analytics data
  getAnalytics: async (timeframe: string = 'month'): Promise<DashboardAnalytics> => {
    const response = await apiClient.get(`/dashboard/analytics/?timeframe=${timeframe}`);
    return response.data;
  },

  // Mark message as read
  markMessageAsRead: async (messageId: number): Promise<void> => {
    await apiClient.post(`/messaging/messages/${messageId}/read/`);
  },

  // Update job progress
  updateJobProgress: async (jobId: number, progress: number, status?: string, notes?: string): Promise<void> => {
    await apiClient.patch(`/contracts/${jobId}/`, {
      completion_percentage: progress,
      status,
      notes
    });
  },

  // Submit proposal to new job
  submitProposal: async (projectId: number, proposalData: any): Promise<any> => {
    const response = await apiClient.post(`/proposals/`, {
      project: projectId,
      ...proposalData
    });
    return response.data;
  }
};

export default professionalDashboardApi;