'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Edit2,
  CheckCircle,
  Clock,
  CreditCard,
  Printer,
  Share2,
  Plus,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Flag,
  Target,
  File,
  Receipt,
  Loader2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { contractsService } from '@/lib/contracts';
import { useAuthStore } from '@/lib/store';
import AppointmentsSection from '@/components/AppointmentsSection';
import ContractPaymentApproval from '@/components/ContractPaymentApproval';
import ContractPaymentsList from '@/components/ContractPaymentsList';
import ContractBalanceInfo from '@/components/ContractBalanceInfo';

import { Contract } from '@/services/contractsApi';
import { useApiError } from '@/hooks/useApiError';
import ErrorDisplay from '@/components/ErrorDisplay';

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completion_date?: string;
  payment_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ContractDetailPage() {
  const params = useParams();
  const contractId = params?.id as string;
  const { user } = useAuthStore();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const { error, handleApiError, clearError } = useApiError();
  const [activeTab, setActiveTab] = useState('overview');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!user || !contractId) return;
      
      try {
        setLoading(true);
        clearError();
        const contractData = await contractsService.getContract(parseInt(contractId));
        setContract(contractData);
      } catch (err: unknown) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [user, contractId, clearError, handleApiError]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);



  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: File },
    { id: 'amendments', label: 'Amendments', icon: Edit2 },
    { id: 'appointments', label: 'Appointments', icon: Calendar }
  ];

  const contractStatuses: Array<{ value: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed'; label: string }> = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'disputed', label: 'Disputed' }
  ];

  const updateContractStatus = async (newStatus: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed') => {
    if (!contract || updatingStatus) return;
    
    setUpdatingStatus(true);
    try {
      const updatedContract = await contractsService.updateContract(contract.id, { status: newStatus });
      
      // Update contract state with the response from server
      setContract({ ...contract, ...updatedContract, status: newStatus });
      
      // If contract is completed, also update project status if exists
      if (newStatus === 'completed' && contract.project) {
        try {
          // Import projects service and update project status
          const { projectsService } = await import('../../../../lib/projects');
          await projectsService.updateProject(contract.project.id, { status: 'completed' });
          console.log('Project status updated to completed');
        } catch (projectError) {
          console.warn('Failed to update project status:', projectError);
          // Don't fail the contract update if project update fails
        }
      }
      
      setShowStatusDropdown(false);
      
      // Show success message
      const statusLabels = {
        'draft': 'Draft',
        'pending': 'Pending',
        'active': 'Active',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'disputed': 'Disputed'
      };
      
      alert(`Contract status updated to: ${statusLabels[newStatus as keyof typeof statusLabels] || newStatus}`);
      
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCompleteContract = async () => {
    if (!contract) return;
    
    try {
      setUpdatingStatus(true);
      await contractsService.completeContract(contract.id);
      
      // Update contract state
      setContract({ ...contract, status: 'completed' });
      
      // Refresh contract data
      setRefreshTrigger(prev => prev + 1);
      
      alert('Contract completed successfully');
    } catch (error: any) {
      console.error('Error completing contract:', error);
      handleApiError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDisputeContract = async () => {
    if (!contract) return;
    
    try {
      setUpdatingStatus(true);
      await contractsService.disputeContract(contract.id);
      
      // Update contract state
      setContract({ ...contract, status: 'disputed' });
      
      // Refresh contract data
      setRefreshTrigger(prev => prev + 1);
      
      alert('Contract disputed successfully');
    } catch (error: any) {
      console.error('Error disputing contract:', error);
      handleApiError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const formatCurrency = (amount: number) => {
    return `$${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handlePaymentAction = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading contract...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorDisplay 
            error={error}
            onRetry={() => {
              const fetchContract = async () => {
                if (!user || !contractId) return;
                
                try {
                  setLoading(true);
                  clearError();
                  const contractData = await contractsService.getContract(parseInt(contractId));
                  setContract(contractData);
                } catch (err: unknown) {
                  handleApiError(err);
                } finally {
                  setLoading(false);
                }
              };
              fetchContract();
            }}
            onDismiss={clearError}
          />
          <div className="mt-4 text-center">
            <Link
              href="/client/contracts"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Back to Contracts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contract Not Found</h2>
          <p className="text-gray-600 mb-4">The contract you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/client/contracts"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Contracts
          </Link>
        </div>
      </div>
    );
  }


  const remainingAmount = contract.contract_balance || 0; // Contract balance represents prepaid funds

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/client/contracts" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-dark-900">{contract.title}</h1>
                <p className="text-sm text-gray-600">Contract #{contract.contract_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(contract.status)} hover:opacity-80 transition-opacity`}
                  disabled={updatingStatus}
                >
                  <span className="capitalize">{contract.status}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      {contractStatuses.map((status) => (
                        <button
                          key={status.value}
                          onClick={() => updateContractStatus(status.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            contract.status === status.value ? 'bg-gray-50 font-medium' : ''
                          }`}
                          disabled={updatingStatus}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.print()}
                  className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Print Contract"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const contractData = {
                      title: contract.title,
                      number: contract.contract_number,
                      client: user ? `${user.first_name} ${user.last_name}` : 'Client',
                      professional: contract.professional ? `${contract.professional.first_name} ${contract.professional.last_name}` : 'Professional',
                      amount: contract.total_amount,
                      startDate: contract.start_date,
                      endDate: contract.end_date,
                      description: contract.description
                    };
                    
                    const content = `CONTRACT DETAILS\n\nTitle: ${contractData.title}\nContract Number: ${contractData.number}\nClient: ${contractData.client}\nProfessional: ${contractData.professional}\nAmount: $${contractData.amount}\nStart Date: ${contractData.startDate}\nEnd Date: ${contractData.endDate}\n\nDescription:\n${contractData.description}`;
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `contract-${contractData.number}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Download Contract"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({
                        title: `Contract: ${contract.title}`,
                        text: `Check out this contract: ${contract.title}`,
                        url: url
                      });
                    } else {
                      navigator.clipboard.writeText(url).then(() => {
                        alert('Contract link copied to clipboard!');
                      });
                    }
                  }}
                  className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Share Contract"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Contract Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(contract.total_amount)}</div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(contract.contract_balance || 0)}</div>
                  <p className="text-sm text-gray-600">Contract Balance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-dark-900">{formatCurrency(contract.professional_balance || 0)}</div>
                  <p className="text-sm text-gray-600">Professional Balance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(contract.paid_amount || 0)}</div>
                  <p className="text-sm text-gray-600">Paid Amount</p>
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
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
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
                      <h3 className="text-lg font-semibold text-dark-900 mb-4">Contract Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Contract Number</label>
                            <p className="text-gray-900">{contract.contract_number}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Payment Type</label>
                            <p className="text-gray-900 capitalize">{contract.payment_type}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <p className="text-gray-900 capitalize">{contract.status}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Contract Value</label>
                            <p className="text-gray-900 font-semibold">{formatCurrency(contract.total_amount)}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <p className="text-gray-900">{formatDate(contract.start_date)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">End Date</label>
                            <p className="text-gray-900">{formatDate(contract.end_date)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Payment Terms</label>
                            <p className="text-gray-900">{contract.payment_terms}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Warranty</label>
                            <p className="text-gray-900">{contract.warranty_period}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-dark-900 mb-4">Project Description</h3>
                      <p className="text-gray-700">{contract.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-dark-900 mb-4">Terms & Conditions</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{contract.terms_and_conditions}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <ContractBalanceInfo 
                      contractId={contract.id}
                      userRole="client"
                      refreshTrigger={refreshTrigger}
                    />
                    
                    <ContractPaymentApproval 
                      contractId={contract.id} 
                      onPaymentAction={handlePaymentAction}
                      refreshTrigger={refreshTrigger}
                    />
                    
                    <ContractPaymentsList 
                      contractId={contract.id}
                      userRole="client"
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dark-900">Contract Documents</h3>
                    </div>
                    
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
                      <p className="text-gray-600">Document upload and management will be available soon.</p>
                    </div>
                  </div>
                )}

                {/* Amendments Tab */}
                {activeTab === 'amendments' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dark-900">Contract Amendments</h3>
                      <button 
                        onClick={() => {/* Amendment modal functionality to be implemented */}}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Request Amendment</span>
                      </button>
                    </div>
                    
                    <div className="text-center py-8">
                      <Edit2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Amendments</h4>
                      <p className="text-gray-600">No amendments have been made to this contract.</p>
                    </div>
                  </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                  <AppointmentsSection 
                    contractId={contract.id}
                    professionalId={typeof contract.professional === 'object' ? contract.professional?.id || 0 : contract.professional}
                    clientId={typeof contract.client === 'object' ? contract.client?.id || 0 : contract.client}
                    projectId={typeof contract.project === 'object' ? contract.project?.id : contract.project}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Professional Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-dark-900 mb-4">Professional</h3>
              <div className="flex items-center space-x-3 mb-4">
                {contract.professional?.avatar ? (
                  <Image
                    src={contract.professional.avatar}
                    alt={`${contract.professional.first_name} ${contract.professional.last_name}` || 'Professional'}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 font-medium">
                      {contract.professional?.first_name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-dark-900">
                    {contract.professional ? `${contract.professional.first_name} ${contract.professional.last_name}` : 'Professional'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {contract.professional?.email || 'Contact information not available'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      Rating not available
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-dark-900">
                    Not provided
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-dark-900">
                    {contract.professional?.email || 'Not provided'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  href={`/messages?professional=${typeof contract.professional === 'object' ? contract.professional?.id || contract.professional : contract.professional}`}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      alert('Phone number not available');
                    }}
                    className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button 
                    onClick={() => {
                      const email = contract.professional?.email;
                      if (email) {
                        window.open(`mailto:${email}`, '_self');
                      } else {
                        alert('Email not available');
                      }
                    }}
                    className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-dark-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Milestones</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>View Payments</span>
                </button>
                
                {/* Contract Status Actions */}
                {contract.status !== 'completed' && contract.status !== 'disputed' && contract.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={handleCompleteContract}
                      disabled={updatingStatus}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span>Complete Contract</span>
                    </button>
                    <button
                      onClick={handleDisputeContract}
                      disabled={updatingStatus}
                      className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingStatus ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span>Dispute Contract</span>
                    </button>
                  </>
                )}
                <button 
                   onClick={() => {
                     // Generate and download contract PDF
                     const contractData = {
                       title: contract.title,
                       number: contract.contract_number,
                       client: user ? `${user.first_name} ${user.last_name}` : 'Client',
                       professional: contract.professional ? `${contract.professional.first_name} ${contract.professional.last_name}` : 'Professional',
                       amount: contract.total_amount,
                       startDate: contract.start_date,
                       endDate: contract.end_date,
                       description: contract.description
                     };
                     
                     // Create a simple text file for now (can be enhanced to PDF later)
                     const content = `CONTRACT DETAILS\n\nTitle: ${contractData.title}\nContract Number: ${contractData.number}\nClient: ${contractData.client}\nProfessional: ${contractData.professional}\nAmount: $${contractData.amount}\nStart Date: ${contractData.startDate}\nEnd Date: ${contractData.endDate}\n\nDescription:\n${contractData.description}`;
                     
                     const blob = new Blob([content], { type: 'text/plain' });
                     const url = window.URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = `contract-${contractData.number}.txt`;
                     document.body.appendChild(a);
                     a.click();
                     document.body.removeChild(a);
                     window.URL.revokeObjectURL(url);
                   }}
                   className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                 >
                   <Download className="h-4 w-4" />
                   <span>Download Contract</span>
                 </button>
              </div>
            </div>

            {/* Contract Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-dark-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Created: {formatDate(contract.created_at)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Flag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Started: {formatDate(contract.start_date)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Due: {formatDate(contract.end_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}