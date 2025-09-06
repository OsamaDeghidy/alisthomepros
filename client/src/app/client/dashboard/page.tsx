'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// UI components imports removed - using native HTML elements instead
import {
  DollarSign,
  Briefcase,
  Clock,
  Star,
  TrendingUp,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { dashboardApi, DashboardData } from '@/services/dashboardApi';
import { contractsApi, Contract, ContractStats } from '@/services/contractsApi';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export default function ClientDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [, setContractStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        const token = Cookies.get('access_token');
        if (!token) {
          console.log('No authentication token found');
          toast.error('Please login to view dashboard');
          setLoading(false);
          return;
        }

        setLoading(true);
        const data = await dashboardApi.getClientDashboard();
        setDashboardData(data);
        
        // Fetch contracts data
        try {
          const contractsData = await contractsApi.getClientContracts();
          const statsData = await contractsApi.getContractStats();
          setContracts(contractsData);
          setContractStats(statsData);
        } catch (contractError) {
          console.error('Error fetching contracts:', contractError);
          toast.error('Failed to load contracts data');
          setContracts([]);
          setContractStats(null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // إنشاء الإحصائيات من البيانات الحقيقية
  const stats = dashboardData ? [
    { 
      label: 'Active Projects', 
      value: dashboardData.stats.active_jobs.toString(), 
      icon: Briefcase, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${dashboardData.stats.jobs_this_month} this month`,
      trend: 'up'
    },
    { 
      label: 'Total Spent', 
      value: `$${dashboardData.stats.total_earned.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: `$${dashboardData.stats.monthly_earnings.toLocaleString()} this month`,
      trend: 'up'
    },
    { 
      label: 'Professionals Hired', 
      value: dashboardData.stats.total_clients.toString(), 
      icon: Users, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Connected',
      trend: 'up'
    },
    { 
      label: 'Projects Completed', 
      value: dashboardData.stats.completed_jobs.toString(), 
      icon: Star, 
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: `${dashboardData.stats.success_rate}% success rate`,
      trend: 'up'
    },
  ] : [];

  // المشاريع النشطة
  const activeProjects = dashboardData?.active_jobs || [];

  // الرسائل الأخيرة
  const recentMessages = dashboardData?.recent_messages || [];

  // Recent earnings/payments
  const recentEarnings = dashboardData?.recent_earnings || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Waiting for Materials':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning Phase':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">Please check your connection and try again</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Welcome back, John! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s what&apos;s happening with your projects today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/post-project"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Post New Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-8 mb-8">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No statistics available</p>
              <p className="text-sm mt-1">Statistics will appear here once you have activity</p>
            </div>
          </div>
        )}

        {/* Analytics Charts */}
        {dashboardData?.analytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending Chart */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">Monthly Spending</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart visualization would go here</p>
              </div>
            </div>

            {/* Projects Chart */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">Projects Overview</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-8 mb-8">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No analytics data available</p>
              <p className="text-sm mt-1">Charts will appear here once you have project activity</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  Active Projects
                </h2>
                <Link
                  href="/client/projects"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {activeProjects.length > 0 ? activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={project.client?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={`${project.client?.first_name} ${project.client?.last_name}`}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-dark-900">{project.title}</h3>
                          <p className="text-sm text-gray-600">by {project.client?.first_name} {project.client?.last_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">${project.budget?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{new Date(project.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-dark-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}-${project.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/messages?project=${project.id}`}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Message
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No active projects</p>
                    <p className="text-sm mt-1">Your active projects will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contracts Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  Active Contracts
                </h2>
                <Link
                  href="/client/contracts"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {Array.isArray(contracts) && contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-dark-900">{contract.title}</h3>
                          <p className="text-sm text-gray-600">Contract #{contract.contract_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contract.status === 'active' ? 'bg-green-100 text-green-800' :
                          contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          contract.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">${contract.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{new Date(contract.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contract.professional.first_name} {contract.professional.last_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contract.completion_percentage}% Complete</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-dark-900">{contract.completion_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(contract.completion_percentage)}`}
                          style={{ width: `${contract.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Paid:</span>
                          <span className="text-sm font-medium text-green-600">${contract.paid_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Remaining:</span>
                          <span className="text-sm font-medium text-orange-600">${(contract.total_amount - contract.paid_amount).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/client/contracts/${contract.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Contract
                        </Link>
                        {contract.status === 'active' && (
                          <Link
                            href={`/client/contracts/${contract.id}/milestones`}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Milestones
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!Array.isArray(contracts) || contracts.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No active contracts</p>
                    <p className="text-sm mt-1">Contracts will appear here once you hire professionals</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-dark-900">
                  Recent Messages
                </h3>
                <Link
                  href="/messages"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentMessages.length > 0 ? recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      message.unread ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Image
                      src={message.from?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={`${message.from?.first_name} ${message.from?.last_name}`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-dark-900 text-sm">
                          {message.from?.first_name} {message.from?.last_name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                      <p className="text-xs text-primary-600 mt-1">{message.project?.title}</p>
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent messages</p>
                    <p className="text-sm mt-1">Messages will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-dark-900">
                  Recent Payments
                </h3>
                <Link
                  href="/client/payments"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentEarnings.length > 0 ? recentEarnings.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-dark-900 text-sm">{payment.project.title}</h4>
                        <span className="text-lg font-semibold text-green-600">
                          ${payment.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        To: {payment.client.first_name} {payment.client.last_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent payments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <h3 className="font-heading font-semibold text-lg text-dark-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/post-project"
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-700 font-medium">Post New Project</span>
                </Link>
                <Link
                  href="/professionals"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Browse Professionals</span>
                </Link>
                <Link
                  href="/client/reviews"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Leave a Review</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}