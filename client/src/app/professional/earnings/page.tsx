'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  DollarSign, 
  Download, 
  CreditCard, 
  Wallet, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  TrendingUp,
  TrendingDown,
  Building2,
  Edit,
  Trash2,
  X,
  Save,
  Star,
  Shield,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User
} from 'lucide-react';

// Interfaces
interface PaymentStats {
  total_amount: number;
  completed_amount: number;
  pending_amount: number;
  completed_count: number;
  pending_count: number;
  total_count: number;
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  contract?: { title: string };
  payer?: { first_name: string; last_name: string };
  payment_type?: string;
  payment_method?: { provider: string };
}

interface PaymentMethod {
  id: number;
  provider: string;
  last4: string;
  is_default: boolean;
}

interface BankAccount {
  id: number;
  full_legal_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_type: string;
  status: string;
  kyc_verified: boolean;
  kyc_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface Withdrawal {
  id: number;
  amount: number;
  processing_fee: number;
  net_amount: number;
  status: string;
  requested_at: string;
  estimated_arrival?: string;
  ach_trace_number?: string;
  failure_reason?: string;
  bank_account_info: {
    bank_name: string;
    masked_account_number: string;
    account_holder_name: string;
  };
  status_display: string;
  processing_timeline: {
    estimated_days: number;
    status_message: string;
  };
}

interface WalletTransaction {
  id: number;
  amount: number;
  description: string;
  created_at: string;
  transaction_type: string;
  source: string;
}

interface WalletStats {
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_balance: number;
  total_credits: number;
  total_debits: number;
  current_month_credits: number;
  current_month_debits: number;
  transaction_count: number;
}

interface PendingTransaction {
  id: number;
  amount: number;
  description: string;
  source: string;
  created_at: string;
  expected_release_date: string;
  days_remaining: number;
  is_ready_for_release: boolean;
}

interface PendingTransactionsResponse {
  pending_transactions: PendingTransaction[];
  total_pending_amount: number;
  count: number;
}

export default function EarningsPage() {
  // State variables
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransactionsResponse | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedBankAccount, setSelectedBankAccount] = useState('');
  
