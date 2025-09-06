'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  DollarSign,
  FileText,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Upload
} from 'lucide-react';

interface BatchPaymentItem {
  id: string;
  contractId: string;
  contractTitle: string;
  amount: number;
  description: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

interface Contract {
  id: string;
  title: string;
  contract_number: string;
  available_balance: number;
  professional_name: string;
}

interface PaymentBatchViewerProps {
  userRole: 'professional' | 'client';
  onBatchSubmit?: (payments: BatchPaymentItem[]) => void;
  className?: string;
}

export default function PaymentBatchViewer({
  userRole,
  onBatchSubmit,
  className = ''
}: PaymentBatchViewerProps) {
  const [batchPayments, setBatchPayments] = useState<BatchPaymentItem[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for new payment
  const [newPayment, setNewPayment] = useState<Partial<BatchPaymentItem>>({
    contractId: '',
    amount: 0,
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
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
      const response = await fetch(`${API_BASE_URL}/contracts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }

      const data = await response.json();
      setContracts(data.results || data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentToBatch = () => {
    if (!newPayment.contractId || !newPayment.amount || !newPayment.description) {
      setError('Please fill in all required fields');
      return;
    }

    const contract = contracts.find(c => c.id === newPayment.contractId);
    if (!contract) {
      setError('Selected contract not found');
      return;
    }

    const payment: BatchPaymentItem = {
      id: Date.now().toString(),
      contractId: newPayment.contractId,
      contractTitle: contract.title,
      amount: newPayment.amount || 0,
      description: newPayment.description || '',
      dueDate: newPayment.dueDate,
      priority: newPayment.priority || 'medium'
    };

    setBatchPayments([...batchPayments, payment]);
    setNewPayment({
      contractId: '',
      amount: 0,
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setShowAddForm(false);
    setError(null);
  };

  const removePaymentFromBatch = (paymentId: string) => {
    setBatchPayments(batchPayments.filter(p => p.id !== paymentId));
  };

  const submitBatch = async () => {
    if (batchPayments.length === 0) {
      setError('No payments in batch');
      return;
    }

    try {
      setSubmitting(true);
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

      // Submit each payment individually
      const results = [];
      for (const payment of batchPayments) {
        const response = await fetch(`${API_BASE_URL}/contracts/${payment.contractId}/payments/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: payment.amount,
            description: payment.description
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to create payment for contract ${payment.contractTitle}`);
        }

        const result = await response.json();
        results.push(result);
      }

      // Clear batch after successful submission
      setBatchPayments([]);
      
      if (onBatchSubmit) {
        onBatchSubmit(batchPayments);
      }

      alert(`Successfully created ${results.length} payment requests!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalAmount = batchPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Batch Viewer</h2>
            <p className="text-gray-600 mt-1">
              Create and manage multiple payment requests at once
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Payment</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Add Payment Form */}
      {showAddForm && (
        <div className="p-6 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract *
              </label>
              <select
                value={newPayment.contractId || ''}
                onChange={(e) => setNewPayment({ ...newPayment, contractId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Contract</option>
                {contracts.map(contract => (
                  <option key={contract.id} value={contract.id}>
                    {contract.title} ({contract.contract_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newPayment.amount || ''}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newPayment.priority || 'medium'}
                onChange={(e) => setNewPayment({ ...newPayment, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={newPayment.description || ''}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Payment description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={newPayment.dueDate || ''}
                onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addPaymentToBatch}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Batch</span>
            </button>
          </div>
        </div>
      )}

      {/* Batch Payments List */}
      <div className="p-6">
        {batchPayments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments in Batch</h3>
            <p className="text-gray-600 mb-4">Add payments to create a batch request</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add First Payment</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {batchPayments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{payment.contractTitle}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(payment.priority)}`}>
                        {payment.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{payment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(payment.amount)}</span>
                      </div>
                      {payment.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removePaymentFromBatch(payment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Submit Batch */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">
                  {batchPayments.length} payment{batchPayments.length !== 1 ? 's' : ''} in batch
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  Total: {formatCurrency(totalAmount)}
                </p>
              </div>
              <button
                onClick={submitBatch}
                disabled={submitting || batchPayments.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>{submitting ? 'Submitting...' : 'Submit Batch'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}