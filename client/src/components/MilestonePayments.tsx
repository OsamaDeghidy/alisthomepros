'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  FileText,
  Calendar,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { milestonePaymentsApi } from '@/services/paymentsApi';
import { useAuthStore } from '@/lib/store';

interface PendingPayment {
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
}

interface MilestonePaymentsProps {
  onPaymentProcessed?: () => void;
}

export default function MilestonePayments({ onPaymentProcessed }: MilestonePaymentsProps) {
  const { user } = useAuthStore();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState<{ [key: number]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const payments = await milestonePaymentsApi.getPendingMilestonePayments();
      setPendingPayments(payments);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentApproval = async (payment: PendingPayment, approved: boolean) => {
    try {
      setProcessingPayment(payment.id);
      setError(null);

      const result = await milestonePaymentsApi.approveMilestonePayment(
        payment.milestone.id,
        {
          payment_id: payment.id,
          approved,
          notes: approvalNotes[payment.id] || ''
        }
      );

      // Remove the processed payment from the list
      setPendingPayments(prev => prev.filter(p => p.id !== payment.id));
      
      // Clear the notes for this payment
      setApprovalNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[payment.id];
        return newNotes;
      });

      // Show success message
      setSuccessMessage(`Payment ${approved ? 'approved' : 'rejected'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Call the callback if provided
      if (onPaymentProcessed) {
        onPaymentProcessed();
      }

    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${approved ? 'approve' : 'reject'} payment`);
    } finally {
      setProcessingPayment(null);
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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading pending payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-red-800 font-medium">Error</span>
        </div>
        <p className="text-red-700 mt-1">{error}</p>
        <button
          onClick={fetchPendingPayments}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (pendingPayments.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Payments</h3>
        <p className="text-gray-600">You don't have any milestone payment requests to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Pending Milestone Payments</h2>
          <button
            onClick={fetchPendingPayments}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingPayments.length} pending
          </span>
          {pendingPayments.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Total: {formatCurrency(pendingPayments.reduce((sum, p) => sum + p.amount, 0))}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {pendingPayments.map((payment) => (
          <div key={payment.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {payment.milestone.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                        Payment Requested
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: #{payment.id}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>
                      {payment.milestone.contract.professional.first_name}{' '}
                      {payment.milestone.contract.professional.last_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{payment.milestone.contract.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(payment.created_at)}</span>
                  </div>
                </div>


              </div>

              <div className="text-right ml-6">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center space-x-1 text-2xl font-bold text-green-600">
                      <DollarSign className="h-6 w-6" />
                      <span>{formatCurrency(payment.amount)}</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Requested Amount</p>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="mb-4">
                <button
                  onClick={() => setExpandedPayment(expandedPayment === payment.id ? null : payment.id)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>{expandedPayment === payment.id ? 'Hide Details' : 'View Details'}</span>
                </button>
              </div>

              {expandedPayment === payment.id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3 animate-fade-in">
                  <p className="text-gray-700">{payment.milestone.description}</p>
                  
                  {payment.description && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Payment Description</span>
                      </div>
                      <p className="text-sm text-gray-700">{payment.description}</p>
                    </div>
                  )}

                  {payment.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Professional Notes</span>
                      </div>
                      <p className="text-sm text-blue-700">{payment.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notes input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Your Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes[payment.id] || ''}
                  onChange={(e) => setApprovalNotes(prev => ({
                    ...prev,
                    [payment.id]: e.target.value
                  }))}
                  placeholder="Add any notes about this payment approval/rejection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  rows={2}
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Requested on {formatDate(payment.created_at)}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePaymentApproval(payment, false)}
                    disabled={processingPayment === payment.id}
                    className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm"
                  >
                    {processingPayment === payment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span>Reject</span>
                  </button>
                  
                  <button
                    onClick={() => handlePaymentApproval(payment, true)}
                    disabled={processingPayment === payment.id}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  >
                    {processingPayment === payment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>Approve Payment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}