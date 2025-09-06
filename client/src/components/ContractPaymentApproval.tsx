'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2,
  Clock
} from 'lucide-react';

interface ContractPayment {
  id: number;
  payment_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  platform_commission_rate: number;
  platform_commission_amount: number;
  net_amount_to_professional: number;
  requested_by_name: string;
  approved_by_name?: string;
  created_at: string;
  approved_at?: string;
}

interface ContractPaymentApprovalProps {
  contractId: number;
  refreshTrigger?: number;
  className?: string;
  onPaymentAction?: () => void;
}

export default function ContractPaymentApproval({
  contractId,
  refreshTrigger = 0,
  className = '',
  onPaymentAction
}: ContractPaymentApprovalProps) {
  const [pendingPayments, setPendingPayments] = useState<ContractPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayments, setProcessingPayments] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPendingPayments();
  }, [contractId, refreshTrigger]);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      // Get token from cookies
      const getTokenFromCookies = () => {
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
          return tokenCookie ? tokenCookie.split('=')[1] : null;
        }
        return null;
      };
      
      const token = getTokenFromCookies();
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payments/?status=pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending payments');
      }

      const data = await response.json();
      const payments = data.results || data;
      setPendingPayments(payments.filter((p: ContractPayment) => p.status === 'pending'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (paymentId: number) => {
    try {
      setProcessingPayments(prev => new Set(prev).add(paymentId));
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const token = (() => {
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
          return tokenCookie ? tokenCookie.split('=')[1] : null;
        }
        return null;
      })();
      
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payments/${paymentId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve payment');
      }

      // Remove the approved payment from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      
      if (onPaymentAction) {
        onPaymentAction();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const handleCancelPayment = async (paymentId: number) => {
    try {
      setProcessingPayments(prev => new Set(prev).add(paymentId));
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const token = (() => {
        if (typeof document !== 'undefined') {
          const cookies = document.cookie.split(';');
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
          return tokenCookie ? tokenCookie.split('=')[1] : null;
        }
        return null;
      })();
      
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payments/${paymentId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel payment');
      }

      // Remove the cancelled payment from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      
      if (onPaymentAction) {
        onPaymentAction();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading pending payments...</span>
        </div>
      </div>
    );
  }

  if (pendingPayments.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h4>
          <p className="text-gray-600">
            All payment requests have been processed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Approvals Required</h3>
          <div className="bg-yellow-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {pendingPayments.length} payment{pendingPayments.length !== 1 ? 's' : ''} awaiting your approval
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {pendingPayments.map((payment) => {
            const isProcessing = processingPayments.has(payment.id);
            
            return (
              <div
                key={payment.id}
                className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {payment.description || 'Payment Request'}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <User className="h-4 w-4" />
                        <span>Requested by {payment.requested_by_name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(payment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-gray-900 mb-3">Payment Breakdown</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Commission ({(payment.platform_commission_rate * 100).toFixed(0)}%):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(payment.platform_commission_amount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Net to Professional:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(payment.net_amount_to_professional)}</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Payment Processing Notice:</p>
                      <p>Once approved, funds will be deducted from your pending balance and transferred to the professional's pending balance. The professional will be able to access these funds after a 3-day processing period.</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprovePayment(payment.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>{isProcessing ? 'Approving...' : 'Approve Payment'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleCancelPayment(payment.id)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span>{isProcessing ? 'Cancelling...' : 'Cancel Request'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}