'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, AlertCircle, CheckCircle, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { walletApi, type Wallet as WalletType } from '@/services/paymentsApi';
import { toast } from 'sonner';

interface AllocateFundsProps {
  contractId: number;
  contractStatus: string;
  contractBalance: number;
  clientAvailableBalance?: number;
  onFundsAllocated: () => void;
}

const AllocateFunds: React.FC<AllocateFundsProps> = ({
  contractId,
  contractStatus,
  contractBalance,
  clientAvailableBalance,
  onFundsAllocated
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setWalletLoading(true);
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
    } catch (error: any) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setWalletLoading(false);
    }
  };

  // Refresh wallet data
  const refreshWalletData = async () => {
    try {
      setRefreshing(true);
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
      toast.success('Wallet data refreshed');
    } catch (error: any) {
      console.error('Error refreshing wallet data:', error);
      toast.error('Failed to refresh wallet data');
    } finally {
      setRefreshing(false);
    }
  };

  // Load wallet data on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleAllocateFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const allocateAmount = parseFloat(amount);
    const availableBalance = wallet?.available_balance || clientAvailableBalance || 0;
    
    if (allocateAmount > availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }

    try {
      setLoading(true);
      const result = await contractsService.allocateFunds(contractId, allocateAmount);
      toast.success(`Successfully allocated $${allocateAmount.toLocaleString()} to project`);
      
      // Update local wallet state with the response data
      if (wallet && result.client_available_balance !== undefined) {
        setWallet({
          ...wallet,
          available_balance: result.client_available_balance,
          pending_balance: result.client_pending_balance
        });
      }
      
      setAmount('');
      setShowDialog(false);
      onFundsAllocated();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to allocate funds');
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

  const canAllocateFunds = contractStatus === 'pending' || contractStatus === 'active';
  const availableBalance = wallet?.available_balance || clientAvailableBalance || 0;
  const pendingBalance = wallet?.pending_balance || 0;
  const totalEarned = wallet?.total_earned || 0;

  if (walletLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading wallet data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 rtl:space-x-reverse">
            <Wallet className="h-5 w-5" />
            <span>Fund Allocation</span>
          </h3>
          <button
            onClick={refreshWalletData}
            disabled={refreshing}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Available Balance</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatCurrency(availableBalance)}
                </p>
                <p className="text-xs text-blue-500">Ready to allocate</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Balance</p>
                <p className="text-xl font-bold text-yellow-800">
                  {formatCurrency(pendingBalance)}
                </p>
                <p className="text-xs text-yellow-500">In escrow</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Contract Balance</p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(contractBalance)}
                </p>
                <p className="text-xs text-green-500">Allocated funds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Earned Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Earned (Lifetime)</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatCurrency(totalEarned)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Information */}
        {contractStatus === 'draft' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2 rtl:space-x-reverse">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <p className="text-yellow-700 text-sm">
              Contract must be signed before allocating funds
            </p>
          </div>
        )}

        {contractStatus === 'completed' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-green-700 text-sm">
              Contract completed and all funds transferred
            </p>
          </div>
        )}

        {contractStatus === 'cancelled' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 rtl:space-x-reverse">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <p className="text-red-700 text-sm">
              Contract cancelled, cannot allocate funds
            </p>
          </div>
        )}

        {/* Allocate Funds Button */}
        {canAllocateFunds && (
          <>
            <button 
              onClick={() => setShowDialog(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(clientAvailableBalance || 0) <= 0}
            >
              <Wallet className="h-4 w-4" />
              <span>Allocate Funds to Project</span>
            </button>
            {showDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Allocate Funds to Project</h3>
                  </div>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Available Balance: <span className="font-semibold">{formatCurrency(clientAvailableBalance || 0)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Contract Balance: <span className="font-semibold">{formatCurrency(contractBalance)}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount to Allocate</label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    max={clientAvailableBalance}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {amount && parseFloat(amount) > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      <p className="text-sm text-blue-700 font-medium">
                        <span className="font-bold">{formatCurrency(parseFloat(amount))}</span> will be allocated to project
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-blue-600">Available after transfer:</p>
                          <p className="font-semibold text-blue-800">
                            {formatCurrency(availableBalance - parseFloat(amount))}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-600">New project balance:</p>
                          <p className="font-semibold text-blue-800">
                            {formatCurrency(contractBalance + parseFloat(amount))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2 rtl:space-x-reverse">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-blue-700 text-sm">
                    The amount will be transferred from your available balance to pending balance, and will become available as project balance.
                {contractStatus === 'pending' && ' The contract will become active once funds are allocated.'}
                  </p>
                </div>

                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      setShowDialog(false);
                      setAmount('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAllocateFunds}
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Allocating...</span>
                      </>
                    ) : (
                      <span>Allocate Funds</span>
                    )}
                  </button>
                </div>
              </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Amount Buttons */}
        {canAllocateFunds && availableBalance > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Quick allocation amounts:</p>
            <div className="flex flex-wrap gap-2">
              {[100, 500, 1000, 2500, 5000, 10000].filter(amt => amt <= availableBalance).map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => {
                    setAmount(quickAmount.toString());
                    setShowDialog(true);
                  }}
                  className="px-4 py-2 text-sm border border-blue-200 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-medium"
                >
                  {formatCurrency(quickAmount)}
                </button>
              ))}
              {availableBalance > 0 && (
                <button
                  onClick={() => {
                    setAmount(availableBalance.toString());
                    setShowDialog(true);
                  }}
                  className="px-4 py-2 text-sm border border-green-200 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 font-medium"
                >
                  Full Balance ({formatCurrency(availableBalance)})
                </button>
              )}
            </div>
          </div>
        )}

        {/* No Balance Warning */}
        {canAllocateFunds && availableBalance <= 0 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-orange-700 font-medium">No Available Balance</p>
                <p className="text-orange-600 text-sm">You need to add funds to your wallet before allocating to projects.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllocateFunds;