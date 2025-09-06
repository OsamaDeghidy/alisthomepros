'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Receipt, 
  Download, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  User,
  Search,
  Plus,
  TrendingUp,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw
} from 'lucide-react';
import { paymentsApi, paymentMethodsApi, walletApi, Payment, PaymentMethod, Wallet as WalletType, WalletTransaction } from '@/services/paymentsApi';

export default function PaymentsPage() {
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Wallet states
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load each API separately to handle individual failures
        let paymentsData: Payment[] = [];
        let methodsData: PaymentMethod[] = [];
        let walletData: WalletType | null = null;
        let walletTransactionsData: WalletTransaction[] = [];
        
        try {
          paymentsData = await paymentsApi.getPayments();
        } catch (err) {
          console.error('Error loading payments:', err);
        }
        
        try {
          methodsData = await paymentMethodsApi.getPaymentMethods();
          // Ensure methodsData is always an array
          if (!Array.isArray(methodsData)) {
            console.warn('Payment methods API returned non-array:', methodsData);
            methodsData = [];
          }
        } catch (err) {
          console.error('Error loading payment methods:', err);
          methodsData = [];
        }
        
        try {
          walletData = await walletApi.getWallet();
        } catch (err) {
          console.error('Error loading wallet:', err);
        }
        
        try {
          walletTransactionsData = await walletApi.getWalletTransactions();
          // Ensure walletTransactionsData is always an array
          if (!Array.isArray(walletTransactionsData)) {
            console.warn('Wallet transactions API returned non-array:', walletTransactionsData);
            walletTransactionsData = [];
          }
        } catch (err) {
          console.error('Error loading wallet transactions:', err);
          walletTransactionsData = [];
        }
        
        // Set all data
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setPaymentMethods(methodsData);
        setWallet(walletData);
        setWalletTransactions(walletTransactionsData);
        
      } catch (err: any) {
        console.error('Error loading payment data:', err);
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in to continue.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError('Failed to load data. Please try again.');
        }
        // Ensure arrays are set even on error
        setPaymentMethods([]);
        setPayments([]);
        setWalletTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle wallet top-up
  const handleTopUp = async () => {
    if (!topUpAmount || !selectedPaymentMethod) {
      alert('Please enter amount and select payment method');
      return;
    }

    try {
      await walletApi.topUpWallet({
        amount: parseFloat(topUpAmount),
        payment_method_id: parseInt(selectedPaymentMethod)
      });
      
      // Reload wallet data
      const [walletData, walletTransactionsData] = await Promise.all([
        walletApi.getWallet(),
        walletApi.getWalletTransactions()
      ]);
      
      setWallet(walletData);
      setWalletTransactions(walletTransactionsData);
      
      // Reset form
      setTopUpAmount('');
      setSelectedPaymentMethod('');
      setShowTopUpModal(false);
      
      alert('Wallet topped up successfully!');
    } catch (error) {
      console.error('Error topping up wallet:', error);
      alert('Failed to top up wallet. Please try again.');
    }
  };

  // Filter payments based on selected tab and search
  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const matchesTab = selectedTab === 'all' || payment.status?.toLowerCase() === selectedTab;
    const matchesSearch = payment.payment_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.related_user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  }) : [];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // All payment data now comes from API

  const tabs = [
    { id: 'wallet', label: 'Wallet', count: walletTransactions?.length || 0 },
    { id: 'all', label: 'All Payments', count: Array.isArray(payments) ? payments.length : 0 },
    { id: 'succeeded', label: 'Completed', count: Array.isArray(payments) ? payments.filter(p => p.status === 'succeeded').length : 0 },
    { id: 'pending', label: 'Pending', count: Array.isArray(payments) ? payments.filter(p => p.status === 'pending').length : 0 },
    { id: 'processing', label: 'Processing', count: Array.isArray(payments) ? payments.filter(p => p.status === 'processing').length : 0 }
  ];

  const statsCards = [
    {
      label: 'Available Balance',
      value: `$${wallet?.available_balance?.toLocaleString() || '0.00'}`,
      change: 'Ready to use',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Pending Balance',
      value: `$${wallet?.pending_balance?.toLocaleString() || '0.00'}`,
      change: 'In escrow',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Total Earned',
      value: `$${wallet?.total_earned?.toLocaleString() || '0.00'}`,
      change: 'Lifetime earnings',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Transactions',
      value: walletTransactions?.length?.toString() || '0',
      change: 'All wallet activity',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Use real payment methods from API
  const getPaymentMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'card': return CreditCard;
      case 'bank_account': return Wallet;
      case 'paypal': return Wallet;
      default: return CreditCard;
    }
  };

  // Updated status functions to match API status values
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIconComponent = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  // Updated filtering logic for real API data
  const finalFilteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const matchesSearch = payment.payment_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.related_user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || payment.status?.toLowerCase() === selectedTab;
    
    return matchesSearch && matchesTab;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Payments & Billing
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your payments, invoices, and billing information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/client/payments/methods">
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Add Payment Method</span>
                </button>
              </Link>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Top Up Wallet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-full">
          {/* Main Content */}
          <div>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-8">
              {/* Tabs */}
              <div className="flex items-center space-x-6 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {finalFilteredPayments.length} payments found
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Content */}
            {selectedTab === 'wallet' ? (
              <div className="space-y-6">
                {/* Wallet Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-green-50">
                        <Wallet className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-dark-900">${(Number(wallet?.available_balance) || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Available Balance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-yellow-50">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-dark-900">${(Number(wallet?.pending_balance) || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Pending Balance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-50">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-dark-900">${(Number(wallet?.total_earned) || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Total Earned</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Up Button */}
                <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-dark-900 mb-2">Top Up Wallet</h3>
                      <p className="text-gray-600">Add funds to your wallet using a credit card</p>
                    </div>
                    <button
                      onClick={() => setShowTopUpModal(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      <ArrowUpCircle className="h-5 w-5" />
                      <span>Top Up Wallet</span>
                    </button>
                  </div>
                </div>
                
                {/* Wallet Transactions */}
                <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-dark-900 mb-4">Wallet Transactions</h3>
                  <div className="space-y-4">
                    {walletTransactions?.length > 0 ? (
                      walletTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              transaction.transaction_type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                              {transaction.transaction_type === 'credit' ? (
                                <ArrowUpCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <ArrowDownCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                               <p className="font-medium text-dark-900">
                                 {transaction.transaction_type === 'credit' ? 'Deposit' : 'Withdrawal'}
                               </p>
                              <p className="text-sm text-gray-600">{transaction.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.transaction_type === 'credit' ? '+' : '-'}${(Number(transaction.amount) || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No wallet transactions</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Payments List */
              <div className="space-y-4">
                {finalFilteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${payment.status === 'succeeded' ? 'bg-green-50' : payment.status === 'pending' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg text-dark-900">
                            {payment.description || 'Payment'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">to {payment.related_user?.name || 'Unknown'}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{payment.related_user?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created: {new Date(payment.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Receipt className="h-4 w-4" />
                            <span>{payment.payment_id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-dark-900 mb-1">
                        ${payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.payment_type}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-dark-900 mb-2">Payment Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">${payment.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">{payment.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-xs">{payment.payment_id}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-dark-900 mb-2">Transaction Info</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{payment.payment_type_display || payment.payment_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                        {payment.processed_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Processed:</span>
                            <span className="font-medium">{new Date(payment.processed_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-4">{payment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Payment ID: {payment.payment_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>

        {/* No Payments Found */}
        {finalFilteredPayments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search query to find payments.
            </p>
          </div>
        )}
      </div>
      
      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Top Up Wallet</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XCircle className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.type} **** {method.last4}
                    </option>
                  ))}
                </select>
              </div>
              
              {paymentMethods.length === 0 && (
                <div className="text-center py-4">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">No payment methods registered</p>
                  <Link
                    href="/client/payments/methods"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add new payment method
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={!topUpAmount || !selectedPaymentMethod}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Top Up Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}