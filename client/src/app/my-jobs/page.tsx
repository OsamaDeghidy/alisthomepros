'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, MapPin, Star, CheckCircle, MessageSquare, FileText, Eye, MoreVertical } from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  date?: string;
}

interface Project {
  id: number;
  title: string;
  clientName?: string;
  clientAvatar?: string;
  client?: {
    name: string;
    avatar: string;
    rating: number;
    projectsCompleted?: number;
    memberSince?: string;
    location?: string;
    verified: boolean;
  };
  status: string;
  progress?: number;
  budget: string;
  deadline?: string;
  startDate?: string;
  description?: string;
  skills?: string[];
  milestones?: Milestone[];
  postedDate?: string;
  proposalCount?: number;
  clientRating?: number;
  projectType?: string;
  duration?: string;
  location?: string;
  category?: string;
  isUrgent?: boolean;
  lastActivity?: string;
  messagesCount?: number;
  unreadMessages?: number;
  proposalStatus?: string;
  proposalAmount?: string;
  proposalValue?: string;
  proposalDate?: string;
  submittedDate?: string;
  completedDate?: string;
  rating?: number;
  feedback?: string;
  clientReview?: string;
  competing?: number;
  timeline?: string;
}

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const tabs = [
    { id: 'active', label: 'Active Projects', count: 3 },
    { id: 'pending', label: 'Pending Approval', count: 2 },
    { id: 'completed', label: 'Completed', count: 8 },
    { id: 'proposals', label: 'Proposals Sent', count: 5 }
  ];

  const filters = [
    'All Categories',
    'Kitchen Remodeling',
    'Bathroom Renovation',
    'Electrical Work',
    'Plumbing',
    'Landscaping',
    'Other'
  ];

  // Sample projects data
  const projects = {
    active: [
      {
        id: 1,
        title: "Modern Kitchen Renovation",
        client: {
          name: "Jennifer Walsh",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.8,
          verified: true
        },
        budget: "$12,000",
        location: "San Francisco, CA",
        category: "Kitchen Remodeling",
        startDate: "2024-12-01",
        deadline: "2024-12-28",
        progress: 65,
        status: "In Progress",
        unreadMessages: 2,
        description: "Complete kitchen remodel with custom cabinetry, quartz countertops, and modern appliances.",
        milestones: [
          { id: 1, title: "Design Approval", completed: true, date: "2024-12-01" },
          { id: 2, title: "Demolition", completed: true, date: "2024-12-03" },
          { id: 3, title: "Electrical Work", completed: true, date: "2024-12-05" },
          { id: 4, title: "Plumbing", completed: false, date: "2024-12-10" },
          { id: 5, title: "Installation", completed: false, date: "2024-12-15" },
          { id: 6, title: "Final Inspection", completed: false, date: "2024-12-28" }
        ]
      },
      {
        id: 2,
        title: "Bathroom Tile Installation",
        client: {
          name: "Michael Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 5.0,
          verified: true
        },
        budget: "$3,500",
        location: "Austin, TX",
        category: "Bathroom Renovation",
        startDate: "2024-12-10",
        deadline: "2024-12-17",
        progress: 25,
        status: "Starting Soon",
        unreadMessages: 0,
        description: "Install ceramic tiles in master bathroom. Materials provided by client.",
        milestones: [
          { id: 1, title: "Site Preparation", completed: true, date: "2024-12-10" },
          { id: 2, title: "Tile Installation", completed: false, date: "2024-12-12" },
          { id: 3, title: "Grouting", completed: false, date: "2024-12-15" },
          { id: 4, title: "Final Cleanup", completed: false, date: "2024-12-17" }
        ]
      },
      {
        id: 3,
        title: "Garden Landscaping Design",
        client: {
          name: "Lisa Anderson",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.9,
          verified: true
        },
        budget: "$7,500",
        location: "Denver, CO",
        category: "Landscaping",
        startDate: "2024-12-05",
        deadline: "2024-12-20",
        progress: 40,
        status: "In Progress",
        unreadMessages: 1,
        description: "Design and install a sustainable garden with native plants and irrigation system.",
        milestones: [
          { id: 1, title: "Design Planning", completed: true, date: "2024-12-05" },
          { id: 2, title: "Soil Preparation", completed: true, date: "2024-12-07" },
          { id: 3, title: "Irrigation Install", completed: false, date: "2024-12-12" },
          { id: 4, title: "Plant Installation", completed: false, date: "2024-12-18" },
          { id: 5, title: "Final Walkthrough", completed: false, date: "2024-12-20" }
        ]
      }
    ],
    pending: [
      {
        id: 4,
        title: "Electrical Panel Upgrade",
        client: {
          name: "Robert Kim",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.7,
          verified: true
        },
        budget: "$2,200",
        location: "Seattle, WA",
        category: "Electrical Work",
        submittedDate: "2024-12-14",
        status: "Pending Review",
        unreadMessages: 0,
        description: "Upgrade electrical panel from 100A to 200A. Licensed electrician required.",
        proposalValue: "$2,200",
        timeline: "3-4 days"
      },
      {
        id: 5,
        title: "Interior House Painting",
        client: {
          name: "Sarah Johnson",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.6,
          verified: true
        },
        budget: "$4,000",
        location: "Miami, FL",
        category: "Painting",
        submittedDate: "2024-12-13",
        status: "Client Review",
        unreadMessages: 1,
        description: "Paint entire 3-bedroom house interior. Paint will be provided by client.",
        proposalValue: "$3,800",
        timeline: "5-7 days"
      }
    ],
    completed: [
      {
        id: 6,
        title: "Roof Repair and Maintenance",
        client: {
          name: "David Wilson",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.9,
          verified: true
        },
        budget: "$1,800",
        location: "Portland, OR",
        category: "Roofing",
        completedDate: "2024-12-08",
        status: "Completed",
        clientRating: 5,
        clientReview: "Excellent work! Professional, on time, and cleaned up perfectly.",
        earnings: "$1,800",
        duration: "2 days"
      }
    ],
    proposals: [
      {
        id: 7,
        title: "Deck Construction",
        client: {
          name: "Maria Garcia",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          rating: 4.8,
          verified: true
        },
        budget: "$8,500",
        location: "Phoenix, AZ",
        category: "Carpentry",
        submittedDate: "2024-12-12",
        status: "Proposal Sent",
        proposalValue: "$8,200",
        timeline: "10-12 days",
        competing: 6
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Starting Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-orange-100 text-orange-800';
      case 'Client Review': return 'bg-purple-100 text-purple-800';
      case 'Proposal Sent': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProjectCard = (project: Project, type: string) => {
    return (
      <div key={project.id} className="bg-white rounded-2xl shadow-upwork hover:shadow-upwork-lg transition-all duration-300 border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading font-semibold text-xl text-dark-900">{project.title}</h3>
                <button className="p-2 text-gray-400 hover:text-dark-600 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>

          {/* Client Info */}
          {project.client && (
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={project.client.avatar}
              alt={project.client.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-dark-900">{project.client.name}</span>
                {project.client.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-sm text-dark-600">{project.client.rating}</span>
              </div>
            </div>
          </div>
          )}

          {/* Description */}
          <p className="text-dark-600 leading-relaxed mb-4">{project.description}</p>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-dark-600">
              <DollarSign className="h-4 w-4" />
              <span>{type === 'proposals' ? project.proposalValue : project.budget}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-dark-600">
              <MapPin className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-dark-600">
              <Calendar className="h-4 w-4" />
              <span>
                {type === 'active' ? `Due ${project.deadline}` :
                 type === 'completed' ? `Completed ${project.completedDate}` :
                 type === 'proposals' ? `Sent ${project.submittedDate}` :
                 `Submitted ${project.submittedDate}`}
              </span>
            </div>
          </div>

          {/* Progress Bar (for active projects) */}
          {type === 'active' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-dark-600">Progress</span>
                <span className="font-medium text-dark-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Milestones (for active projects) */}
          {type === 'active' && project.milestones && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-dark-900 mb-2">Project Milestones</h4>
              <div className="space-y-2">
                {project.milestones.slice(0, 3).map((milestone: Milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {milestone.completed && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${milestone.completed ? 'text-green-600 line-through' : 'text-dark-600'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
                {project.milestones.length > 3 && (
                  <div className="text-xs text-gray-500">+{project.milestones.length - 3} more milestones</div>
                )}
              </div>
            </div>
          )}

          {/* Client Rating (for completed projects) */}
          {type === 'completed' && project.clientRating && (
            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(project.clientRating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-green-700">Client Review</span>
              </div>
              <p className="text-sm text-green-700 italic">&quot;{project.clientReview}&quot;</p>
            </div>
          )}

          {/* Competition Info (for proposals) */}
          {type === 'proposals' && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-600">Competition:</span>
                <span className="font-medium text-dark-900">{project.competing} other proposals</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-dark-600">Timeline:</span>
                <span className="font-medium text-dark-900">{project.timeline}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              {project.unreadMessages && project.unreadMessages > 0 && (
                <div className="flex items-center space-x-1 text-sm text-primary-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">{project.unreadMessages} new messages</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/projects/${project.id}`}
                className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
              </Link>
              {project.client && (
              <Link
                href={`/messages?chat=${project.client.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg transition-colors duration-200"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>
              )}
              <Link
                href={`/projects/${project.id}`}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200"
              >
                {type === 'active' ? 'Manage' : 
                 type === 'proposals' ? 'View Proposal' : 
                 type === 'pending' ? 'View Details' : 'View Project'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentProjects = projects[activeTab as keyof typeof projects] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.1),transparent_60%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center space-y-4">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-dark-900 leading-tight">
              My <span className="text-gradient-primary">Projects</span>
            </h1>
            <p className="text-xl text-dark-600 leading-relaxed max-w-2xl mx-auto">
              Manage your active projects, track progress, and view your work history
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">18</div>
              <div className="text-sm font-medium text-dark-700">Total Projects</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">$47,200</div>
              <div className="text-sm font-medium text-dark-700">Total Earnings</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">4.9</div>
              <div className="text-sm font-medium text-dark-700">Average Rating</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">96%</div>
              <div className="text-sm font-medium text-dark-700">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {filters.map((filter, index) => (
                  <option key={index} value={filter.toLowerCase().replace(/\s+/g, '-')}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-dark-600">
              {currentProjects.length} {currentProjects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>

          {/* Projects Grid */}
          {currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentProjects.map((project) => renderProjectCard(project, activeTab))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-dark-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">You don&apos;t have any projects in this category yet.</p>
              <Link
                href="/find-work"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
              >
                Find New Projects
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 