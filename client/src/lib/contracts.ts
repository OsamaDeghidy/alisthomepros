import api from './api';
import {
  Contract,
  ContractMilestone,
  ContractStats
} from '../services/contractsApi';

// Additional interfaces not in contractsApi
export interface ContractDetail extends Contract {
  milestones?: ContractMilestone[];
  documents?: ContractDocument[];
  locations?: ContractLocation[];
}

export interface ContractDocument {
  id: number;
  contract: number;
  name: string;
  file: string;
  document_type: string;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface ContractLocation {
  id: number;
  contract: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContractData {
  title: string;
  description: string;
  client_id?: number;
  professional_id?: number;
  project_id?: number;
  total_amount: number;
  payment_type: 'fixed' | 'hourly' | 'milestone';
  hourly_rate?: number;
  start_date: string;
  end_date: string;
  terms_and_conditions: string;
  warranty_period: string;
  payment_terms: string;
}

export interface UpdateContractData extends Partial<CreateContractData> {
  status?: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
}

export interface CreateMilestoneData {
  title: string;
  description: string;
  amount: number;
  due_date: string;
  order: number;
}

export interface ContractFilters {
  status?: string;
  payment_type?: string;
  client_id?: number;
  professional_id?: number;
  project_id?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Contracts service
export const contractsService = {
  // Get all contracts (for current user)
  async getContracts(filters?: ContractFilters): Promise<{
    results: Contract[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await api.get('/contracts/', { params: filters });
    return response.data;
  },

  // Get contract details
  async getContract(contractId: number): Promise<ContractDetail> {
    const response = await api.get(`/contracts/${contractId}/`);
    return response.data;
  },

  // Create a new contract
  async createContract(data: CreateContractData): Promise<Contract> {
    const response = await api.post('/contracts/create/', data);
    return response.data;
  },

  // Update contract
  async updateContract(contractId: number, data: UpdateContractData): Promise<Contract> {
    const response = await api.put(`/contracts/${contractId}/update/`, data);
    return response.data;
  },

  // Sign contract
  async signContract(contractId: number): Promise<{ message: string }> {
    const response = await api.post(`/contracts/${contractId}/sign/`);
    return response.data;
  },

  // Terminate contract
  async terminateContract(contractId: number, reason?: string): Promise<{ message: string }> {
    const response = await api.post(`/contracts/${contractId}/terminate/`, { reason });
    return response.data;
  },

  // Get client contracts
  async getClientContracts(filters?: ContractFilters): Promise<{
    results: Contract[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await api.get('/contracts/client/', { params: filters });
    return response.data;
  },

  // Get professional contracts
  async getProfessionalContracts(filters?: ContractFilters): Promise<{
    results: Contract[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await api.get('/contracts/professional/', { params: filters });
    return response.data;
  },

  // Contract Milestones
  async getContractMilestones(contractId: number): Promise<ContractMilestone[]> {
    const response = await api.get(`/contracts/${contractId}/milestones/`);
    return response.data.results || response.data;
  },

  async createMilestone(contractId: number, data: CreateMilestoneData): Promise<ContractMilestone> {
    const response = await api.post(`/contracts/${contractId}/milestones/`, data);
    return response.data;
  },

  async updateMilestone(milestoneId: number, data: Partial<CreateMilestoneData>): Promise<ContractMilestone> {
    const response = await api.put(`/contracts/milestones/${milestoneId}/`, data);
    return response.data;
  },

  async deleteMilestone(milestoneId: number): Promise<{ message: string }> {
    const response = await api.delete(`/contracts/milestones/${milestoneId}/`);
    return response.data;
  },

  // Contract Documents
  async getContractDocuments(contractId: number): Promise<ContractDocument[]> {
    const response = await api.get(`/contracts/${contractId}/documents/`);
    return response.data.results || response.data;
  },

  async uploadDocument(contractId: number, file: File, documentType: string, name: string): Promise<ContractDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('name', name);
    
    const response = await api.post(`/contracts/${contractId}/documents/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteDocument(documentId: number): Promise<{ message: string }> {
    const response = await api.delete(`/contracts/documents/${documentId}/`);
    return response.data;
  },

  // Contract Locations
  async getContractLocations(contractId: number): Promise<ContractLocation[]> {
    const response = await api.get(`/contracts/${contractId}/locations/`);
    return response.data.results || response.data;
  },

  async createLocation(contractId: number, data: Omit<ContractLocation, 'id' | 'contract' | 'created_at' | 'updated_at'>): Promise<ContractLocation> {
    const response = await api.post(`/contracts/${contractId}/locations/`, data);
    return response.data;
  },

  async updateLocation(locationId: number, data: Partial<Omit<ContractLocation, 'id' | 'contract' | 'created_at' | 'updated_at'>>): Promise<ContractLocation> {
    const response = await api.put(`/contracts/locations/${locationId}/update/`, data);
    return response.data;
  },

  async deleteLocation(locationId: number): Promise<{ message: string }> {
    const response = await api.delete(`/contracts/locations/${locationId}/delete/`);
    return response.data;
  },

  async setPrimaryLocation(locationId: number): Promise<{ message: string }> {
    const response = await api.post(`/contracts/locations/${locationId}/set_primary/`);
    return response.data;
  },

  // Get contract stats
  async getContractStats(): Promise<ContractStats> {
    const response = await api.get('/contracts/stats/');
    return response.data;
  },

  // Allocate funds to contract
  async allocateFunds(contractId: number, amount: number): Promise<{
    message: string;
    contract_id: number;
    allocated_amount: number;
    contract_balance: number;
    contract_status: string;
    client_available_balance: number;
    client_pending_balance: number;
  }> {
    const response = await api.post(`/contracts/${contractId}/allocate-funds/`, { amount });
    return response.data;
  },

  // Complete contract
  async completeContract(contractId: number): Promise<{
    message: string;
    contract_id: number;
    transferred_amount: number;
    net_amount_to_professional: number;
    platform_commission: number;
    contract_status: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/complete/`);
    return response.data;
  },

  // Request milestone payment
  async requestMilestonePayment(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    payment_status: string;
    requested_at: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/request-payment/`, { notes });
    return response.data;
  },

  // Approve milestone payment
  async approveMilestonePayment(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    payment_status: string;
    approved_at: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/approve-payment/`, { notes });
    return response.data;
  },

  // Process milestone payment
  async processMilestonePayment(contractId: number, milestoneId: number): Promise<{
    message: string;
    milestone_id: number;
    payment_status: string;
    amount: number;
    net_amount_to_professional: number;
    platform_commission: number;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/process-payment/`);
    return response.data;
  },

  // Reject milestone payment
  async rejectMilestonePayment(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    payment_status: string;
    rejected_at: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/reject-payment/`, { notes });
    return response.data;
  },

  // Accept milestone payment
  async acceptMilestonePayment(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    status: string;
    payment_status: string;
    amount: number;
    net_amount_to_professional: number;
    platform_commission: number;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/accept-payment/`, { notes });
    return response.data;
  },

  // Cancel milestone
  async cancelMilestone(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    status: string;
    payment_status: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/milestones/${milestoneId}/cancel/`, { notes });
    return response.data;
  },

  // Confirm work receipt
  async confirmWorkReceipt(contractId: number, milestoneId: number, notes?: string): Promise<{
    message: string;
    milestone_id: number;
    status: string;
    payment_status: string;
  }> {
    const response = await api.post(`/contracts/confirm-work-receipt/`, {
      contract_id: contractId,
      milestone_id: milestoneId,
      notes
    });
    return response.data;
  },

  // Raise dispute
  async raiseDispute(data: {
    contract_id?: number;
    milestone_id?: number;
    dispute_type: 'quality' | 'payment' | 'scope' | 'timeline' | 'communication' | 'other';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    subject: string;
    description: string;
  }): Promise<{
    message: string;
    dispute_id: number;
    status: string;
  }> {
    const response = await api.post(`/contracts/raise-dispute/`, data);
    return response.data;
  },

  // Export payment report
  async exportPaymentReport(params: {
    start_date?: string;
    end_date?: string;
    status?: 'all' | 'pending' | 'approved' | 'processed' | 'rejected' | 'held' | 'completed';
    format?: 'json' | 'csv' | 'excel';
    include_details?: boolean;
    contract_id?: number;
    professional_id?: number;
    payment_type?: 'all' | 'milestone' | 'full_payment' | 'partial';
  }): Promise<{
    success: boolean;
    message: string;
    summary?: {
      total_amount: number;
      user_role: string;
      export_timestamp: string;
      status_breakdown: Record<string, number>;
    };
    data?: any[];
  }> {
    const response = await api.get('/contracts/export-payment-report/', { params });
    return response.data;
  },

  // Contract Installments
  async getContractInstallments(contractId: number): Promise<{
    results: any[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await api.get(`/contracts/${contractId}/installments/`);
    return response.data;
  },

  async createContractInstallment(contractId: number, data: {
    amount: number;
    due_date: string;
  }): Promise<any> {
    const response = await api.post(`/contracts/${contractId}/installments/`, data);
    return response.data;
  },

  async confirmContractInstallment(contractId: number, installmentId: number): Promise<{
    message: string;
    installment_id: number;
    status: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/installments/${installmentId}/confirm/`);
    return response.data;
  },

  async cancelContractInstallment(contractId: number, installmentId: number): Promise<{
    message: string;
    installment_id: number;
    status: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/installments/${installmentId}/cancel/`);
    return response.data;
  },

  async disputeContract(contractId: number): Promise<{
    message: string;
    contract_id: string;
    status: string;
  }> {
    const response = await api.post(`/contracts/${contractId}/dispute/`);
    return response.data;
  }
};