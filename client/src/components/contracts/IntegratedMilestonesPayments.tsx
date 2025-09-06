'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  Eye,
  CreditCard,
  Wallet
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { ContractMilestone } from '@/services/contractsApi';
import { toast } from 'sonner';

interface IntegratedMilestonesPaymentsProps {
  contractId: number;
  userRole: 'client' | 'professional';
  contractStatus: string;
  contractBalance?: number;
  onContractUpdate?: () => void;
}

interface ExtendedMilestone extends ContractMilestone {
  payment_status?: 'not_requested' | 'requested' | 'approved' | 'paid' | 'rejected';
  payment_requested_at?: string;
  payment_approved_at?: string;
  payment_notes?: string;
  platform_commission_rate?: number;
}

const IntegratedMilestonesPayments: React.FC<IntegratedMilestonesPaymentsProps> = ({
  contractId,
  userRole,
  contractStatus,
  contractBalance = 0,
  onContractUpdate
}) => {
  const [milestones, setMilestones] = useState<ExtendedMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<ExtendedMilestone | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [actionType, setActionType] = useState<'request' | 'approve' | 'process' | 'reject' | 'accept' | 'cancel' | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, [contractId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await contractsService.getContractMilestones(contractId);
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast.error('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayment = async (milestone: ExtendedMilestone, notes: string = '') => {
    try {
      setActionLoading(`request-${milestone.id}`);
      await contractsService.requestMilestonePayment(contractId, milestone.id, notes);
      toast.success('Payment request sent successfully');
      await fetchMilestones();
      setShowNotesDialog(false);
      setPaymentNotes('');
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send payment request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprovePayment = async (milestone: ExtendedMilestone, notes: string = '') => {
    try {
      setActionLoading(`approve-${milestone.id}`);
      await contractsService.approveMilestonePayment(contractId, milestone.id, notes);
      toast.success('Payment approved successfully');
      await fetchMilestones();
      setShowNotesDialog(false);
      setPaymentNotes('');
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to approve payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleProcessPayment = async (milestone: ExtendedMilestone) => {
    try {
      setActionLoading(`process-${milestone.id}`);
      await contractsService.processMilestonePayment(contractId, milestone.id);
      toast.success('Payment processed successfully. 15% platform commission deducted.');
      await fetchMilestones();
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to process payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptPayment = async (milestone: ExtendedMilestone) => {
    try {
      const remainingBalance = contractBalance - getPaidAmount();
      
      // Check if remaining balance is sufficient
      if (remainingBalance < milestone.amount) {
        toast.error(`Insufficient balance. Required: $${milestone.amount.toFixed(2)}, Available: $${remainingBalance.toFixed(2)}`);
        return;
      }

      setActionLoading(`accept-${milestone.id}`);
      
      // Call the process payment API which handles the actual payment transfer
      await contractsService.processMilestonePayment(contractId, milestone.id);
      
      toast.success(`Payment accepted! $${milestone.amount.toFixed(2)} transferred to Total Paid. Remaining balance: $${(remainingBalance - milestone.amount).toFixed(2)}`);
      await fetchMilestones();
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to accept payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectPayment = async (milestone: ExtendedMilestone, notes: string = '') => {
    try {
      setActionLoading(`reject-${milestone.id}`);
      await contractsService.rejectMilestonePayment(contractId, milestone.id, notes);
      toast.success('Payment rejected successfully');
      await fetchMilestones();
      setShowNotesDialog(false);
      setPaymentNotes('');
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptMilestonePayment = async (milestone: ExtendedMilestone, notes: string = '') => {
    try {
      // Since remaining balance is always 0, we check contract balance directly
      if (contractBalance < milestone.amount) {
        toast.error(`Insufficient balance. Required: $${milestone.amount.toFixed(2)}, Available: $${contractBalance.toFixed(2)}`);
        return;
      }

      setActionLoading(`accept-${milestone.id}`);
      await contractsService.acceptMilestonePayment(contractId, milestone.id, notes);
      toast.success('Payment accepted and milestone completed successfully');
      await fetchMilestones();
      setShowNotesDialog(false);
      setPaymentNotes('');
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to accept payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelMilestone = async (milestone: ExtendedMilestone, notes: string = '') => {
    try {
      setActionLoading(`cancel-${milestone.id}`);
      await contractsService.cancelMilestone(contractId, milestone.id, notes);
      toast.success('Milestone cancelled successfully');
      await fetchMilestones();
      setShowNotesDialog(false);
      setPaymentNotes('');
      onContractUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel milestone');
    } finally {
      setActionLoading(null);
    }
  };

  const openNotesDialog = (milestone: ExtendedMilestone, action: 'request' | 'approve' | 'process' | 'reject' | 'accept' | 'cancel') => {
    setSelectedMilestone(milestone);
    setActionType(action);
    setShowNotesDialog(true);
    setPaymentNotes('');
  };

  const handleDialogAction = () => {
    if (!selectedMilestone) return;
    
    if (actionType === 'request') {
      handleRequestPayment(selectedMilestone, paymentNotes);
    } else if (actionType === 'approve') {
      handleApprovePayment(selectedMilestone, paymentNotes);
    } else if (actionType === 'process') {
      handleProcessPayment(selectedMilestone);
    } else if (actionType === 'reject') {
      handleRejectPayment(selectedMilestone, paymentNotes);
    } else if (actionType === 'accept') {
      handleAcceptMilestonePayment(selectedMilestone, paymentNotes);
    } else if (actionType === 'cancel') {
      handleCancelMilestone(selectedMilestone, paymentNotes);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'not_requested': return 'Not Requested';
      case 'requested': return 'Requested';
      case 'approved': return 'Approved';
      case 'paid': return 'Paid';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const calculateProgress = () => {
    if (milestones.length === 0) return 0;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    return (completedMilestones / milestones.length) * 100;
  };

  const getTotalAmount = () => {
    return milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
  };

  const getPaidAmount = () => {
    return milestones
      .filter(m => m.payment_status === 'paid')
      .reduce((sum, milestone) => sum + milestone.amount, 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(getTotalAmount())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(getPaidAmount())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Wallet className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Remaining Balance</p>
              <p className="text-lg font-semibold">{formatCurrency(0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-semibold">{Math.round(calculateProgress())}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Project Progress</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 rtl:space-x-reverse">
            <Calendar className="h-5 w-5" />
            <span>Milestones & Payments</span>
          </h3>
        </div>
        <div className="p-6">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No milestones defined for this contract</p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                        <h3 className="font-semibold text-lg">{milestone.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(milestone.status)}`}>
                          {milestone.status === 'completed' ? 'Completed' :
                           milestone.status === 'in_progress' ? 'In Progress' :
                           milestone.status === 'pending' ? 'Pending' : 'Overdue'}
                        </span>
                        {milestone.payment_status && (
                          <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(milestone.payment_status)}`}>
                            {getPaymentStatusText(milestone.payment_status)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>Amount: {formatCurrency(milestone.amount)}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span>Due Date: {formatDate(milestone.due_date)}</span>
                        </div>
                        {milestone.payment_requested_at && (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Send className="h-4 w-4 text-yellow-600" />
                            <span>Requested on: {formatDate(milestone.payment_requested_at)}</span>
                          </div>
                        )}
                      </div>

                      {milestone.payment_notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Payment Notes:</strong> {milestone.payment_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-3"></div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {userRole === 'professional' && (
                      <>
                        {milestone.status === 'completed' && 
                         milestone.payment_status === 'not_requested' && (
                          <button
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                            onClick={() => openNotesDialog(milestone, 'request')}
                            disabled={actionLoading === `request-${milestone.id}`}
                          >
                            <Send className="h-4 w-4" />
                            <span>Request Payment</span>
                          </button>
                        )}
                      </>
                    )}

                    {userRole === 'client' && (
                      <>
                        {milestone.payment_status === 'requested' && (
                          <>
                            <button
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                              onClick={() => openNotesDialog(milestone, 'approve')}
                              disabled={actionLoading === `approve-${milestone.id}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve Payment</span>
                            </button>
                            <button
                              className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                              onClick={() => openNotesDialog(milestone, 'reject')}
                              disabled={actionLoading !== null}
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject Payment</span>
                            </button>
                          </>
                        )}
                        
                        {milestone.status === 'in_progress' && (
                          <>
                            <button
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                              onClick={() => openNotesDialog(milestone, 'accept')}
                              disabled={actionLoading === `accept-${milestone.id}` || (contractBalance - getPaidAmount()) < milestone.amount}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Accept</span>
                              {(contractBalance - getPaidAmount()) < milestone.amount && (
                                <span className="text-xs ml-1">(Insufficient Balance)</span>
                              )}
                            </button>
                            <button
                              className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                              onClick={() => openNotesDialog(milestone, 'cancel')}
                              disabled={actionLoading === `cancel-${milestone.id}`}
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        
                        {milestone.payment_status === 'approved' && (
                          <button
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
                            onClick={() => handleAcceptPayment(milestone)}
                            disabled={actionLoading === `accept-${milestone.id}` || (contractBalance - getPaidAmount()) < milestone.amount}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Accept Payment</span>
                            {(contractBalance - getPaidAmount()) < milestone.amount && (
                              <span className="text-xs ml-1">(Insufficient Balance)</span>
                            )}
                          </button>
                        )}
                      </>
                    )}

                    {milestone.payment_status === 'paid' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Paid</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes Dialog */}
      {showNotesDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                 {actionType === 'request' ? 'Request Milestone Payment' :
                  actionType === 'approve' ? 'Approve Payment' :
                  actionType === 'reject' ? 'Reject Payment' :
                  actionType === 'accept' ? 'Accept Milestone' :
                  actionType === 'cancel' ? 'Cancel Milestone' : 'Process Payment'}
                </h3>
            </div>
            <div className="p-6 space-y-4">
              {selectedMilestone && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">{selectedMilestone.title}</p>
                  <p className="text-sm text-gray-600">
                    Amount: {formatCurrency(selectedMilestone.amount)}
                  </p>
                </div>
              )}
              
              {(actionType === 'request' || actionType === 'approve' || actionType === 'reject' || actionType === 'accept' || actionType === 'cancel') && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes {(actionType === 'request' || actionType === 'accept' || actionType === 'cancel') ? '(Optional)' : ''}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Add additional notes..."
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setShowNotesDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  onClick={handleDialogAction}
                  disabled={actionLoading !== null}
                >
                  {actionType === 'request' ? 'Send Request' :
                    actionType === 'approve' ? 'Approve' :
                    actionType === 'reject' ? 'Reject' :
                    actionType === 'accept' ? 'Accept' :
                    actionType === 'cancel' ? 'Cancel' : 'Process'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedMilestonesPayments;