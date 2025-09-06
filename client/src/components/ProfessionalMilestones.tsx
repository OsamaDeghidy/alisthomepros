'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  AlertTriangle,
  Loader2,
  Target,
  Plus,
  X,
  Save,
  Edit3,
  Trash2,
  Info
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import MilestonePaymentRequest from './MilestonePaymentRequest';
import ErrorDisplay from './ErrorDisplay';
import { useApiError } from '../hooks/useApiError';

interface Milestone {
  id: number;
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

interface Contract {
  id: number;
  total_amount: number;
  paid_amount: number;
}

interface ProfessionalMilestonesProps {
  contractId: number;
}

export default function ProfessionalMilestones({ contractId }: ProfessionalMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const { error, handleApiError, clearError } = useApiError();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    amount: '',
    due_date: '',
    description: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    due_date: ''
  });

  useEffect(() => {
    fetchMilestones();
    fetchContract();
  }, [contractId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      clearError();
      const milestonesData = await contractsService.getContractMilestones(contractId);
      setMilestones(milestonesData.sort((a, b) => a.order - b.order));
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContract = async () => {
    try {
      const contractData = await contractsService.getContract(contractId);
      setContract(contractData);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
      } else if (amount > remainingAmount) {
        errors.amount = `Amount cannot exceed remaining budget: ${formatCurrency(remainingAmount)}`;
      }
    }

    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        errors.due_date = 'Due date cannot be in the past';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!contract) {
      handleApiError({ message: 'Contract information not loaded', type: 'validation' });
      return;
    }

    try {
      setIsSubmitting(true);
      clearError();
      const nextOrder = milestones.length > 0 ? Math.max(...milestones.map(m => m.order)) + 1 : 1;
      
      await contractsService.createMilestone(contractId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        order: nextOrder
      });

      // Reset form and refresh milestones
      setFormData({ title: '', description: '', amount: '', due_date: '' });
      setValidationErrors({});
      setShowAddForm(false);
      await fetchMilestones();
      setSuccessMessage('Milestone added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setFormData({ title: '', description: '', amount: '', due_date: '' });
    setValidationErrors({});
    setShowAddForm(false);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = async (milestoneId: number) => {
    try {
      clearError();
      await contractsService.deleteMilestone(milestoneId);
      await fetchMilestones();
      setSuccessMessage('Milestone deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const validateEditForm = (formData: typeof editForm) => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      errors.amount = 'Amount is required';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else {
      const currentMilestone = milestones.find(m => m.id === editingMilestone);
      const otherMilestonesTotal = milestones
        .filter(m => m.id !== editingMilestone)
        .reduce((sum, m) => sum + m.amount, 0);
      const remainingAmount = contract ? contract.total_amount - otherMilestonesTotal : 0;
      
      if (amount > remainingAmount) {
        errors.amount = `Amount cannot exceed remaining contract value (${formatCurrency(remainingAmount)})`;
      }
    }
    
    if (!formData.due_date) {
      errors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        errors.due_date = 'Due date cannot be in the past';
      }
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    return errors;
  };

  const handleEditSubmit = async (e: React.FormEvent, milestoneId: number) => {
    e.preventDefault();
    
    const errors = validateEditForm(editForm);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      clearError();
      
      await contractsService.updateMilestone(milestoneId, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        amount: parseFloat(editForm.amount),
        due_date: editForm.due_date
      });
      
      setSuccessMessage('Milestone updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditingMilestone(null);
      setValidationErrors({});
      await fetchMilestones();
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load milestone data when editing
  useEffect(() => {
    if (editingMilestone) {
      const milestone = milestones.find(m => m.id === editingMilestone);
      if (milestone) {
        setEditForm({
          title: milestone.title,
          amount: milestone.amount.toString(),
          due_date: milestone.due_date,
          description: milestone.description || ''
        });
      }
    }
  }, [editingMilestone, milestones]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
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
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Target className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading milestones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={fetchMilestones}
        onDismiss={clearError}
      />
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Milestones</h3>
        <p className="text-gray-600">No milestones have been defined for this contract yet.</p>
      </div>
    );
  }

  const milestonesTotalAmount = milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const remainingAmount = (contract?.total_amount || 0) - milestonesTotalAmount;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Total Milestones</p>
              <p className="text-xl font-bold text-blue-900">{milestones.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Completed</p>
              <p className="text-xl font-bold text-green-900">{completedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Total Value</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(contract?.total_amount || 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Paid Amount</p>
              <p className="text-xl font-bold text-emerald-900">{formatCurrency(contract?.paid_amount || 0)}</p>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-xl p-4 ${
          remainingAmount >= 0 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              remainingAmount >= 0 
                ? 'bg-orange-100' 
                : 'bg-red-100'
            }`}>
              <DollarSign className={`h-5 w-5 ${
                remainingAmount >= 0 
                  ? 'text-orange-600' 
                  : 'text-red-600'
              }`} />
            </div>
            <div>
              <p className={`text-sm ${
                remainingAmount >= 0 
                  ? 'text-orange-700' 
                  : 'text-red-700'
              }`}>Remaining</p>
              <p className={`text-xl font-bold ${
                remainingAmount >= 0 
                  ? 'text-orange-900' 
                  : 'text-red-900'
              }`}>{formatCurrency(remainingAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning for exceeded amount */}
      {remainingAmount < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Warning: Amount Exceeded</span>
          </div>
          <p className="text-red-700 mt-1">
            The total amount of defined milestones ({formatCurrency(milestonesTotalAmount)}) exceeds the contract total amount ({formatCurrency(contract?.total_amount || 0)}) by {formatCurrency(Math.abs(remainingAmount))}.
          Please adjust milestone amounts to match the contract value.
          </p>
        </div>
      )}

      {/* Add Milestone Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={remainingAmount <= 0}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
            remainingAmount <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
        {remainingAmount <= 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Cannot add new milestones. The contract amount has been fully utilized.
          </p>
        )}
      </div>

      {/* Add Milestone Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Add New Milestone</h4>
            <button
              onClick={handleCancelForm}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Available amount info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Available amount for new milestones:</strong> {formatCurrency(remainingAmount)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Contract Total: {formatCurrency(contract?.total_amount || 0)} |
            Defined Milestones: {formatCurrency(milestonesTotalAmount)}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter milestone title"
                  required
                />
                {validationErrors.title && (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{validationErrors.title}</span>
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    validationErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  max={remainingAmount}
                  step="0.01"
                  required
                />
                {validationErrors.amount ? (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{validationErrors.amount}</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {formatCurrency(remainingAmount)}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  validationErrors.due_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {validationErrors.due_date && (
                <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{validationErrors.due_date}</span>
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe what needs to be completed for this milestone"
                maxLength={500}
                required
              />
              {validationErrors.description ? (
                <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{validationErrors.description}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancelForm}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.amount || !formData.due_date}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Add Milestone</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                    #{index + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-gray-900">{milestone.title}</h4>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {getStatusIcon(milestone.status)}
                    <span className="capitalize">{milestone.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{milestone.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(milestone.due_date)}</span>
                    {isOverdue(milestone.due_date, milestone.status) && (
                      <span className="text-red-600 font-medium">(Overdue)</span>
                    )}
                  </div>
                  
                  {milestone.completion_date && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Completed: {formatDate(milestone.completion_date)}</span>
                    </div>
                  )}
                  
                  {milestone.payment_date && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Paid: {formatDate(milestone.payment_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right ml-6">
                <div className="flex items-center space-x-1 text-2xl font-bold text-green-600 mb-3">
                  <DollarSign className="h-6 w-6" />
                  <span>{formatCurrency(milestone.amount)}</span>
                </div>
                
                <div className="space-y-2">
                  {/* Payment Request Button */}
                  {(milestone.status === 'in_progress' || milestone.status === 'pending') && (
                    <MilestonePaymentRequest 
                      milestone={milestone}
                      onRequestSent={fetchMilestones}
                    />
                  )}
                  
                  {milestone.status === 'completed' && milestone.payment_date && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>Payment Received</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {milestone.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingMilestone(milestone.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Milestone"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(milestone.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{milestone.status === 'completed' ? '100%' : milestone.status === 'in_progress' ? '50%' : '0%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-600 w-full' 
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-600 w-1/2'
                      : 'bg-gray-400 w-0'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Milestone Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Edit3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Edit Milestone</h3>
                    <p className="text-sm text-gray-600">Update milestone details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingMilestone(null);
                    setValidationErrors({});
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={(e) => handleEditSubmit(e, editingMilestone)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, title: e.target.value }));
                      if (validationErrors.title) {
                        setValidationErrors(prev => ({ ...prev, title: '' }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter milestone title"
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{validationErrors.title}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.amount}
                      onChange={(e) => {
                        setEditForm(prev => ({ ...prev, amount: e.target.value }));
                        if (validationErrors.amount) {
                          setValidationErrors(prev => ({ ...prev, amount: '' }));
                        }
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        validationErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {validationErrors.amount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{validationErrors.amount}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, due_date: e.target.value }));
                      if (validationErrors.due_date) {
                        setValidationErrors(prev => ({ ...prev, due_date: '' }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      validationErrors.due_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.due_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{validationErrors.due_date}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => {
                      setEditForm(prev => ({ ...prev, description: e.target.value }));
                      if (validationErrors.description) {
                        setValidationErrors(prev => ({ ...prev, description: '' }));
                      }
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe what needs to be completed for this milestone..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {validationErrors.description && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{validationErrors.description}</span>
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {editForm.description.length}/500
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMilestone(null);
                      setValidationErrors({});
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Update Milestone</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Milestone</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this milestone? This will permanently remove it from the contract.
              </p>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMilestone(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}