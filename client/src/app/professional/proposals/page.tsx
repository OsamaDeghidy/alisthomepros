'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { proposalsService, Proposal } from '@/lib/proposals';
import { useAuthStore } from '@/lib/store';
import { 
  Send, 
  Eye, 
  Edit2, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Search,
  Plus,
  FileText,
  MessageCircle,
  TrendingUp,
  Target
} from 'lucide-react';

export default function ProposalsPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch proposals from backend
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await proposalsService.getProfessionalProposals({
          status: selectedTab === 'all' ? undefined : selectedTab,
          search: searchQuery || undefined
        });
        
        // Handle different response formats
        if (Array.isArray(response)) {
          setProposals(response);
        } else if (response && Array.isArray(response.proposals)) {
          setProposals(response.proposals);
        } else {
          setProposals([]);
        }
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('فشل في تحميل العروض. تأكد من أن الخادم يعمل.');
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated && user) {
      fetchProposals();
    } else if (!isLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user, selectedTab, searchQuery]);

  const tabs = [
    { id: 'all', label: 'All Proposals', count: proposals.length },
    { id: 'pending', label: 'Pending', count: proposals.filter(p => p.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: proposals.filter(p => p.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: proposals.filter(p => p.status === 'rejected').length },
    { id: 'withdrawn', label: 'Withdrawn', count: proposals.filter(p => p.status === 'withdrawn').length }
  ];

  const stats = [
    {
      label: 'Total Proposals',
      value: '28',
      change: '+5 this month',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Acceptance Rate',
      value: '64%',
      change: '+8% from last month',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Average Response',
      value: '2.3 days',
      change: 'Faster than 70% of pros',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Total Value',
      value: '$45,200',
      change: '+$12,000 this month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'withdrawn':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesTab = selectedTab === 'all' || proposal.status.toLowerCase() === selectedTab;
    const matchesSearch = proposal.cover_letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.professional?.display_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all';
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your proposals.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                My Proposals
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your project proposals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/find-work"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Find New Projects</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="kitchen">Kitchen Remodeling</option>
              <option value="bathroom">Bathroom Renovation</option>
              <option value="electrical">Electrical Work</option>
              <option value="plumbing">Plumbing</option>
              <option value="carpentry">Carpentry</option>
              <option value="roofing">Roofing</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredProposals.length} proposals found
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading proposals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              Error Loading Proposals
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Proposals List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={proposal.professional?.avatar || '/default-avatar.png'}
                      alt={proposal.professional?.display_name || 'Professional'}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-heading font-semibold text-xl text-dark-900">
                          Project #{proposal.project}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">Professional: {proposal.professional?.display_name}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{proposal.cover_letter}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{proposal.professional?.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Submitted: {new Date(proposal.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(proposal.status)}
                      <span className="text-sm text-gray-600">{proposal.response_time}</span>
                    </div>
                    <div className="text-2xl font-bold text-dark-900 mb-1">
                      ${proposal.amount} {proposal.currency || 'USD'}
                    </div>
                    <div className="text-sm text-gray-600">{proposal.timeline}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-dark-900 mb-2">Proposal Details</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">${proposal.amount} {proposal.currency || 'USD'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-medium">{proposal.timeline}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize">{proposal.priority}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium">{proposal.views_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-dark-900 mb-2">Attachments</h4>
                    <div className="space-y-1">
                      {proposal.attachments && proposal.attachments.length > 0 ? (
                        proposal.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center space-x-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{attachment.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No attachments</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-dark-900 mb-2">Cover Letter</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{proposal.cover_letter}</p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/professional/proposals/${proposal.id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                    {proposal.status === 'pending' && (
                      <>
                        <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {proposal.status === 'accepted' && (
                      <Link
                        href={`/messages?professional=${proposal.professional?.id}`}
                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Proposals Found */}
        {!loading && !error && proposals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              No proposals found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any proposals yet.
            </p>
            <Link
              href="/find-work"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Find New Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}