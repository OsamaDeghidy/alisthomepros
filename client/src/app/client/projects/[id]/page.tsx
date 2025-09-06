'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Download,
  Upload,
  FileText,
  Shield,
  CreditCard,
  Bell,
  X,
  AlertTriangle,
  ArrowRight,
  Flag,
  Info,
  Users,
  Eye,
  ThumbsUp,
  Award,
  Briefcase,
  Filter,
  Search,
  ExternalLink,
  MapPin,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { proposalsService, Proposal } from '@/lib/proposals';


interface Milestone {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  completedDate?: string | null;
  amount: string;
  paid: boolean;
  paymentDate?: string;
  paymentMethod?: string;
  paymentRequested?: boolean;
  requestDate?: string;
  progress?: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [, setShowProposalModal] = useState(false);
  const [proposalFilter, setProposalFilter] = useState('all');
  const [proposalSort, setProposalSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Project data (should be fetched from API based on projectId)
  const project = {
    id: projectId,
    title: 'Kitchen Renovation',
    description: 'Complete kitchen remodel with new cabinets, countertops, and appliances. We want to create a modern, functional space that maximizes storage and includes a breakfast bar.',
    professional: {
      name: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 127,
      completedProjects: 45,
      responseTime: '2 hours',
      verified: true,
      badges: ['Top Rated', 'Licensed', 'Insured'],
      phone: '+1 (555) 123-4567',
      email: 'sarah.mitchell@email.com'
    },
    status: 'In Progress',
    progress: 75,
    budget: '$8,500',
    spent: '$6,375',
    remaining: '$2,125',
    deadline: '2024-02-15',
    startDate: '2024-01-01',
    location: 'Los Angeles, CA',
    category: 'Kitchen Remodeling',
    priority: 'High',
    lastUpdate: '2 hours ago',
    contractType: 'Fixed Price',
    paymentTerms: 'Milestone-based',
    warranty: '2 years',
    escrowAmount: '$1,700',
    paymentRequests: [
      {
        id: 1,
        milestone: 'Electrical & Plumbing',
        amount: '$1,800',
        requestDate: '2024-01-18',
        status: 'pending',
        dueDate: '2024-01-25',
        note: 'Electrical and plumbing work completed as scheduled. Ready for next phase.'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556909045-f18c06d3e1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ],
    documents: [
      { name: 'Contract Agreement', type: 'PDF', size: '2.4 MB', url: '#' },
      { name: 'Material List', type: 'Excel', size: '1.2 MB', url: '#' },
      { name: 'Design Plans', type: 'PDF', size: '5.8 MB', url: '#' },
      { name: 'Permit Documents', type: 'PDF', size: '1.8 MB', url: '#' },
      { name: 'Progress Photos', type: 'ZIP', size: '12.4 MB', url: '#' }
    ]
  };

  // Fetch proposals when component mounts
  useEffect(() => {
    const fetchProposals = async () => {
      if (project.status === 'published' || project.status === 'draft') {
        setLoadingProposals(true);
        try {
          const projectId = parseInt(project.id.split('-')[0].replace('project', ''));
          const response = await proposalsService.getProjectProposals(projectId);
          setProposals(response.results);
        } catch (error) {
          console.error('Failed to fetch proposals:', error);
        } finally {
          setLoadingProposals(false);
        }
      }
    };

    fetchProposals();
  }, [project.id, project.status]);

  const milestones = [
    {
      id: 1,
      title: 'Project Planning & Design',
      description: 'Initial consultation, measurements, and design approval',
      status: 'Completed',
      dueDate: '2024-01-05',
      completedDate: '2024-01-04',
      amount: '$1,700',
      paid: true,
      paymentDate: '2024-01-05',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      title: 'Demolition & Preparation',
      description: 'Remove old cabinets, flooring, and prepare space',
      status: 'Completed',
      dueDate: '2024-01-12',
      completedDate: '2024-01-11',
      amount: '$1,200',
      paid: true,
      paymentDate: '2024-01-12',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 3,
      title: 'Electrical & Plumbing',
      description: 'Update electrical outlets and plumbing connections',
      status: 'Completed',
      dueDate: '2024-01-20',
      completedDate: '2024-01-19',
      amount: '$1,800',
      paid: false,
      paymentRequested: true,
      requestDate: '2024-01-20'
    },
    {
      id: 4,
      title: 'Cabinet Installation',
      description: 'Install new cabinets and hardware',
      status: 'In Progress',
      dueDate: '2024-01-28',
      completedDate: null,
      amount: '$2,500',
      paid: false,
      progress: 60
    },
    {
      id: 5,
      title: 'Countertops & Backsplash',
      description: 'Install quartz countertops and tile backsplash',
      status: 'Pending',
      dueDate: '2024-02-05',
      completedDate: null,
      amount: '$1,800',
      paid: false
    },
    {
      id: 6,
      title: 'Final Touches & Cleanup',
      description: 'Final installation, testing, and cleanup',
      status: 'Pending',
      dueDate: '2024-02-15',
      completedDate: null,
      amount: '$500',
      paid: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      message: 'The cabinet installation is going well. We should be finished by tomorrow evening.',
      timestamp: '2024-01-20 14:30',
      type: 'text'
    },
    {
      id: 2,
      sender: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      message: 'Great! The kitchen is looking amazing. When can we discuss the backsplash options?',
      timestamp: '2024-01-20 15:45',
      type: 'text'
    },
    {
      id: 3,
      sender: 'Sarah Mitchell',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      message: 'I\'ll bring the tile samples tomorrow morning. We can review them together.',
      timestamp: '2024-01-20 16:00',
      type: 'text'
    },
    {
      id: 4,
      sender: 'System',
      avatar: '',
      message: 'Payment request submitted for "Electrical & Plumbing" milestone - $1,800',
      timestamp: '2024-01-20 17:30',
      type: 'payment'
    }
  ];

  // Helper functions for proposals
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesFilter = proposalFilter === 'all' || proposal.status === proposalFilter;
    const matchesSearch = searchQuery === '' || 
      proposal.professional.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.cover_letter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    switch (proposalSort) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'amount_low':
        return parseFloat(a.amount) - parseFloat(b.amount);
      case 'amount_high':
        return parseFloat(b.amount) - parseFloat(a.amount);
      case 'rating':
        return b.professional.rating_average - a.professional.rating_average;
      default:
        return 0;
    }
  });

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const response = await proposalsService.acceptProposal(proposalId);
      
      // Update the proposal status locally first
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === proposalId 
            ? { 
                ...proposal, 
                status: 'accepted' as const,
                contract_id: response.contract?.id || undefined
              }
            : proposal
        )
      );
      
      setShowProposalModal(false);
      
      // Check if contract was created
      if (response.contract && response.contract.id) {
        // Show success message
        alert('تم قبول العرض وإنشاء العقد بنجاح!');
        
        // Refresh proposals to get server data
        const projectId = parseInt(project.id.split('-')[0].replace('project', ''));
        const proposalsResponse = await proposalsService.getProjectProposals(projectId);
        setProposals(proposalsResponse.results);
      } else {
        // Refresh proposals if no contract was created
        const projectId = parseInt(project.id.split('-')[0].replace('project', ''));
        const proposalsResponse = await proposalsService.getProjectProposals(projectId);
        setProposals(proposalsResponse.results);
      }
    } catch (error) {
      console.error('Failed to accept proposal:', error);
      alert('حدث خطأ أثناء قبول العرض. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleRejectProposal = async (proposalId: string, reason?: string) => {
    try {
      await proposalsService.rejectProposal(proposalId, reason);
      // Refresh proposals
      const projectId = parseInt(project.id.split('-')[0].replace('project', ''));
      const response = await proposalsService.getProjectProposals(projectId);
      setProposals(response.results);
      setShowProposalModal(false);
    } catch (error) {
      console.error('Failed to reject proposal:', error);
    }
  };

  const handleMessageFreelancer = (freelancerId: number) => {
    // Navigate to messages page with the freelancer and project
    router.push(`/messages?freelancer=${freelancerId}&project=${project.id}`);
  };

  // Check if there's an accepted proposal with a contract
  const hasContract = proposals.some(proposal => proposal.status === 'accepted' && proposal.contract_id);

  const baseTabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'proposals', label: 'Proposals', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  // Add contract tab if there's a contract
  const tabs = hasContract 
    ? [
        ...baseTabs.slice(0, 2), // overview, milestones
        { id: 'contract', label: 'Contract', icon: FileCheck },
        ...baseTabs.slice(2) // proposals, payments, messages, documents
      ]
    : baseTabs;

  // Show proposals count in tab if project is accepting proposals
  const showProposalsCount = project.status === 'published' || project.status === 'draft';

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handlePayment = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setPaymentAmount(milestone.amount.replace('$', ''));
    setShowPaymentModal(true);
  };

  const submitPayment = () => {
    // Here you would process the payment
    console.log('Processing payment:', {
      milestone: selectedMilestone,
      amount: paymentAmount,
      note: paymentNote
    });
    setShowPaymentModal(false);
    setSelectedMilestone(null);
    setPaymentAmount('');
    setPaymentNote('');
  };

  const totalPaid = milestones.filter(m => m.paid).reduce((sum, m) => sum + parseFloat(m.amount.replace('$', '').replace(',', '')), 0);
  const totalPending = milestones.filter(m => !m.paid).reduce((sum, m) => sum + parseFloat(m.amount.replace('$', '').replace(',', '')), 0);
  const pendingRequests = milestones.filter(m => m.paymentRequested && !m.paid);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/client/projects" className="text-gray-600 hover:text-primary-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-dark-900">{project.title}</h1>
                <p className="text-sm text-gray-600">{project.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {pendingRequests.length > 0 && (
                <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                  <Bell className="h-4 w-4" />
                  <span>{pendingRequests.length} Payment Request{pendingRequests.length > 1 ? 's' : ''}</span>
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Payment Requests Alert */}
            {pendingRequests.length > 0 && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-orange-800">Payment Requests Pending</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      You have {pendingRequests.length} payment request{pendingRequests.length > 1 ? 's' : ''} waiting for approval.
                    </p>
                    <div className="mt-3 space-y-2">
                      {pendingRequests.map((milestone) => (
                        <div key={milestone.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div>
                            <p className="font-medium text-gray-900">{milestone.title}</p>
                            <p className="text-sm text-gray-600">Requested on {milestone.requestDate}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-900">{milestone.amount}</span>
                            <button
                              onClick={() => handlePayment(milestone)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Project Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Project Progress</h2>
                <span className="text-2xl font-bold text-dark-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-dark-900">${totalPaid.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{milestones.filter(m => m.status === 'Completed').length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600">{milestones.filter(m => m.status === 'Pending').length}</p>
                  <p className="text-sm text-gray-600">Remaining</p>
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
                      {tab.id === 'payments' && pendingRequests.length > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {pendingRequests.length}
                        </span>
                      )}
                      {tab.id === 'proposals' && showProposalsCount && proposals.length > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {proposals.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg text-dark-900 mb-3">Project Description</h3>
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-dark-900 mb-2">Project Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium text-dark-900">{project.budget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="font-medium text-dark-900">{project.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Deadline:</span>
                            <span className="font-medium text-dark-900">{project.deadline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <span className="font-medium text-red-600">{project.priority}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contract Type:</span>
                            <span className="font-medium text-dark-900">{project.contractType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Terms:</span>
                            <span className="font-medium text-dark-900">{project.paymentTerms}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-dark-900 mb-2">Financial Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Budget:</span>
                            <span className="font-medium text-dark-900">{project.budget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount Paid:</span>
                            <span className="font-medium text-green-600">${totalPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pending Payments:</span>
                            <span className="font-medium text-orange-600">${totalPending.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Escrow Amount:</span>
                            <span className="font-medium text-blue-600">{project.escrowAmount}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-600">Payment Progress:</span>
                            <span className="font-medium text-dark-900">
                              {Math.round((totalPaid / (totalPaid + totalPending)) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Images */}
                    <div>
                      <h4 className="font-medium text-dark-900 mb-3">Project Gallery</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {project.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`Project ${index + 1}`}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestones Tab */}
                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Project Milestones</h3>
                      <div className="text-sm text-gray-600">
                        {milestones.filter(m => m.status === 'Completed').length} of {milestones.length} completed
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {milestones.map((milestone) => (
                        <div key={milestone.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex-shrink-0">
                                {milestone.status === 'Completed' ? (
                                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                ) : milestone.status === 'In Progress' ? (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium text-dark-900">{milestone.title}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                                    {milestone.status}
                                  </span>
                                  {milestone.paymentRequested && !milestone.paid && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Payment Requested
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Due: {milestone.dueDate}</span>
                                  {milestone.completedDate && (
                                    <span>Completed: {milestone.completedDate}</span>
                                  )}
                                  {milestone.progress && milestone.status === 'In Progress' && (
                                    <span>Progress: {milestone.progress}%</span>
                                  )}
                                </div>
                                {milestone.progress && milestone.status === 'In Progress' && (
                                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${milestone.progress}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-semibold text-dark-900">{milestone.amount}</div>
                                {milestone.paid ? (
                                  <div className="text-xs text-green-600 flex items-center space-x-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Paid on {milestone.paymentDate}</span>
                                  </div>
                                ) : milestone.paymentRequested ? (
                                  <button
                                    onClick={() => handlePayment(milestone)}
                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <div className="text-xs text-gray-500">Pending completion</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposals Tab */}
                {activeTab === 'proposals' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Project Proposals</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received
                        </span>
                      </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search proposals..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <select
                            value={proposalFilter}
                            onChange={(e) => setProposalFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <select
                            value={proposalSort}
                            onChange={(e) => setProposalSort(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="amount_low">Lowest Amount</option>
                            <option value="amount_high">Highest Amount</option>
                            <option value="rating">Highest Rated</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Proposals List */}
                    {loadingProposals ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : sortedProposals.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h4>
                        <p className="text-gray-600">Proposals will appear here once professionals submit them.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedProposals.map((proposal) => (
                          <div key={proposal.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <Image
                                  src={proposal.professional.avatar || '/default-avatar.svg'}
                                  alt={proposal.professional.full_name || `${proposal.professional.first_name} ${proposal.professional.last_name}`}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-semibold text-dark-900">{proposal.professional.full_name || `${proposal.professional.first_name} ${proposal.professional.last_name}`}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(proposal.priority)}`}>
                                      {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)} Priority
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="h-4 w-4" />
                                      <span>{proposal.professional.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Award className="h-4 w-4" />
                                      <span>{proposal.professional.rating_average}/5 ({proposal.professional.rating_count} reviews)</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Briefcase className="h-4 w-4" />
                                      <span>{proposal.professional.projects_completed} projects</span>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 text-sm leading-relaxed">{proposal.cover_letter}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-dark-900 mb-1">${proposal.amount.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">{proposal.timeline} delivery</div>
                                {proposal.estimated_hours && (
                                  <div className="text-sm text-gray-600">{proposal.estimated_hours} hours</div>
                                )}
                              </div>
                            </div>

                            {/* Proposal Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => setSelectedProposal(proposal)}
                                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Details</span>
                                </button>
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm font-medium">
                                  <ExternalLink className="h-4 w-4" />
                                  <span>View Profile</span>
                                </button>
                                <button
                                  onClick={() => handleMessageFreelancer(proposal.professional.id)}
                                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  <span>Message</span>
                                </button>
                              </div>
                              {proposal.status === 'pending' && (
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleRejectProposal(proposal.id)}
                                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAcceptProposal(proposal.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                                  >
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>Accept</span>
                                  </button>
                                </div>
                              )}
                              {proposal.status === 'accepted' && (
                                <div className="flex items-center space-x-3">
                                  {proposal.contract_id ? (
                                    <Link
                                      href={`/client/contracts/${proposal.contract_id}`}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span>View Contract</span>
                                    </Link>
                                  ) : (
                                    <div className="flex items-center space-x-2 text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="text-sm font-medium">Accepted</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {proposal.status === 'rejected' && (
                                <div className="flex items-center space-x-2 text-red-600">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm font-medium">Declined</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Contract Tab */}
                {activeTab === 'contract' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Project Contract</h3>
                    </div>

                    {(() => {
                      const acceptedProposal = proposals.find(p => p.status === 'accepted' && p.contract_id);
                      if (!acceptedProposal) {
                        return (
                          <div className="text-center py-12">
                            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No Contract Available</h4>
                            <p className="text-gray-600">A contract will be created once a proposal is accepted.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="bg-green-100 p-2 rounded-full">
                                <FileCheck className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-dark-900">Contract Active</h4>
                                <p className="text-sm text-gray-600">Contract created from accepted proposal</p>
                              </div>
                            </div>
                            <Link
                              href={`/client/contracts/${acceptedProposal.contract_id}`}
                              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>View Full Contract</span>
                            </Link>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-dark-900 mb-3">Contract Details</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Professional:</span>
                                  <span className="font-medium text-dark-900">{acceptedProposal.professional.full_name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Contract Value:</span>
                                  <span className="font-medium text-dark-900">${acceptedProposal.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Timeline:</span>
                                  <span className="font-medium text-dark-900">{acceptedProposal.timeline}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-dark-900 mb-3">Financial Summary</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total Amount:</span>
                                  <span className="font-medium text-dark-900">${acceptedProposal.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Contract Balance:</span>
                                  <span className="font-medium text-dark-900">${acceptedProposal.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Professional Balance:</span>
                                  <span className="font-medium text-dark-900">$0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Paid Amount:</span>
                                  <span className="font-medium text-dark-900">$0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Remaining Amount:</span>
                                  <span className="font-medium text-green-600">$0</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                            <div>
                              <h5 className="font-medium text-dark-900 mb-3">Professional Info</h5>
                              <div className="flex items-center space-x-3 mb-3">
                                <Image
                                  src={acceptedProposal.professional.avatar || '/default-avatar.svg'}
                                  alt={acceptedProposal.professional.full_name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-medium text-dark-900">{acceptedProposal.professional.full_name}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span>{acceptedProposal.professional.rating_average}/5</span>
                                    <span>({acceptedProposal.professional.rating_count} reviews)</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{acceptedProposal.professional.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="h-4 w-4" />
                                  <span>{acceptedProposal.professional.projects_completed} projects completed</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-medium text-dark-900 mb-3">Quick Actions</h5>
                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={`/client/contracts/${acceptedProposal.contract_id}`}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                <FileText className="h-4 w-4" />
                                <span>View Contract Terms</span>
                              </Link>
                              <button 
                                onClick={() => {
                                  const acceptedProposal = proposals.find(p => p.status === 'accepted' && p.contract_id);
                                  if (acceptedProposal) {
                                    handleMessageFreelancer(acceptedProposal.professional.id);
                                  }
                                }}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                              >
                                <MessageCircle className="h-4 w-4" />
                                <span>Message Professional</span>
                              </button>
                              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                <Download className="h-4 w-4" />
                                <span>Download Contract</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Payment Management</h3>
                      <Link
                        href="/client/payments"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>View All Payments</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Payment Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-green-700">Total Paid</p>
                            <p className="text-xl font-bold text-green-900">${totalPaid.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-100 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-orange-700">Pending</p>
                            <p className="text-xl font-bold text-orange-900">${totalPending.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Shield className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">Escrow</p>
                            <p className="text-xl font-bold text-blue-900">{project.escrowAmount}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div>
                      <h4 className="font-medium text-dark-900 mb-4">Payment History</h4>
                      <div className="space-y-3">
                        {milestones.filter(m => m.paid || m.paymentRequested).map((milestone) => (
                          <div key={milestone.id} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${milestone.paid ? 'bg-green-100' : 'bg-orange-100'}`}>
                                  {milestone.paid ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <Clock className="h-5 w-5 text-orange-600" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium text-dark-900">{milestone.title}</h5>
                                  <p className="text-sm text-gray-600">
                                    {milestone.paid ? (
                                      `Paid on ${milestone.paymentDate} via ${milestone.paymentMethod}`
                                    ) : (
                                      `Payment requested on ${milestone.requestDate}`
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="font-semibold text-dark-900">{milestone.amount}</span>
                                {!milestone.paid && (
                                  <button
                                    onClick={() => handlePayment(milestone)}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Project Messages</h3>
                      <Link
                        href={`/messages?project=${project.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-sm"
                      >
                        View All Messages
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'payment' ? 'bg-blue-50 p-3 rounded-lg' : ''}`}>
                          {message.type !== 'payment' && (
                            <Image
                              src={message.avatar}
                              alt={message.sender}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          {message.type === 'payment' && (
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-dark-900">{message.sender}</span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                              {message.type === 'payment' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Payment Request
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-dark-900">Project Documents</h3>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 text-sm">
                        <Upload className="h-4 w-4" />
                        <span>Upload Document</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.documents.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <FileText className="h-8 w-8 text-primary-600" />
                            <div className="flex-1">
                              <h4 className="font-medium text-dark-900 text-sm">{doc.name}</h4>
                              <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200">
                              View
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                              <Download className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                <Image
                  src={project.professional.avatar}
                  alt={project.professional.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-dark-900">{project.professional.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{project.professional.rating} ({project.professional.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects:</span>
                  <span className="font-medium text-dark-900">{project.professional.completedProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response:</span>
                  <span className="font-medium text-dark-900">{project.professional.responseTime}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.professional.badges.map((badge, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1">
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
                <Link
                  href={`/client/contracts/${project.id}`}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Contract</span>
                </Link>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download Reports</span>
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Flag className="h-4 w-4" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-lg text-dark-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Started: {project.startDate}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Flag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Deadline: {project.deadline}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Last Update: {project.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-dark-900">Proposal Details</h3>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Professional Header */}
              <div className="flex items-start space-x-4">
                <Image
                  src={selectedProposal.professional.avatar || '/default-avatar.svg'}
                  alt={selectedProposal.professional.full_name || `${selectedProposal.professional.first_name} ${selectedProposal.professional.last_name}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-xl font-semibold text-dark-900">{selectedProposal.professional.full_name || `${selectedProposal.professional.first_name} ${selectedProposal.professional.last_name}`}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProposal.status)}`}>
                      {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedProposal.professional.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{selectedProposal.professional.rating_average}/5 ({selectedProposal.professional.rating_count} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{selectedProposal.professional.projects_completed} projects completed</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-dark-900">${selectedProposal.amount.toLocaleString()}</div>
                    <div className="text-gray-600">{selectedProposal.timeline} delivery</div>
                    {selectedProposal.estimated_hours && (
                      <div className="text-gray-600">{selectedProposal.estimated_hours} hours estimated</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h5 className="font-semibold text-dark-900 mb-3">Cover Letter</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedProposal.cover_letter}</p>
                </div>
              </div>

              {/* Milestones */}
              {selectedProposal.milestones && selectedProposal.milestones.length > 0 && (
                <div>
                  <h5 className="font-semibold text-dark-900 mb-3">Proposed Milestones</h5>
                  <div className="space-y-3">
                    {selectedProposal.milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium text-dark-900">{milestone.title}</h6>
                          <span className="font-semibold text-dark-900">${milestone.amount.toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Timeline: {milestone.timeline}</span>
                          <span>Order: #{milestone.order}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {selectedProposal.attachments && selectedProposal.attachments.length > 0 && (
                <div>
                  <h5 className="font-semibold text-dark-900 mb-3">Attachments</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProposal.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <FileText className="h-8 w-8 text-primary-600" />
                        <div className="flex-1">
                          <h6 className="font-medium text-dark-900 text-sm">{attachment.name}</h6>
                          <p className="text-xs text-gray-600">{attachment.file_size_display}</p>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Portfolio Preview */}
              <div>
                <h5 className="font-semibold text-dark-900 mb-3">Professional Portfolio</h5>
                <div className="col-span-3 text-center py-8 text-gray-500">
                  <Briefcase className="h-8 w-8 mx-auto mb-2" />
                  <p>Portfolio samples will be available soon</p>
                </div>
                <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Full Portfolio</span>
                </button>
              </div>

              {/* Action Buttons */}
              {selectedProposal.status === 'pending' && (
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleRejectProposal(selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                    className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                  >
                    Decline Proposal
                  </button>
                  <button
                    onClick={() => {
                      handleAcceptProposal(selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Accept Proposal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-900">Process Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-dark-900">{selectedMilestone.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedMilestone.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Credit Card (**** 1234)</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Escrow Release</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Note (Optional)
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add a note for this payment..."
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Payment Protection</p>
                    <p>Your payment is protected by our escrow service until the milestone is completed to your satisfaction.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPayment}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay ${paymentAmount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}