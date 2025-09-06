'use client';

import Link from 'next/link';
import { 
  Plus, 
  Users, 
  CreditCard, 
  CheckCircle, 
  UserCheck,
  Briefcase,
  Home,
  Hammer,
  Star,
  Shield,
  Calendar,
  FileText,
  Search,
  ArrowRight,
  Target,
  Wallet,
  Settings,
  Award,
  MessageSquare,
  Clock,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('client');

  const userTypes = [
    {
      id: 'client',
      title: 'Clients',
      description: 'Homeowners posting projects',
      icon: Home,
      color: 'primary'
    },
    {
      id: 'home-pro',
      title: 'Home Pros',
      description: 'Professional contractors',
      icon: Hammer,
      color: 'accent'
    },
    {
      id: 'crew-member',
      title: 'Crew Members',
      description: 'Skilled trade workers',
      icon: Users,
      color: 'success'
    },
    {
      id: 'specialist',
      title: 'Specialists',
      description: 'Project coordinators',
      icon: Briefcase,
      color: 'warning'
    }
  ];

  const processSteps = {
    client: [
      {
        step: '01',
        title: 'Post Your Project',
        headline: 'Tell us what you need',
        description: 'Share project details, upload photos or plans, and set your location, budget, and timeline. The more info you provide, the better your match.',
        icon: Plus,
        features: ['Project Details', 'Photo Upload', 'Budget Setting', 'Timeline Planning']
      },
      {
        step: '02',
        title: 'Get Matched with Pros',
        headline: 'View who fits your project',
        description: 'We notify qualified Home Pros. They\'ll review your request and either accept or decline based on the details. You can view their profiles before they start.',
        icon: Target,
        features: ['Pro Notifications', 'Profile Reviews', 'Match Quality', 'Direct Communication']
      },
      {
        step: '03',
        title: 'Fund Your Wallet',
        headline: 'Secure the job with escrow',
        description: 'Add funds to your wallet using a bank transfer, debit card, or loan. Work begins once your wallet is funded and your pro is ready.',
        icon: Wallet,
        features: ['Bank Transfer', 'Debit Card', 'Loan Options', 'Escrow Protection']
      },
      {
        step: '04',
        title: 'Approve and Release Payment',
        headline: 'Only pay when you\'re satisfied',
        description: 'As milestones are completed, you approve and release funds. Leave a review once the job is done.',
        icon: CheckCircle,
        features: ['Milestone Approval', 'Fund Release', 'Review System', 'Quality Assurance']
      }
    ],
    'home-pro': [
      {
        step: '01',
        title: 'Set Up Your Profile',
        headline: 'Get seen by real clients',
        description: 'Add your services, work history, photos, and credentials. Choose a free listing or a paid plan to unlock features.',
        icon: UserCheck,
        features: ['Service Listings', 'Work Portfolio', 'Credentials', 'Plan Selection']
      },
      {
        step: '02',
        title: 'Accept Jobs That Fit',
        headline: 'You\'re in control',
        description: 'We send you projects based on your service area and trade. Accept jobs that match your scope and budget — or decline if it\'s not the right fit.',
        icon: Settings,
        features: ['Project Matching', 'Service Area', 'Scope Control', 'Budget Alignment']
      },
      {
        step: '03',
        title: 'Get Notified When Funds Are Ready',
        headline: 'Start only when it\'s secure',
        description: 'The client funds their A List Wallet. We notify you once escrow is funded so you can begin work with confidence.',
        icon: Shield,
        features: ['Escrow Notification', 'Secure Start', 'Fund Verification', 'Work Confidence']
      },
      {
        step: '04',
        title: 'Get Paid Upon Approval',
        headline: 'No chasing payments',
        description: 'When milestones are approved, funds are released. Good work earns great reviews — and more jobs.',
        icon: DollarSign,
        features: ['Automatic Payment', 'Milestone Release', 'Review Building', 'Job Growth']
      }
    ],
    'crew-member': [
      {
        step: '01',
        title: 'Build Your Profile',
        headline: 'Show off your trade',
        description: 'Add your skills, work zone, and photos. Join the Crew directory and get discovered by Home Pros and Specialists.',
        icon: Award,
        features: ['Skill Showcase', 'Work Zone', 'Photo Gallery', 'Directory Listing']
      },
      {
        step: '02',
        title: 'Get Offers',
        headline: 'We send jobs to you',
        description: 'Home Pros or Specialists can send you direct job offers. Review the scope and location before accepting.',
        icon: MessageSquare,
        features: ['Direct Offers', 'Scope Review', 'Location Check', 'Pro Connection']
      },
      {
        step: '03',
        title: 'Accept or Decline',
        headline: 'Choose what works for you',
        description: 'If the pay and work match your availability, accept the job. Not available? Just decline — no penalty.',
        icon: Clock,
        features: ['Flexible Choice', 'Pay Matching', 'Availability Check', 'No Penalties']
      },
      {
        step: '04',
        title: 'Get Paid Directly',
        headline: 'Simple agreements',
        description: 'Crew Members are paid directly by the hiring party. Use A List to find work — then agree on terms off-platform.',
        icon: CheckCircle,
        features: ['Direct Payment', 'Simple Terms', 'Work Discovery', 'Flexible Agreements']
      }
    ],
    specialist: [
      {
        step: '01',
        title: 'Create Your Specialist Profile',
        headline: 'Position yourself as a leader',
        description: 'Share your background in project coordination, site management, or homeowner representation.',
        icon: Star,
        features: ['Leadership Profile', 'Coordination Experience', 'Site Management', 'Client Representation']
      },
      {
        step: '02',
        title: 'Connect With Clients or Pros',
        headline: 'Get hired to manage',
        description: 'Clients may hire you to oversee their projects. Home Pros might bring you in to streamline their workflow.',
        icon: Users,
        features: ['Client Oversight', 'Pro Collaboration', 'Project Management', 'Workflow Optimization']
      },
      {
        step: '03',
        title: 'Accept Roles That Fit',
        headline: 'Flexibility on your terms',
        description: 'Receive full project details before saying yes. Accept when it fits your schedule and scope.',
        icon: Calendar,
        features: ['Project Details', 'Schedule Flexibility', 'Scope Matching', 'Term Control']
      },
      {
        step: '04',
        title: 'Coordinate and Get Paid',
        headline: 'Keep the job moving',
        description: 'Manage communication, tasks, and updates. Get paid based on your agreement — milestone-based or flat-rate.',
        icon: FileText,
        features: ['Communication Management', 'Task Coordination', 'Progress Updates', 'Flexible Payment']
      }
    ]
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Escrow System',
      description: 'Funds are held safely until work is completed and approved by the client.'
    },
    {
      icon: UserCheck,
      title: 'Verified Professionals',
      description: 'All professionals are background-checked, licensed, and insured.'
    },
    {
      icon: Star,
      title: 'Review System',
      description: 'Transparent reviews help build trust and ensure quality work.'
    },
    {
      icon: MessageSquare,
      title: 'Built-in Communication',
      description: 'Seamless messaging and project management tools keep everyone connected.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-6xl mb-6">
              How It Works
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed mb-8">
              A simple, secure platform connecting homeowners with trusted professionals. 
              Choose your role below to see how A List Home Pros works for you.
            </p>
          </div>
        </div>
      </div>

      {/* User Type Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 py-6">
            {userTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === type.id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-bold">{type.title}</div>
                    <div className="text-xs opacity-80">{type.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-dark-900 mb-4">
            {userTypes.find(type => type.id === activeTab)?.title} Process
          </h2>
          <p className="text-lg text-gray-600">
            Follow these simple steps to get started as a {userTypes.find(type => type.id === activeTab)?.title.toLowerCase()}
          </p>
        </div>

        <div className="space-y-16">
          {processSteps[activeTab as keyof typeof processSteps]?.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="bg-primary-100 p-4 rounded-2xl mr-4">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="text-6xl font-bold text-primary-200">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-dark-900 mb-3">
                    {step.title}
                  </h3>
                  <h4 className="font-semibold text-xl text-primary-600 mb-4">
                    {step.headline}
                  </h4>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl shadow-xl p-8 h-80 flex items-center justify-center border">
                    <div className="text-center">
                      <IconComponent className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg font-medium">{step.title}</p>
                      <p className="text-gray-300 text-sm mt-2">Step {step.step}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Why Choose A List Home Pros?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with security, trust, and simplicity in mind for all user types.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-dark-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of homeowners and professionals who trust A List Home Pros for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/post-project"
                className="bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Post Your Project</span>
              </Link>
              <Link
                href="/register"
                className="bg-white text-dark-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <UserCheck className="h-5 w-5" />
                <span>Join as Professional</span>
              </Link>
              <Link
                href="/professionals"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Browse Professionals</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}