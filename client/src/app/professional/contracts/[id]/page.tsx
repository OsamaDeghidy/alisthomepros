'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Phone,
  Mail,
  Star,
  Target,
  MessageSquare,
  Download,
  Receipt
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { Contract } from '@/services/contractsApi';
import PaymentHistory from '@/components/PaymentHistory';
import PaymentStatistics from '@/components/PaymentStatistics';
import PaymentNotifications from '@/components/PaymentNotifications';
import ContractPaymentRequest from '@/components/ContractPaymentRequest';
import ContractPaymentsList from '@/components/ContractPaymentsList';
import ContractBalanceInfo from '@/components/ContractBalanceInfo';

interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabType[] = [
  { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
  { id: 'payments', label: 'Payments', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 'communication', label: 'Communication', icon: <MessageSquare className="h-4 w-4" /> }
];

export default function ProfessionalContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params?.id as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [contractBalance, setContractBalance] = useState<number>(0);

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const contractData = await contractsService.getContract(parseInt(contractId));
      setContract(contractData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load contract details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCompleteContract = async () => {
    try {
      await contractsService.completeContract(parseInt(contractId));
      setContract(prev => prev ? { ...prev, status: 'completed' } : null);
      fetchContractDetails(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete contract');
    }
  };

  const handleDisputeContract = async () => {
    try {
      await contractsService.disputeContract(parseInt(contractId));
      setContract(prev => prev ? { ...prev, status: 'disputed' } : null);
      fetchContractDetails(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to dispute contract');
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
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading contract details...</span>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Contract</h2>
          <p className="text-gray-600 mb-4">{error || 'Contract not found'}</p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const remainingAmount = contract.contract_balance || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
                <p className="text-sm text-gray-600">Contract #{contract.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                {getStatusIcon(contract.status)}
                <span className="capitalize">{contract.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Contract Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(contract.total_amount || 0)}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Contract Balance</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(contract.contract_balance || 0)}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Professional Balance</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(contract.professional_balance || 0)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(contract.paid_amount || 0)}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Start Date</p>
                              <p className="text-sm text-gray-600">{contract.start_date ? formatDate(contract.start_date) : 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">End Date</p>
                              <p className="text-sm text-gray-600">{contract.end_date ? formatDate(contract.end_date) : 'Not set'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Payment Type</p>
                              <p className="text-sm text-gray-600 capitalize">{contract.payment_type || 'Fixed'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {contract.hourly_rate && (
                            <div className="flex items-center space-x-3">
                              <Clock className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Hourly Rate</p>
                                <p className="text-sm text-gray-600">{formatCurrency(contract.hourly_rate)}/hour</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Payment Terms</p>
                              <p className="text-sm text-gray-600">{contract.payment_terms || 'Standard terms'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Warranty Period</p>
                              <p className="text-sm text-gray-600">{contract.warranty_period || 'Standard warranty'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {contract.description && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{contract.description}</p>
                      </div>
                    )}
                  </div>
                )}



                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    {/* Contract Balance Information */}
                    <ContractBalanceInfo 
                      contractId={parseInt(contractId)}
                      userRole="professional"
                      refreshTrigger={refreshTrigger}
                      className=""
                      onBalanceUpdate={(data) => setContractBalance(data.contract_balance)}
                    />
                    
                    {/* Payment Request Form */}
                    <ContractPaymentRequest 
                      contractId={parseInt(contractId)}
                      contractBalance={contractBalance}
                      onPaymentRequested={handlePaymentAction}
                      className=""
                    />
                    
                    {/* Payment History */}
                    <ContractPaymentsList 
                      contractId={parseInt(contractId)}
                      userRole="professional"
                      refreshTrigger={refreshTrigger}
                      className=""
                    />
                    
                    {/* Legacy Payment Statistics */}
                    <div className="border-t pt-6">
                      <PaymentStatistics 
                        contractId={contract.id}
                        timeRange="month"
                        className="border-0 shadow-none"
                      />
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
                    <p>Document management will be available soon</p>
                  </div>
                )}

                {/* Communication Tab */}
                {activeTab === 'communication' && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Communication History</h3>
                    <p>Communication tracking will be available soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {contract.client.first_name} {contract.client.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{contract.client.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{contract.client.email}</span>
                  </div>

                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Rating: Not available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Message Client</span>
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Contract</span>
                </button>
                {contract?.status === 'active' && (
                  <>
                    <button 
                      onClick={handleCompleteContract}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete Contract</span>
                    </button>
                    <button 
                      onClick={handleDisputeContract}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Dispute Contract</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Payment Notifications */}
            <div className="mt-6">
              <PaymentNotifications 
                userRole="professional"
                maxNotifications={5}
                className="shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}