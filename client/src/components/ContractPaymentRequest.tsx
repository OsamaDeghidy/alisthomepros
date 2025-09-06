'use client';

import { useState } from 'react';
import {
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface ContractPaymentRequestProps {
  contractId: number;
  contractBalance: number;
  onPaymentRequested: () => void;
  className?: string;
}

export default function ContractPaymentRequest({
  contractId,
  contractBalance,
  onPaymentRequested,
  className = ''
}: ContractPaymentRequestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > contractBalance) {
      setError('Amount cannot exceed contract balance');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/payments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(() => {
          if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
            return tokenCookie ? tokenCookie.split('=')[1] : null;
          }
          return null;
        })()}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description.trim() || 'Payment request'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request payment');
      }

      // Reset form
      setAmount('');
      setDescription('');
      setIsOpen(false);
      onPaymentRequested();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (amount: number) => {
    return amount * 0.15; // 15% commission
  };

  const calculateNetAmount = (amount: number) => {
    return amount - calculateCommission(amount);
  };

  if (!isOpen) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Request Payment</h3>
          <div className="bg-green-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">Available Contract Balance</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(contractBalance)}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            disabled={contractBalance <= 0}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Request Payment</span>
          </button>
          
          {contractBalance <= 0 && (
            <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>No funds available in contract balance</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Request Payment</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setError(null);
            setAmount('');
            setDescription('');
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              max={contractBalance}
              step="0.01"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Maximum: {formatCurrency(contractBalance)}
          </p>
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gross Amount:</span>
              <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Commission (15%):</span>
              <span className="font-medium text-red-600">-{formatCurrency(calculateCommission(parseFloat(amount)))}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span className="text-gray-900">Net Amount (You receive):</span>
              <span className="text-green-600">{formatCurrency(calculateNetAmount(parseFloat(amount)))}</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this payment is for..."
            rows={3}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
          <Clock className="h-4 w-4" />
          <span>Payment will be available in your wallet 3 days after client approval</span>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setError(null);
              setAmount('');
              setDescription('');
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Request Payment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}