'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  CreditCard,
  Wallet,
  Eye,
  Trash2
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { walletApi } from '@/services/paymentsApi';
import { toast } from 'react-hot-toast';

interface ContractInstallment {
  id: number;
  amount: number;
  commission: number;
  net_amount: number;
  due_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface ContractInstallmentsProps {
  contractId: number;
  contractBalance: number;
  onInstallmentUpdate?: () => void;
}

const ContractInstallments: React.FC<ContractInstallmentsProps> = ({
  contractId,
  contractBalance,
  onInstallmentUpdate
}) => {
  const [installments, setInstallments] = useState<ContractInstallment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [creatingInstallment, setCreatingInstallment] = useState(false);
  const [confirmingInstallment, setConfirmingInstallment] = useState<number | null>(null);
  const [cancellingInstallment, setCancellingInstallment] = useState<number | null>(null);

  const [newInstallment, setNewInstallment] = useState({
    amount: '',
    due_date: ''
  });

  useEffect(() => {
    fetchInstallments();
    fetchWallet();
  }, [contractId]);

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      const response = await contractsService.getContractInstallments(contractId);
      setInstallments(response.results || []);
    } catch (error) {
      console.error('Error fetching installments:', error);
      toast.error('Failed to load installments');
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleCreateInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInstallment.amount || !newInstallment.due_date) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newInstallment.amount);
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (contractBalance < amount) {
      toast.error('Insufficient contract balance');
      return;
    }

    if (!wallet || wallet.pending_balance < amount) {
      toast.error('Insufficient pending balance in wallet');
      return;
    }

    try {
      setCreatingInstallment(true);
      await contractsService.createContractInstallment(contractId, {
        amount,
        due_date: newInstallment.due_date
      });
      
      toast.success('Installment created successfully');
      setShowCreateModal(false);
      setNewInstallment({ amount: '', due_date: '' });
      fetchInstallments();
      fetchWallet();
      onInstallmentUpdate?.();
    } catch (error: any) {
      console.error('Error creating installment:', error);
      toast.error(error.response?.data?.error || 'Failed to create installment');
    } finally {
      setCreatingInstallment(false);
    }
  };

  const handleConfirmInstallment = async (installmentId: number) => {
    try {
      setConfirmingInstallment(installmentId);
      await contractsService.confirmContractInstallment(contractId, installmentId);
      
      toast.success('Installment confirmed successfully');
      fetchInstallments();
      onInstallmentUpdate?.();
    } catch (error: any) {
      console.error('Error confirming installment:', error);
      toast.error(error.response?.data?.error || 'Failed to confirm installment');
    } finally {
      setConfirmingInstallment(null);
    }
  };

  const handleCancelInstallment = async (installmentId: number) => {
    if (!confirm('Are you sure you want to cancel this installment? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingInstallment(installmentId);
      await contractsService.cancelContractInstallment(contractId, installmentId);
      
      toast.success('Installment cancelled successfully');
      fetchInstallments();
      fetchWallet();
      onInstallmentUpdate?.();
    } catch (error: any) {
      console.error('Error cancelling installment:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel installment');
    } finally {
      setCancellingInstallment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark-900">Contract Installments</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage payment installments for this contract
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Installment</span>
        </button>
      </div>

      {/* Wallet Balance Info */}
      {wallet && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Wallet Balance</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Available: </span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(wallet.available_balance)}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Pending: </span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(wallet.pending_balance)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Installments List */}
      {installments.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Installments</h4>
          <p className="text-gray-600">No installments have been created for this contract yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {installments.map((installment) => (
            <div key={installment.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                      {getStatusIcon(installment.status)}
                      <span className="capitalize">{installment.status}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Created {formatDate(installment.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-lg font-semibold text-dark-900">
                        {formatCurrency(installment.amount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Net Amount</label>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(installment.net_amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Commission: {formatCurrency(installment.commission)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-dark-900">{formatDate(installment.due_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {installment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleConfirmInstallment(installment.id)}
                        disabled={confirmingInstallment === installment.id}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1"
                      >
                        {confirmingInstallment === installment.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        <span>Confirm</span>
                      </button>
                      <button
                        onClick={() => handleCancelInstallment(installment.id)}
                        disabled={cancellingInstallment === installment.id}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
                      >
                        {cancellingInstallment === installment.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Installment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-dark-900 mb-4">Create New Installment</h3>
            
            <form onSubmit={handleCreateInstallment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newInstallment.amount}
                    onChange={(e) => setNewInstallment(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                {wallet && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: {formatCurrency(wallet.available_balance)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newInstallment.due_date}
                  onChange={(e) => setNewInstallment(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewInstallment({ amount: '', due_date: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingInstallment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  {creatingInstallment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>Create Installment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractInstallments;