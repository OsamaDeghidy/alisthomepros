import { apiClient, handleApiError } from './api';

// Types for Payment System
export interface PaymentMethod {
  id: number;
  type: 'card' | 'bank_account' | 'paypal';
  provider: string;
  last4: string;
  expiry_date?: string;
  cardholder_name?: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodCreate {
  type: 'card' | 'bank_account' | 'paypal' | 'stripe' | 'authorize_net' | 'wallet';
  provider?: string;
  cardholder_name?: string;
  is_default?: boolean;
  
  // Card details (write-only fields in serializer)
  stripe_token?: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  
  // Bank account details
  bank_name?: string;
  account_holder_name?: string;
  account_number?: string;
  routing_number?: string;
  iban?: string;
  swift_code?: string;
  
  // Billing address
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
}

export interface Payment {
  id: number;
  payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  payment_type: 'project_payment' | 'milestone_payment' | 'escrow_release' | 'subscription' | 'refund' | 'withdrawal' | 'platform_fee';
  payment_type_display: 'outgoing' | 'incoming' | 'unknown';
  related_user: {
    id: number;
    name: string;
    avatar?: string;
  };
  description?: string;
  created_at: string;
  processed_at?: string;
}

export interface PaymentCreate {
  amount: number;
  currency: string;
  payee: number;
  contract?: number;
  milestone?: string;
  payment_method: number;
  description?: string;
}

export interface PaymentProcess {
  payment_id: number;
  stripe_payment_intent_id?: string;
}

export interface PaymentStats {
  total_payments: number;
  total_amount_paid: number;
  total_amount_received: number;
  pending_payments: number;
  succeeded_payments: number;
  failed_payments: number;
  total_refunds: number;
  current_month_payments: number;
  current_month_earnings: number;
}

export interface PaymentSummary {
  contract_id: number;
  contract_title: string;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_count: number;
  last_payment_date: string;
  completion_percentage: number;
}

// Payment Methods API
export const paymentMethodsApi = {
  // Get all payment methods for current user
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await apiClient.get('/payments/methods/');
      // Handle paginated response
      if (response.data && response.data.results) {
        return response.data.results;
      }
      // Handle direct array response (fallback)
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Create new payment method
  createPaymentMethod: async (data: PaymentMethodCreate): Promise<PaymentMethod> => {
    try {
      const response = await apiClient.post('/payments/methods/create/', data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Update payment method
  updatePaymentMethod: async (id: number, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const response = await apiClient.put(`/payments/methods/${id}/update/`, data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Delete payment method
  deletePaymentMethod: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/payments/methods/${id}/delete/`);
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id: number): Promise<void> => {
    try {
      await apiClient.post(`/payments/methods/${id}/set-default/`);
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  }
};

// Payments API
export const paymentsApi = {
  // Get all payments for current user
  getPayments: async (params?: {
    status?: string;
    currency?: string;
    ordering?: string;
  }): Promise<Payment[]> => {
    try {
      const response = await apiClient.get('/payments/', { params });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get specific payment details
  getPayment: async (id: number): Promise<Payment> => {
    try {
      const response = await apiClient.get(`/payments/${id}/`);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Create new payment
  createPayment: async (data: PaymentCreate): Promise<Payment> => {
    try {
      const response = await apiClient.post('/payments/create/', data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Process payment
  processPayment: async (data: PaymentProcess): Promise<{ success: boolean; message: string; payment?: Payment }> => {
    try {
      const response = await apiClient.post('/payments/process/', data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get payment statistics
  getPaymentStats: async (): Promise<PaymentStats> => {
    try {
      const response = await apiClient.get('/payments/stats/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get payment summary
  getPaymentSummary: async (): Promise<PaymentSummary[]> => {
    try {
      const response = await apiClient.get('/payments/summary/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (params?: {
    period?: 'week' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }): Promise<any> => {
    try {
      const response = await apiClient.get('/payments/analytics/', { params });
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  }
};

// Combined export
// Wallet Types
export interface Wallet {
  id: number;
  user_info: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: number;
  wallet_info: {
    id: number;
    user: string;
  };
  amount: number;
  transaction_type: 'credit' | 'debit';
  source: string;
  description: string;
  payment_info?: {
    id: number;
    payment_id: string;
    amount: number;
  };
  created_at: string;
}

export interface WalletTopUp {
  amount: number;
  payment_method_id: number;
  description?: string;
}

export interface WalletStats {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_balance: number;
  total_credits: number;
  total_debits: number;
  current_month_credits: number;
  current_month_debits: number;
  transaction_count: number;
}

// Wallet API
export const walletApi = {
  // Get wallet details
  getWallet: async (): Promise<Wallet> => {
    try {
      const response = await apiClient.get('/payments/wallet/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get wallet transactions
  getWalletTransactions: async (params?: {
    transaction_type?: 'credit' | 'debit';
    source?: string;
    ordering?: string;
  }): Promise<WalletTransaction[]> => {
    try {
      const response = await apiClient.get('/payments/wallet/transactions/', { params });
      return response.data.results || response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Top up wallet
  topUpWallet: async (data: WalletTopUp): Promise<{
    success: boolean;
    message: string;
    wallet: Wallet;
    transaction_id: string;
  }> => {
    try {
      const response = await apiClient.post('/payments/wallet/topup/', data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get wallet statistics
  getWalletStats: async (): Promise<WalletStats> => {
    try {
      const response = await apiClient.get('/payments/wallet/stats/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  getPendingTransactionsWithReleaseDates: async (): Promise<{
    pending_transactions: {
      id: number;
      amount: number;
      description: string;
      source: string;
      created_at: string;
      expected_release_date: string;
      days_remaining: number;
      is_ready_for_release: boolean;
    }[];
    total_pending_amount: number;
    count: number;
  }> => {
    try {
      const response = await apiClient.get('/payments/wallet/pending-transactions/');
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  }
};

// Milestone Payments API
export const milestonePaymentsApi = {
  // Request milestone payment (by professional)
  requestMilestonePayment: async (milestoneId: number, data: {
    amount: number;
    description: string;
    notes?: string;
  }): Promise<{
    message: string;
    payment_id: number;
    payment_uuid: string;
    amount: number;
    status: string;
  }> => {
    try {
      const response = await apiClient.post(`/payments/milestones/${milestoneId}/request/`, data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Approve milestone payment (by client)
  approveMilestonePayment: async (milestoneId: number, data: {
    payment_id: number;
    approved: boolean;
    notes?: string;
  }): Promise<{
    message: string;
    payment_id: number;
    amount_transferred?: number;
    client_pending_balance?: number;
    professional_pending_balance?: number;
    status?: string;
  }> => {
    try {
      const response = await apiClient.post(`/payments/milestones/${milestoneId}/approve/`, data);
      return response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  },

  // Get pending milestone payment requests for client
  getPendingMilestonePayments: async (): Promise<{
    id: number;
    milestone: {
      id: number;
      title: string;
      description: string;
      contract: {
        id: number;
        title: string;
        professional: {
          id: number;
          first_name: string;
          last_name: string;
        };
      };
    };
    amount: number;
    description: string;
    notes?: string;
    status: string;
    created_at: string;
  }[]> => {
    try {
      const response = await apiClient.get('/payments/milestone-requests/');
      return response.data.results || response.data;
    } catch (error: any) {
      const errorInfo = error.errorInfo || handleApiError(error);
      throw { ...error, errorInfo };
    }
  }
};

export const paymentApi = {
  ...paymentMethodsApi,
  ...paymentsApi,
  ...walletApi,
  ...milestonePaymentsApi
};

export default paymentApi;