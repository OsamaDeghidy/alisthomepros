'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  FileText,
  User,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { paymentApi } from '@/services/paymentsApi';
import { useAuthStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

interface Payment {
  id: number;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  payment_type: string;
  description: string;
  created_at: string;
  processed_at?: string;
  payer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  payee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  contract?: {
    id: number;
    title: string;
  };
  milestone?: {
    id: number;
    title: string;
  };
}

interface PaymentHistoryProps {
  contractId?: number;
  userRole?: 'client' | 'professional';
  className?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ 
  contractId, 
  userRole = 'professional',
  className = '' 
}) => {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with actual API call
      // For now, using mock data
      const mockPayments: Payment[] = [
        {
          id: 1,
          amount: 1500,
          status: 'succeeded',
          payment_type: 'milestone_payment',
          description: 'Payment for milestone: Initial Design',
          created_at: '2024-01-15T10:30:00Z',
          processed_at: '2024-01-15T10:35:00Z',
          payer: { id: 1, first_name: 'Ahmed', last_name: 'Ali', email: 'ahmed@example.com' },
          payee: { id: 2, first_name: 'Sara', last_name: 'Hassan', email: 'sara@example.com' },
          contract: { id: 18, title: 'Website Development Project' },
          milestone: { id: 1, title: 'Initial Design' }
        },
        {
          id: 2,
          amount: 2000,
          status: 'pending',
          payment_type: 'milestone_payment',
          description: 'Payment for milestone: Backend Development',
          created_at: '2024-01-20T14:20:00Z',
          payer: { id: 1, first_name: 'Ahmed', last_name: 'Ali', email: 'ahmed@example.com' },
          payee: { id: 2, first_name: 'Sara', last_name: 'Hassan', email: 'sara@example.com' },
          contract: { id: 18, title: 'Website Development Project' },
          milestone: { id: 2, title: 'Backend Development' }
        }
      ];
      
      setPayments(mockPayments);
    } catch (err) {
      setError('Failed to load payment history');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, contractId]);

  // Filter and sort payments
  const filteredPayments = payments
    .filter(payment => {
      const matchesSearch = searchQuery === '' || 
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.contract?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.milestone?.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      const matchesDateRange = (!dateRange.start || new Date(payment.created_at) >= new Date(dateRange.start)) &&
                              (!dateRange.end || new Date(payment.created_at) <= new Date(dateRange.end));
      
      return matchesSearch && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    toast.success('Export functionality will be available soon');
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading payment history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPayments}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Start date"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Payment List */}
      <div className="p-6">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600">No payments match your current filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sort Controls */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-600">Sort by:</span>
              <button
                onClick={() => toggleSort('date')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  sortBy === 'date' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Date</span>
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => toggleSort('amount')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                  sortBy === 'amount' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Amount</span>
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>

            {/* Payment Items */}
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </div>
                      <span className="text-sm text-gray-500">#{payment.id}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">
                      {payment.milestone?.title || payment.description}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {payment.contract && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{payment.contract.title}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>
                          {userRole === 'professional' 
                            ? `From: ${payment.payer.first_name} ${payment.payer.last_name}`
                            : `To: ${payment.payee.first_name} ${payment.payee.last_name}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(payment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                    {payment.processed_at && (
                      <p className="text-sm text-gray-500">Processed: {formatDate(payment.processed_at)}</p>
                    )}
                  </div>
                </div>
                
                {payment.description && payment.description !== payment.milestone?.title && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{payment.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;