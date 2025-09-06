'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Info,
  X
} from 'lucide-react';
import { milestonePaymentsApi } from '@/services/paymentsApi';

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: string;
  due_date: string;
}

interface MilestonePaymentRequestProps {
  milestone: Milestone;
  onRequestSent?: () => void;
}

export default function MilestonePaymentRequest({ 
  milestone, 
  onRequestSent 
}: MilestonePaymentRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    amount: milestone.amount,
    description: '',
    notes: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: milestone.amount,
        description: '',
        notes: ''
      });
      setError(null);
      setValidationErrors({});
      setShowConfirmation(false);
    }
  }, [isOpen, milestone.amount]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.description.trim()) {
      errors.description = 'Please provide a description for the payment request';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    if (formData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (formData.amount > milestone.amount) {
      errors.amount = 'Amount cannot exceed milestone amount';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowConfirmation(false);

      await milestonePaymentsApi.requestMilestonePayment(milestone.id, {
        amount: formData.amount,
        description: formData.description,
        notes: formData.notes
      });

      setSuccess(true);
      
      // Call the callback if provided
      if (onRequestSent) {
        onRequestSent();
      }

      // Close modal after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2500);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send payment request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setShowConfirmation(false);
    setSuccess(false);
    setError(null);
    setValidationErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const canRequestPayment = milestone.status === 'in_progress' || milestone.status === 'pending';

  if (!canRequestPayment) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
      >
        <DollarSign className="h-4 w-4" />
        <span>Request Payment</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Request Milestone Payment
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Request Sent!
                  </h3>
                  <p className="text-gray-600">
                    The client will be notified and can approve your payment request.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Milestone Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Milestone Amount:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(milestone.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max={milestone.amount}
                        value={formData.amount}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            amount: parseFloat(e.target.value) || 0
                          }));
                          // Clear validation error when user starts typing
                          if (validationErrors.amount) {
                            setValidationErrors(prev => ({ ...prev, amount: '' }));
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {validationErrors.amount ? (
                      <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{validationErrors.amount}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum: {formatCurrency(milestone.amount)}
                      </p>
                    )}

              {/* Confirmation Modal */}
              {showConfirmation && (
                <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
                  <div className="text-center p-6 max-w-sm">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                      <Info className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Confirm Payment Request
                    </h3>
                    <div className="text-sm text-gray-600 space-y-2 mb-6">
                      <p><strong>Amount:</strong> {formatCurrency(formData.amount)}</p>
                      <p><strong>Milestone:</strong> {milestone.title}</p>
                      <p className="text-xs bg-gray-50 p-2 rounded">
                        "{formData.description.substring(0, 100)}{formData.description.length > 100 ? '...' : ''}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                      >
                        Back to Edit
                      </button>
                      <button
                        onClick={handleConfirmSubmit}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Description *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={formData.description}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            description: e.target.value
                          }));
                          // Clear validation error when user starts typing
                          if (validationErrors.description) {
                            setValidationErrors(prev => ({ ...prev, description: '' }));
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder="Describe the work completed for this milestone..."
                        required
                      />
                    </div>
                    {validationErrors.description && (
                      <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{validationErrors.description}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notes: e.target.value
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={2}
                      placeholder="Any additional information for the client..."
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 text-sm">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.description.trim() || formData.amount <= 0}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Info className="h-4 w-4" />
                      <span>Review Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}