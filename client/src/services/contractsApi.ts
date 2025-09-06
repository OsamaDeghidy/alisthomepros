import { apiClient, handleApiError } from './api';

export interface Contract {
  id: number;
  contract_number: string;
  title: string;
  description: string;
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  professional: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  };
  project?: {
    id: number;
    title: string;
  };
  total_amount: number;
  paid_amount: number;
  contract_balance: number;
  professional_balance: number;
  payment_type: 'fixed' | 'hourly' | 'milestone';
  hourly_rate?: number;
  start_date: string;
  end_date: string;
  actual_end_date?: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  terms_and_conditions: string;
  warranty_period: string;
  payment_terms: string;
  client_signed: boolean;
  professional_signed: boolean;
  client_signed_date?: string;
  professional_signed_date?: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ContractMilestone {
  id: number;
  contract: number;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completion_date?: string;
  payment_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContractStats {
  total_contracts: number;
  active_contracts: number;
  completed_contracts: number;
  total_value: number;
  paid_amount: number;
  pending_amount: number;
  completion_rate: number;
}

export const contractsApi = {
  // Get all contracts
  getContracts: async (): Promise<Contract[]> => {
    try {
      const response = await apiClient.get('/contracts/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get single contract
  getContract: async (id: number): Promise<Contract> => {
    try {
      const response = await apiClient.get(`/contracts/${id}/`);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get client contracts
  getClientContracts: async (): Promise<Contract[]> => {
    try {
      const response = await apiClient.get('/contracts/client/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get professional contracts
  getProfessionalContracts: async (): Promise<Contract[]> => {
    try {
      const response = await apiClient.get('/contracts/professional/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get contract statistics
  getContractStats: async (): Promise<ContractStats> => {
    try {
      const response = await apiClient.get('/contracts/stats/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Create new contract
  createContract: async (contractData: Partial<Contract>): Promise<Contract> => {
    try {
      const response = await apiClient.post('/contracts/create/', contractData);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Update contract
  updateContract: async (id: number, contractData: Partial<Contract>): Promise<Contract> => {
    try {
      const response = await apiClient.patch(`/contracts/${id}/update/`, contractData);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Sign contract
  signContract: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post(`/contracts/${id}/sign/`);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get contract milestones
  getContractMilestones: async (contractId: number): Promise<ContractMilestone[]> => {
    try {
      const response = await apiClient.get(`/contracts/${contractId}/milestones/`);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Terminate contract
  terminateContract: async (id: number, reason?: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post(`/contracts/${id}/terminate/`, { reason });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Payment actions
  requestMilestonePayment: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/request-payment/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  approveMilestonePayment: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/approve-payment/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  processMilestonePayment: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/process-payment/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  rejectMilestonePayment: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/reject-payment/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  acceptMilestonePayment: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/accept-payment/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  cancelMilestone: async (contractId: number, milestoneId: number, notes?: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/contracts/${contractId}/milestones/${milestoneId}/cancel/`, {
        notes: notes || ''
      });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Payment report export
  exportPaymentReport: async (filters: {
    start_date?: string;
    end_date?: string;
    status?: string;
    format?: 'pdf' | 'excel' | 'csv';
    include_details?: boolean;
  }): Promise<any> => {
    try {
      const response = await apiClient.post('/contracts/payment-reports/export/', filters);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  }
};