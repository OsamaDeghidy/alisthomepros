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
        title: 'Post Project',
        headline: 'Tell us what you need',
        description: 'Share project details, upload photos or plans, and set your location, budget, and timeline. The more info you provide, the better your match.',
        icon: Plus,
        features: ['Project Details', 'Photo Upload', 'Budget Setting', 'Timeline Planning']
      },
      {
        step: '02',
        title: 'Get Matched',
        headline: 'Connect with qualified professionals',
        description: 'We notify qualified Home Pros who review your request and either accept or decline based on the details. You can view their profiles before they start.',
        icon: Target,
        features: ['Pro Notifications', 'Profile Reviews', 'Match Quality', 'Direct Communication']
      },
      {
        step: '03',
        title: 'Fund Wallet',
        headline: 'Secure the job with escrow',
        description: 'Add funds to your wallet using a bank transfer, debit card, or loan. Work begins once your wallet is funded and your pro is ready.',
        icon: Wallet,
        features: ['Bank Transfer', 'Debit Card', 'Loan Options', 'Escrow Protection']
      },
      {
        step: '04',
        title: 'Release Payment',
        headline: 'Pay when work is complete',
        description: 'As milestones are completed, you approve and release funds. Leave a review once the job is done to help other clients.',
        icon: CheckCircle,
        features: ['Milestone Approval', 'Fund Release', 'Review System', 'Quality Assurance']
      }
    ],
    'home-pro': [
      {
        step: '01',
        title: 'Set Up Profile',
        headline: 'Get seen by real clients',
        description: 'Add your services, work history, photos, and credentials. Choose a free listing or a paid plan to unlock advanced features.',
        icon: UserCheck,
        features: ['Service Listings', 'Work Portfolio', 'Credentials', 'Plan Selection']
      },
      {
        step: '02',
        title: 'Accept Jobs',
        headline: 'You\'re in control',
        description: 'We send you projects based on your service area and trade. Accept jobs that match your scope and budget — or decline if it\'s not the right fit.',
        icon: Settings,
        features: ['Project Matching', 'Service Area', 'Scope Control', 'Budget Alignment']
      },
      {
        step: '03',
        title: 'Get Notified When Funds Are Ready',
        headline: 'Start only when it\'s secure',
        description: 'The client funds their A List Wallet. We notify you once escrow is funded so you can begin work with complete confidence.',
        icon: Shield,
        features: ['Escrow Notification', 'Secure Start', 'Fund Verification', 'Work Confidence']
      },
      {
        step: '04',
        title: 'Get Paid',
        headline: 'No chasing payments',
        description: 'When milestones are approved, funds are automatically released to you. Good work earns great reviews and leads to more jobs.',
        icon: DollarSign,
        features: ['Automatic Payment', 'Milestone Release', 'Review Building', 'Job Growth']
      }
    ],
    'crew-member': [
      {
        step: '01',
        title: 'Build Profile',
        headline: 'Show off your trade skills',
        description: 'Add your skills, work zone, and photos. Join the Crew directory and get discovered by Home Pros and Specialists looking for skilled workers.',
        icon: Award,
        features: ['Skill Showcase', 'Work Zone', 'Photo Gallery', 'Directory Listing']
      },
      {
        step: '02',
        title: 'Receive Job Offers',
        headline: 'Jobs come to you',
        description: 'Home Pros or Specialists send you direct job offers based on your skills and location. Review all details before making a decision.',
        icon: MessageSquare,
        features: ['Direct Offers', 'Scope Review', 'Location Check', 'Pro Connection']
      },
      {
        step: '03',
        title: 'Accept/Decline',
        headline: 'Choose what works for you',
        description: 'If the pay and work match your availability, accept the job. Not available or not interested? Just decline — no penalties or fees.',
        icon: Clock,
        features: ['Flexible Choice', 'Pay Matching', 'Availability Check', 'No Penalties']
      },
      {
        step: '04',
        title: 'Get Paid Directly',
        headline: 'Simple payment process',
        description: 'Crew Members are paid directly by the hiring party. Use A List to discover work opportunities and establish working relationships.',
        icon: CheckCircle,
        features: ['Direct Payment', 'Simple Terms', 'Work Discovery', 'Flexible Agreements']
      }
    ],
    specialist: [
      {
        step: '01',
        title: 'Create Profile',
        headline: 'Position yourself as a leader',
        description: 'Share your background in project coordination, site management, or homeowner representation. Highlight your expertise in managing complex projects.',
        icon: Star,
        features: ['Leadership Profile', 'Coordination Experience', 'Site Management', 'Client Representation']
      },
      {
        step: '02',
        title: 'Connect with Clients/Pros',
        headline: 'Get hired to manage projects',
        description: 'Clients may hire you to oversee their projects. Home Pros might bring you in to streamline their workflow and coordinate multiple trades.',
        icon: Users,
        features: ['Client Oversight', 'Pro Collaboration', 'Project Management', 'Workflow Optimization']
      },
      {
        step: '03',
        title: 'Accept Roles',
        headline: 'Flexibility on your terms',
        description: 'Receive full project details before committing. Accept roles that fit your schedule, expertise, and preferred project scope.',
        icon: Calendar,
        features: ['Project Details', 'Schedule Flexibility', 'Scope Matching', 'Term Control']
      },
      {
        step: '04',
        title: 'Get Paid for Coordination',
        headline: 'Keep projects moving forward',
        description: 'Manage communication, coordinate tasks, and provide regular updates. Get paid based on your agreement — milestone-based or flat-rate compensation.',
        icon: FileText,
        features: ['Communication Management', 'Task Coordination', 'Progress Updates', 'Flexible Payment']
      }
    ]
  };



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



      {/* Role-Specific CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your role and join thousands who trust A List Home Pros for their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Client CTA */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-2xl text-center border border-primary-200">
              <div className="bg-primary-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg text-dark-900 mb-2">
                For Homeowners
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Post your project and get matched with trusted professionals
              </p>
              <div className="space-y-3">
                <Link
                  href="/register?type=client"
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start Your Subscription</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-primary-500 border border-primary-500 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Home Pro CTA */}
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-2xl text-center border border-accent-200">
              <div className="bg-accent-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Hammer className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg text-dark-900 mb-2">
                For Contractors
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Build your business with secure projects and guaranteed payments
              </p>
              <div className="space-y-3">
                <Link
                  href="/register?type=home-pro"
                  className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <Hammer className="h-4 w-4" />
                  <span>Start Your Subscription</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-accent-500 border border-accent-500 px-6 py-3 rounded-lg font-semibold hover:bg-accent-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Crew Member CTA */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center border border-green-200">
              <div className="bg-green-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg text-dark-900 mb-2">
                For Skilled Workers
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Get discovered by contractors and work on quality projects
              </p>
              <div className="space-y-3">
                <Link
                  href="/register?type=crew-member"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <Users className="h-4 w-4" />
                  <span>Start Your Subscription</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-green-500 border border-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Specialist CTA */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl text-center border border-yellow-200">
              <div className="bg-yellow-500 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading font-bold text-lg text-dark-900 mb-2">
                For Coordinators
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Manage projects and coordinate between clients and professionals
              </p>
              <div className="space-y-3">
                <Link
                  href="/register?type=specialist"
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Start Your Subscription</span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white text-yellow-500 border border-yellow-500 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}