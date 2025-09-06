'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Loader2
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
  is_available_to_professional: boolean;
  created_at: string;
  approved_at?: string;
  transferred_at?: string;
  completed_at?: string;
}

interface ContractPaymentsListProps {
  contractId: number;
  userRole: 'professional' | 'client';
  refreshTrigger?: number;
  className?: string;
}

export default function ContractPaymentsList({
  contractId,
  userRole,
  refreshTrigger = 0,
  className = ''
}: ContractPaymentsListProps) {
  const [payments, setPayments] = useState<ContractPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [contractId, refreshTrigger]);

  const fetchPayments = async () => {
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
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data.results || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (payment: ContractPayment) => {
    switch (payment.status) {
      case 'pending':
        return 'Pending Client Approval';
      case 'approved':
        if (payment.is_available_to_professional) {
          return 'Available in Wallet';
        } else {
          return 'Processing (3-day hold)';
        }
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return payment.status;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <div className="bg-primary-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-primary-600" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h4>
            <p className="text-gray-600">
              {userRole === 'professional' 
                ? 'Request your first payment to get started'
                : 'No payment requests have been made yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {payment.description || 'Payment Request'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Requested by {payment.requested_by_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Requested: {formatDate(payment.created_at)}</span>
                    </div>
                    {payment.approved_at && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Approved: {formatDate(payment.approved_at)}</span>
                      </div>
                    )}
                    {payment.completed_at && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed: {formatDate(payment.completed_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission ({(payment.platform_commission_rate * 100).toFixed(0)}%):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(payment.platform_commission_amount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Net Amount:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(payment.net_amount_to_professional)}</span>
                    </div>
                  </div>
                </div>

                {payment.approved_by_name && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Approved by {payment.approved_by_name}</span>
                    </div>
                  </div>
                )}

                {payment.status === 'approved' && !payment.is_available_to_professional && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <Clock className="h-4 w-4" />
                      <span>Funds will be available in your wallet within 3 days of approval</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}