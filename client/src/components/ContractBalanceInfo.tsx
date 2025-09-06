'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface ContractBalanceData {
  contract_balance: number;
  client_pending_balance: number;
  professional_current_balance: number;
  professional_pending_balance: number;
  total_pending_payments: number;
  can_request_payment: boolean;
  can_approve_payment: boolean;
  contract_value: number;
  total_paid: number;
}

interface ContractBalanceInfoProps {
  contractId: number;
  userRole: 'professional' | 'client';
  refreshTrigger?: number;
  className?: string;
  onBalanceUpdate?: (data: ContractBalanceData) => void;
}

export default function ContractBalanceInfo({
  contractId,
  userRole,
  refreshTrigger = 0,
  className = '',
  onBalanceUpdate
}: ContractBalanceInfoProps) {
  const [balanceData, setBalanceData] = useState<ContractBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalanceInfo();
  }, [contractId, refreshTrigger]);

  const fetchBalanceInfo = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/balance/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance information');
      }

      const data = await response.json();
      setBalanceData(data);
      
      if (onBalanceUpdate) {
        onBalanceUpdate(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchBalanceInfo(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (!balanceData || balanceData.contract_value === 0) return 0;
    return Math.min((balanceData.total_paid / balanceData.contract_value) * 100, 100);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading balance information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Balance Information</h3>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!balanceData) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Balance Overview</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Contract Balance Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Contract Balance</h4>
                <p className="text-sm text-gray-600">Available for payments</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(balanceData.contract_balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Balances */}
        {userRole === 'professional' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h5 className="font-medium text-green-900">Available Balance</h5>
              </div>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(balanceData.professional_current_balance)}
              </p>
              <p className="text-sm text-green-700 mt-1">Ready to withdraw</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h5 className="font-medium text-yellow-900">Pending Balance</h5>
              </div>
              <p className="text-xl font-semibold text-yellow-600">
                {formatCurrency(balanceData.professional_pending_balance)}
              </p>
              <p className="text-sm text-yellow-700 mt-1">Processing (3-day hold)</p>
            </div>
          </div>
        )}

        {/* Client Balance */}
        {userRole === 'client' && (
          <div className="mb-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                <h5 className="font-medium text-purple-900">Your Pending Balance</h5>
              </div>
              <p className="text-xl font-semibold text-purple-600">
                {formatCurrency(balanceData.client_pending_balance)}
              </p>
              <p className="text-sm text-purple-700 mt-1">Available for contract funding</p>
            </div>
          </div>
        )}

        {/* Payment Statistics */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-3">Payment Progress</h5>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Contract Value</span>
              <span className="font-medium">{formatCurrency(balanceData.contract_value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-medium text-green-600">{formatCurrency(balanceData.total_paid)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-medium text-yellow-600">{formatCurrency(balanceData.total_pending_payments)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{getProgressPercentage().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Indicators */}
        <div className="space-y-2">
          {userRole === 'professional' && balanceData.can_request_payment && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">You can request payments from the contract balance</span>
            </div>
          )}
          
          {userRole === 'client' && balanceData.can_approve_payment && (
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">You have pending payment requests to review</span>
            </div>
          )}
          
          {balanceData.contract_balance === 0 && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {userRole === 'client' 
                  ? 'Contract balance is empty. Consider adding funds to enable payments.'
                  : 'Contract balance is empty. Ask the client to add funds.'
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}