  // New state variables for bank account management
  const [pendingBalance, setPendingBalance] = useState(0);
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState(false);
  const [showBankAccountDetails, setShowBankAccountDetails] = useState<number | null>(null);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    provider: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: ''
  });
  const [newBankAccount, setNewBankAccount] = useState({
    full_legal_name: '',
    bank_name: '',
    account_number: '',
    routing_number: '',
    account_type: 'checking',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    date_of_birth: '',
    ssn_last4: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');

  // Authentication and data loading
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      setLoading(true);
      
      console.log('Fetching data with token:', token);
      
      // Fetch all data in parallel
      const [paymentsRes, statsRes, methodsRes, walletRes, transactionsRes, bankAccountsRes, withdrawalsRes, pendingTransactionsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/payments/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/stats/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/methods/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/wallet/stats/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/wallet/transactions/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/bank-accounts/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/withdrawals/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://127.0.0.1:8000/api/payments/wallet/pending-transactions/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.results || paymentsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (methodsRes.ok) {
        const methodsData = await methodsRes.json();
        setPaymentMethods(methodsData.results || methodsData);
      }

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        console.log('Wallet data received:', walletData);
        setWalletStats(walletData);
        setWalletBalance(walletData.available_balance || 0);
        setPendingBalance(walletData.pending_balance || 0);
      } else {
        console.error('Wallet request failed:', walletRes.status, walletRes.statusText);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setWalletTransactions(transactionsData.results || transactionsData);
      }

      if (bankAccountsRes.ok) {
        const bankAccountsData = await bankAccountsRes.json();
        setBankAccounts(bankAccountsData.results || bankAccountsData);
      }

      if (withdrawalsRes.ok) {
        const withdrawalsData = await withdrawalsRes.json();
        setWithdrawals(withdrawalsData.results || withdrawalsData);
      }

      if (pendingTransactionsRes.ok) {
        const pendingTransactionsData = await pendingTransactionsRes.json();
        setPendingTransactions(pendingTransactionsData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Deposit handler
  const handleDeposit = async () => {
    if (!depositAmount || !selectedPaymentMethod) return;
    
    const token = Cookies.get('access_token');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/wallet/topup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          payment_method_id: selectedPaymentMethod
        })
      });

      if (response.ok) {
        setShowDepositModal(false);
        setDepositAmount('');
        setSelectedPaymentMethod('');
        // Refresh data
        fetchData(token);
      }
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  // Enhanced withdrawal handler
  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedBankAccount) return;
    
    // Validate minimum withdrawal amount
    if (parseFloat(withdrawAmount) < 20) {
      setFormError('Minimum withdrawal amount is $20');
      return;
    }
    
    const token = Cookies.get('access_token');
    if (!token) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/withdrawals/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          bank_account: parseInt(selectedBankAccount),
          notes: withdrawalNotes
        })
      });

      if (response.ok) {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setSelectedBankAccount('');
        setWithdrawalNotes('');
        // Refresh data
        fetchData(token);
      } else {
        const errorData = await response.json();
        setFormError(errorData.detail || 'Failed to create withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setFormError('Network error occurred');
    }
  };

  // Bank account management functions
  const handleAddBankAccount = async () => {
    const token = Cookies.get('access_token');
    if (!token) return;

    // Validate required fields
    if (!newBankAccount.full_legal_name || !newBankAccount.bank_name || 
        !newBankAccount.account_number || !newBankAccount.routing_number ||
        !newBankAccount.address_line1 || !newBankAccount.city || 
        !newBankAccount.state || !newBankAccount.zip_code ||
        !newBankAccount.phone_number || 
        !newBankAccount.date_of_birth || !newBankAccount.ssn_last4) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/bank-accounts/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newBankAccount,
          postal_code: newBankAccount.zip_code, // Map zip_code to postal_code
          // Remove email field as it's not in the backend model
          email: undefined
        })
      });

      if (response.ok) {
        setShowAddBankAccountModal(false);
        setNewBankAccount({
          full_legal_name: '',
          bank_name: '',
          account_number: '',
          routing_number: '',
          account_type: 'checking',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          zip_code: '',
          phone_number: '',
          date_of_birth: '',
          ssn_last4: ''
        });
        fetchData(token);
      } else {
        const errorData = await response.json();
        setFormError(errorData.detail || 'Failed to add bank account');
      }
    } catch (error) {
      console.error('Network error:', error);
      setFormError('Network error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Payment method management functions
  const handleAddPaymentMethod = async () => {
    const token = Cookies.get('access_token');
    if (!token) return;

    // Validate required fields
    if (!newPaymentMethod.provider || !newPaymentMethod.card_number || 
        !newPaymentMethod.expiry_date || !newPaymentMethod.cvv || 
        !newPaymentMethod.cardholder_name) {
      setFormError('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payments/methods/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPaymentMethod)
      });

      if (response.ok) {
        setShowAddPaymentMethodModal(false);
        setNewPaymentMethod({
          type: 'card',
          provider: '',
          card_number: '',
          expiry_date: '',
          cvv: '',
          cardholder_name: ''
        });
        fetchData(token);
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || errorData.detail || 'Failed to add payment method');
      }
    } catch (error) {
      console.error('Network error:', error);
      setFormError('Network error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId: number) => {
    const token = Cookies.get('access_token');
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments/methods/${methodId}/set-default/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchData(token);
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (methodId: number) => {
    const token = Cookies.get('access_token');
    if (!token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments/methods/${methodId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchData(token);
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  // Analytics data
  const earningsStats = [
    {
      title: 'Current Balance',
      value: `$${walletBalance.toLocaleString()}`,
      icon: <Wallet className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-100',
      change: '+12.5%'
    },
    {
      title: 'Pending Balance',
      value: `$${pendingBalance.toLocaleString()}`,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
      change: '+8.2%'
    },
    {
      title: 'Total Earnings',
      value: `$${(walletStats?.total_earned || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-100',
      change: '+15.3%'
    },
    {
      title: 'Platform Transactions',
      value: `${walletStats?.transaction_count || 0}`,
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-100',
      change: '+5.7%'
    }
  ];

  const filteredPayments = payments.filter(payment => {
    if (selectedFilter === 'all') return true;
    return payment.status === selectedFilter;
  });

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'on_hold': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view your earnings dashboard.</p>
          <Link
            href="/auth/login"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Professional Earnings Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your payments, wallet, and bank accounts for secure withdrawals</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/client/payments/methods"
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Add Payment Method
            </Link>
            <button
              onClick={() => setShowAddBankAccountModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Add Bank Account
            </button>
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Funds
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={walletBalance <= 0 || (bankAccounts || []).filter(acc => acc.kyc_verified).length === 0}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(earningsStats || []).map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.change && (
                    <div className={`flex items-center mt-2 text-sm ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change.startsWith('+') ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bank Accounts</h2>
                <p className="text-gray-600 mt-1">Manage your verified bank accounts for secure withdrawals</p>
              </div>
              <button
                onClick={() => setShowAddBankAccountModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Bank Account
              </button>
            </div>
          </div>
          <div className="p-6">
            {bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts</h3>
                <p className="text-gray-600 mb-4">Add a bank account to enable withdrawals</p>
                <button
                  onClick={() => setShowAddBankAccountModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Bank Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(bankAccounts || []).map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{account.bank_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {account.kyc_verified ? (
                          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            <Shield className="w-3 h-3" />
                            Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            <Clock className="w-3 h-3" />
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{account.full_legal_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>****{account.account_number?.slice(-4) || '****'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{account.account_type}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setShowBankAccountDetails(account.id)}
                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </button>
                      {account.kyc_verified && (
                        <button
                          onClick={() => {
                            setSelectedBankAccount(account.id.toString());
                            setShowWithdrawModal(true);
                          }}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Withdrawal History</h2>
            <p className="text-gray-600 mt-1">Track your withdrawal requests and their status</p>
          </div>
          <div className="p-6">
            {withdrawals.length === 0 ? (
              <div className="text-center py-8">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Withdrawals</h3>
                <p className="text-gray-600">Your withdrawal history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(withdrawals || []).map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                          <Send className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            ${withdrawal.amount.toLocaleString()} Withdrawal
                          </h3>
                          <p className="text-sm text-gray-600">
                            Net: ${withdrawal.net_amount.toLocaleString()} (Fee: ${withdrawal.processing_fee.toLocaleString()})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          {withdrawal.status_display}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(withdrawal.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Bank Account</p>
                        <p className="font-medium">{withdrawal.bank_account_info.bank_name}</p>
                        <p className="text-gray-600">{withdrawal.bank_account_info.masked_account_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Processing Timeline</p>
                        <p className="font-medium">{withdrawal.processing_timeline.estimated_days} business days</p>
                        <p className="text-gray-600">{withdrawal.processing_timeline.status_message}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Details</p>
                        {withdrawal.ach_trace_number && (
                          <p className="font-medium">ACH: {withdrawal.ach_trace_number}</p>
                        )}
                        {withdrawal.estimated_arrival && (
                          <p className="text-gray-600">ETA: {new Date(withdrawal.estimated_arrival).toLocaleDateString()}</p>
                        )}
                        {withdrawal.failure_reason && (
                          <p className="text-red-600">{withdrawal.failure_reason}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <p className="text-gray-600 mt-1">Your latest wallet activity</p>
              </div>
              <div className="flex gap-2">
                {['all', 'completed', 'pending', 'failed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      selectedFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6">
            {walletTransactions.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
                <p className="text-gray-600">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(walletTransactions || []).slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.transaction_type === 'credit' ? (
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Transactions with Release Dates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pending Transactions</h2>
                <p className="text-gray-600 mt-1">Funds on hold with expected release dates</p>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                <Clock className="w-4 h-4" />
                <span>{pendingTransactions?.count || 0} pending</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {!pendingTransactions || pendingTransactions.pending_transactions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Transactions</h3>
                <p className="text-gray-600">All your funds are available for withdrawal</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTransactions.pending_transactions.map((transaction) => (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.is_ready_for_release ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {transaction.is_ready_for_release ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{transaction.source}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          +${transaction.amount.toLocaleString()}
                        </p>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          transaction.is_ready_for_release 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.is_ready_for_release ? 'Ready for Release' : `${transaction.days_remaining} days left`}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Created:</span>
                        <span className="ml-2">{new Date(transaction.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Expected Release:</span>
                        <span className="ml-2">{new Date(transaction.expected_release_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {transaction.is_ready_for_release && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>This transaction is ready to be released to your available balance.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Pending Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${pendingTransactions.total_pending_amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {pendingTransactions.count}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>• Funds are held for 3 days after milestone completion</p>
                    <p>• Released funds will be added to your available balance automatically</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Withdraw Funds</h3>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setFormError('');
                  setWithdrawAmount('');
                  setSelectedBankAccount('');
                  setWithdrawalNotes('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance: ${walletBalance.toLocaleString()}
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (minimum $20)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min={20}
                  max={walletBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {withdrawAmount && parseFloat(withdrawAmount) < 20 && (
                  <p className="text-red-600 text-sm mt-1">Minimum withdrawal amount is $20</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank Account
                </label>
                <select
                  value={selectedBankAccount}
                  onChange={(e) => setSelectedBankAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Choose a bank account</option>
                  {(bankAccounts || []).filter(acc => acc.kyc_verified).map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bank_name} - ****{account.account_number?.slice(-4) || '****'} ({account.full_legal_name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Add any notes for this withdrawal"
                  value={withdrawalNotes}
                  onChange={(e) => setWithdrawalNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Processing Information:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• ACH transfers typically take 1-3 business days</li>
                      <li>• A small processing fee may apply</li>
                      <li>• Withdrawals are processed during business hours</li>
                      <li>• You'll receive email updates on the status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setFormError('');
                  setWithdrawAmount('');
                  setSelectedBankAccount('');
                  setWithdrawalNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || !selectedBankAccount || parseFloat(withdrawAmount) > walletBalance || parseFloat(withdrawAmount) < 20}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBankAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
              <button
                onClick={() => {
                  setShowAddBankAccountModal(false);
                  setFormError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Bank Account Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="As it appears on your bank account"
                    value={newBankAccount.full_legal_name}
                    onChange={(e) => setNewBankAccount({...newBankAccount, full_legal_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Chase, Bank of America"
                    value={newBankAccount.bank_name}
                    onChange={(e) => setNewBankAccount({...newBankAccount, bank_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Your bank account number"
                    value={newBankAccount.account_number}
                    onChange={(e) => setNewBankAccount({...newBankAccount, account_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number *
                  </label>
                  <input
                    type="text"
                    placeholder="9-digit ACH routing number"
                    value={newBankAccount.routing_number}
                    onChange={(e) => setNewBankAccount({...newBankAccount, routing_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <select
                  value={newBankAccount.account_type}
                  onChange={(e) => setNewBankAccount({...newBankAccount, account_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
              
              {/* Address Information */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      placeholder="Street address"
                      value={newBankAccount.address_line1}
                      onChange={(e) => setNewBankAccount({...newBankAccount, address_line1: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={newBankAccount.address_line2}
                      onChange={(e) => setNewBankAccount({...newBankAccount, address_line2: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={newBankAccount.city}
                        onChange={(e) => setNewBankAccount({...newBankAccount, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={newBankAccount.state}
                        onChange={(e) => setNewBankAccount({...newBankAccount, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={newBankAccount.zip_code}
                        onChange={(e) => setNewBankAccount({...newBankAccount, zip_code: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact & Identity Information */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Contact & Identity Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={newBankAccount.phone_number}
                    onChange={(e) => setNewBankAccount({...newBankAccount, phone_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={newBankAccount.date_of_birth}
                      onChange={(e) => setNewBankAccount({...newBankAccount, date_of_birth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last 4 digits of SSN *
                    </label>
                    <input
                      type="text"
                      placeholder="1234"
                      maxLength={4}
                      value={newBankAccount.ssn_last4}
                      onChange={(e) => setNewBankAccount({...newBankAccount, ssn_last4: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">KYC Verification Required:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• All information must match your government-issued ID</li>
                      <li>• Bank account must be in your legal name</li>
                      <li>• Verification typically takes 1-2 business days</li>
                      <li>• You'll be notified via email once verified</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddBankAccountModal(false);
                  setFormError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBankAccount}
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? 'Adding...' : 'Add Bank Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Funds</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select payment method</option>
                  {(paymentMethods || []).map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.provider} ****{method.last4}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || !selectedPaymentMethod}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}