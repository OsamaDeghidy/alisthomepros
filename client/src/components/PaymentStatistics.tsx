'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface PaymentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedPayments: number;
  averagePaymentTime: number;
  monthlyGrowth: number;
  paymentsByMonth: { month: string; amount: number }[];
  paymentsByStatus: { status: string; count: number; amount: number }[];
}

interface PaymentStatisticsProps {
  contractId?: number;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  className?: string;
}

export default function PaymentStatistics({ 
  contractId, 
  timeRange = 'month',
  className = '' 
}: PaymentStatisticsProps) {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: PaymentStats = {
        totalEarnings: 45750,
        monthlyEarnings: 8500,
        pendingPayments: 3250,
        completedPayments: 12,
        averagePaymentTime: 5.2,
        monthlyGrowth: 15.3,
        paymentsByMonth: [
          { month: 'Jan', amount: 5200 },
          { month: 'Feb', amount: 6800 },
          { month: 'Mar', amount: 7200 },
          { month: 'Apr', amount: 8500 },
          { month: 'May', amount: 9200 },
          { month: 'Jun', amount: 8750 }
        ],
        paymentsByStatus: [
          { status: 'Completed', count: 12, amount: 42500 },
          { status: 'Pending', count: 3, amount: 3250 },
          { status: 'Processing', count: 1, amount: 1500 }
        ]
      };
      
      setStats(mockStats);
      setLoading(false);
    };

    fetchStats();
  }, [contractId, selectedTimeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Statistics</h2>
              <p className="text-sm text-gray-600">Financial performance overview</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{formatPercentage(stats.monthlyGrowth)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyEarnings)}</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-orange-600">
                <span className="text-sm font-medium">{stats.paymentsByStatus.find(s => s.status === 'Pending')?.count || 0}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingPayments)}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          {/* Average Payment Time */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.averagePaymentTime} days</p>
              <p className="text-sm text-gray-600">Avg. Payment Time</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Earnings Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Monthly Earnings Trend</span>
            </h3>
            <div className="space-y-3">
              {stats.paymentsByMonth.map((month, index) => {
                const maxAmount = Math.max(...stats.paymentsByMonth.map(m => m.amount));
                const percentage = (month.amount / maxAmount) * 100;
                
                return (
                  <div key={month.month} className="flex items-center space-x-3">
                    <div className="w-8 text-sm text-gray-600 font-medium">{month.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-20 text-sm text-gray-900 font-medium text-right">
                      {formatCurrency(month.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Status Distribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span>Payment Status</span>
            </h3>
            <div className="space-y-3">
              {stats.paymentsByStatus.map((status, index) => {
                const colors = {
                  'Completed': 'bg-green-500',
                  'Pending': 'bg-orange-500',
                  'Processing': 'bg-blue-500'
                };
                const bgColors = {
                  'Completed': 'bg-green-50 border-green-200',
                  'Pending': 'bg-orange-50 border-orange-200',
                  'Processing': 'bg-blue-50 border-blue-200'
                };
                
                return (
                  <div key={status.status} className={`rounded-lg p-3 border ${bgColors[status.status as keyof typeof bgColors]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${colors[status.status as keyof typeof colors]}`}></div>
                        <span className="text-sm font-medium text-gray-900">{status.status}</span>
                      </div>
                      <span className="text-sm text-gray-600">{status.count} payments</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(status.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Activity className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}