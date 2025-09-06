import api from './api';

// Proposal interfaces
export interface Proposal {
  id: string;
  project: number;
  professional: {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    display_name: string;
    email: string;
    user_type: string;
    avatar: string;
    is_verified: boolean;
    rating_average: number;
    rating_count: number;
    projects_completed: number;
    location: string;
  };
  cover_letter: string;
  amount: string;
  currency: string;
  timeline: string;
  estimated_hours?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_featured: boolean;
  response_time: string;
  milestones: ProposalMilestone[];
  attachments: ProposalAttachment[];
  views_count: number;
  can_be_accepted: boolean;
  contract_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalMilestone {
  id: number;
  title: string;
  description: string;
  amount: string;
  timeline: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProposalAttachment {
  id: number;
  file: string;
  name: string;
  file_type: string;
  file_size: number;
  file_size_display: string;
  description: string;
  created_at: string;
}

export interface CreateProposalData {
  project: number;
  cover_letter: string;
  amount: number;
  currency?: string;
  timeline: string;
  estimated_hours?: number;
  priority?: string;
  response_time?: string;
  milestones?: Omit<ProposalMilestone, 'id' | 'created_at' | 'updated_at'>[];
}

// Proposals service
export const proposalsService = {
  // Get all proposals
  async getProposals(): Promise<{ count: number; results: Proposal[] }> {
    const response = await api.get('/proposals/');
    return response.data;
  },

  // Get proposals for a specific project
  async getProjectProposals(projectId: number): Promise<{ count: number; results: Proposal[] }> {
    const response = await api.get(`/proposals/project/${projectId}/`);
    return response.data;
  },

  // Get proposal details
  async getProposal(proposalId: string): Promise<Proposal> {
    const response = await api.get(`/proposals/${proposalId}/`);
    return response.data;
  },

  // Create a new proposal
  async createProposal(data: CreateProposalData): Promise<Proposal> {
    const response = await api.post('/proposals/create/', data);
    return response.data;
  },

  // Accept a proposal
  async acceptProposal(proposalId: string): Promise<{ message: string; contract?: any }> {
    const response = await api.post(`/proposals/${proposalId}/accept/`);
    return response.data;
  },

  // Reject a proposal
  async rejectProposal(proposalId: string, reason?: string): Promise<{ message: string }> {
    const response = await api.post(`/proposals/${proposalId}/reject/`, { reason });
    return response.data;
  },

  // Create contract from proposal
  async createContractFromProposal(proposalId: string): Promise<any> {
    const response = await api.post(`/proposals/${proposalId}/create-contract/`);
    return response.data;
  },

  // Get proposals for authenticated professional
  async getProfessionalProposals(params?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<{ proposals: Proposal[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.search) searchParams.append('search', params.search);
    
    const response = await api.get(`/proposals/professional/?${searchParams.toString()}`);
    return response.data;
  }
};