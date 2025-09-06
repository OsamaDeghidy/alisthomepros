'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Search,
  Plus,
  Shield,
  Star,
  TrendingUp,
  XCircle,
  MessageCircle,
  CreditCard,
  Loader2
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { Contract } from '@/services/contractsApi';
import { checkReviewEligibility, ReviewEligibility } from '@/services/reviewApi';
import ReviewModal from '@/components/ReviewModal';
import { toast } from 'react-hot-toast';

interface ContractFilters {
  status?: string;
  search?: string;
  page_size?: number;
}
import { useAuthStore } from '@/lib/store';

export default function ContractsPage() {
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total_contracts: 0,
    active_contracts: 0,
    completed_contracts: 0,
    total_value: 0,
    paid_amount: 0,
    pending_amount: 0,
    completion_rate: 0
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedContractForReview, setSelectedContractForReview] = useState<Contract | null>(null);
  const [reviewEligibility, setReviewEligibility] = useState<{[key: string]: ReviewEligibility}>({});


  // Fetch contracts from API
  const fetchContracts = async (filters?: ContractFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contractsService.getClientContracts({
        ...filters,
        search: searchQuery || undefined,
        status: selectedTab === 'all' ? undefined : selectedTab,
        page_size: 20
      });
      
      setContracts(response.results);

    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch contracts');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contract statistics
  const fetchStats = async () => {
    try {
      const statsData = await contractsService.getContractStats();
      setStats(statsData);
    } catch (err: unknown) {
      console.error('Error fetching stats:', err);
    }
  };

  // Check review eligibility for completed contracts
  const checkContractReviewEligibility = async (contractId: string) => {
    try {
      const eligibility = await checkReviewEligibility(parseInt(contractId));
      setReviewEligibility(prev => ({
        ...prev,
        [contractId]: eligibility
      }));
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchContracts();
      fetchStats();
    }
  }, [user, selectedTab, searchQuery]);

  // Check review eligibility for completed contracts
  useEffect(() => {
    contracts.forEach(contract => {
      if (contract.status === 'completed') {
        checkContractReviewEligibility(contract.id.toString());
      }
    });
  }, [contracts]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user) {
        fetchContracts();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const tabs = [
    { id: 'active', label: 'Active', count: stats.active_contracts },
    { id: 'completed', label: 'Completed', count: stats.completed_contracts },
    { id: 'pending', label: 'Pending', count: contracts.filter(c => c.status === 'pending').length },
    { id: 'all', label: 'All', count: stats.total_contracts }
  ];

  const statsCards = [
    {
      label: 'Total Contracts',
      value: stats.total_contracts.toString(),
      change: `${stats.total_contracts} contracts`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Contracts',
      value: stats.active_contracts.toString(),
      change: 'In progress',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Total Value',
      value: `$${stats.total_value.toLocaleString()}`,
      change: `$${stats.paid_amount.toLocaleString()} paid`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round(stats.completion_rate)}%`,
      change: 'On track',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending Signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending Signature':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };



  // Format contract data for display
  const formatContractForDisplay = (contract: Contract) => {
    return {
      ...contract,
      totalAmount: `$${contract.total_amount.toLocaleString()}`,
      contractBalance: `$${(contract.contract_balance || 0).toLocaleString()}`,
      professionalBalance: `$${(contract.professional_balance || 0).toLocaleString()}`,
      paidAmount: `$${contract.paid_amount.toLocaleString()}`,
      signedDate: contract.client_signed_date || contract.professional_signed_date || null,
      paymentTerms: contract.payment_terms || 'Standard terms',
      warranty: contract.warranty_period || 'Standard warranty'
    };
  };

  const filteredContracts = contracts.map(formatContractForDisplay);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-heading font-bold text-3xl text-dark-900">
                My Contracts
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your project contracts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/post-project"
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Contract</span>
              </Link>
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
                placeholder="Search contracts..."
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
              <option value="landscaping">Landscaping</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredContracts.length} contracts found
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <Loader2 className="h-8 w-8 text-primary-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading contracts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl shadow-upwork border border-red-200 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-red-900 mb-2">Error Loading Contracts</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchContracts()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Contracts List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-heading font-semibold text-xl text-dark-900">
                        {contract.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Contract #{contract.contract_number}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">Location not specified</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-dark-900 mb-1">
                    {contract.totalAmount}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Contract Balance: {contract.contractBalance}</div>
                    <div>Professional Balance: {contract.professionalBalance}</div>
                    <div>Paid: {contract.paidAmount}</div>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {contract.professional.toString().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-dark-900">{contract.professional?.first_name && contract.professional?.last_name ? `${contract.professional.first_name} ${contract.professional.last_name}` : 'Professional'}</p>
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        Professional ID: {contract.professional?.id || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/professionals/${contract.professional?.id || contract.professional}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/messages?professional=${contract.professional}`}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">Contract Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Terms:</span>
                      <span className="font-medium">{contract.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-medium">{contract.warranty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Signed Date:</span>
                      <span className="font-medium">{contract.signedDate || 'Not signed'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-dark-900 mb-3">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Type:</span>
                      <span className="font-medium capitalize">{contract.payment_type}</span>
                    </div>
                    {contract.hourly_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-medium">${contract.hourly_rate}/hr</span>
                      </div>
                    )}
                   
                   
                  </div>
                </div>
              </div>

              {/* Contract Status */}
              <div className="mb-6">
                <h4 className="font-semibold text-dark-900 mb-3">Contract Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <CheckCircle className={`h-8 w-8 ${
                      contract.client_signed ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm">Client Signature</p>
                      <p className="text-xs text-gray-600">
                        {contract.client_signed ? 'Signed' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <CheckCircle className={`h-8 w-8 ${
                      contract.professional_signed ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm">Professional Signature</p>
                      <p className="text-xs text-gray-600">
                        {contract.professional_signed ? 'Signed' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(contract.status)}
                  <span className="text-sm text-gray-600">Status: {contract.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/client/contracts/${contract.id}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                  {contract.status === 'completed' && reviewEligibility[contract.id]?.can_review && (
                    <button
                      onClick={() => {
                        setSelectedContractForReview(contract);
                        setShowReviewModal(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Star className="h-4 w-4" />
                      <span>Leave Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* No Contracts Found */}
        {filteredContracts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-upwork border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-dark-900 mb-2">
              No contracts found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query to find contracts.
            </p>
            <Link
              href="/post-project"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Create Your First Contract
            </Link>
          </div>
        )}

        {/* Review Modal */}
         {showReviewModal && selectedContractForReview && reviewEligibility[selectedContractForReview.id] && (
           <ReviewModal
             isOpen={showReviewModal}
             onClose={() => {
               setShowReviewModal(false);
               setSelectedContractForReview(null);
             }}
             eligibility={reviewEligibility[selectedContractForReview.id]}
             onReviewSubmitted={() => {
               setShowReviewModal(false);
               setSelectedContractForReview(null);
               // Refresh review eligibility
               checkContractReviewEligibility(selectedContractForReview.id.toString());
             }}
           />
         )}
      </div>
    </div>
  );
}