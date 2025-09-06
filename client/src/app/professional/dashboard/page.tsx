'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Clock,
  FileText,
  Search,
  ChevronRight,
  MapPin,
  Shield,
  Send,
  Target,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { professionalDashboardApi, type ProfessionalDashboardData } from '../../../services/professionalDashboardApi';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function ProfessionalDashboard() {
  const [dashboardData, setDashboardData] = useState<ProfessionalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = Cookies.get('access_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await professionalDashboardApi.getProfessionalDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  // Create stats array from API data
  const stats = [
    { 
      label: 'Active Jobs', 
      value: dashboardData.stats.active_jobs.toString(), 
      change: `${dashboardData.stats.jobs_this_month} this month`,
      icon: Briefcase, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up'
    },
    { 
      label: 'Total Earned', 
      value: `$${dashboardData.stats.total_earned.toLocaleString()}`, 
      change: `$${dashboardData.stats.monthly_earnings.toLocaleString()} this month`,
      icon: DollarSign, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up'
    },
    { 
      label: 'Proposals Sent', 
      value: dashboardData.stats.proposals_sent.toString(), 
      change: `${dashboardData.stats.proposals_this_month} this month`,
      icon: Send, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'up'
    },
    { 
      label: 'Success Rate', 
      value: `${Math.round(dashboardData.stats.success_rate)}%`, 
      change: `${dashboardData.stats.completed_jobs} completed`,
      icon: Target, 
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      trend: 'up'
    },
  ];

  // Use active jobs from API data
  const activeJobs = dashboardData.active_jobs || [];

  // Use new jobs from API data
  const newJobs = dashboardData.new_jobs || [];

  // Use recent messages from API data
  const recentMessages = dashboardData.recent_messages || [];

  // Use recent earnings from API data
  const recentEarnings = dashboardData.recent_earnings || [];

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                Welcome back, Sarah! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s your professional dashboard overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/professional/proposals/new"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Submit Proposal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  Active Jobs
                </h2>
                <Link
                  href="/professional/contracts"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {Array.isArray(activeJobs) && activeJobs.length > 0 ? activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-dark-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">Client: {job.client.first_name} {job.client.last_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority || 'medium')}`}>
                          {job.priority || 'medium'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">${job.budget?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.contract_type || 'Fixed'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.last_update || 'Recently'}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-dark-900">{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(job.progress)}`}
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{job.location || 'Remote'}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/professional/contracts/${job.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/messages?project=${job.id}`}
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
                    <p>No active jobs at the moment</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Job Opportunities */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-dark-900">
                  New Job Opportunities
                </h2>
                <Link
                  href="/find-work"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>Browse All</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {Array.isArray(newJobs) && newJobs.length > 0 ? newJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-dark-900">{job.title}</h3>
                          {job.verified && (
                            <Shield className="h-4 w-4 text-green-600" />
                          )}
                          {job.urgent && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${job.budget_min?.toLocaleString()} - ${job.budget_max?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location || 'Remote'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.posted_time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          {job.proposals_count} proposals
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          {job.time_left} left
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Posted {job.posted_time}</span>
                      </div>
                      <Link
                        href={`/projects/${job.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                      >
                        Submit Proposal
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No new job opportunities available</p>
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
                {Array.isArray(recentMessages) && recentMessages.length > 0 ? recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      message.unread ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {message.from.first_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-dark-900 text-sm">{message.from.first_name} {message.from.last_name}</p>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                      <p className="text-xs text-primary-600 mt-1">{message.project.title}</p>
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No recent messages</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Earnings */}
            <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg text-dark-900">
                  Recent Earnings
                </h3>
                <Link
                  href="/professional/earnings"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {Array.isArray(recentEarnings) && recentEarnings.length > 0 ? recentEarnings.map((earning) => (
                  <div
                    key={earning.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm">{earning.project.title}</p>
                      <p className="text-xs text-gray-600">{earning.client.first_name} {earning.client.last_name}</p>
                      <p className="text-xs text-gray-500">{earning.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${earning.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{earning.date}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No recent earnings</p>
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
                  href="/find-work"
                  className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <Search className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-700 font-medium">Browse Jobs</span>
                </Link>
                <Link
                  href="/professional/calendar"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">View Calendar</span>
                </Link>
                <Link
                  href="/professional/time-tracker"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Time Tracker</span>
                </Link>
                <Link
                  href="/professional/tasks"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Manage Tasks</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}