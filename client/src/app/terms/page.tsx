'use client';

import { Shield, Users, CreditCard, Scale, FileText, AlertTriangle, Mail, Phone } from 'lucide-react';
import { PAYMENTS_PROVIDER_NAME, PAYMENTS_STORY, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/site';

export default function TermsPage() {
  const sections = [
    {
      id: 'platform-overview',
      title: 'Platform Overview',
      icon: Shield,
      content: 'A List Home Pros connects homeowners with trusted service providers, skilled workers, and project specialists for home improvement and construction-related services. We provide tools for posting projects, hiring professionals, managing jobs, funding payments through escrow, and resolving disputes.'
    },
    {
      id: 'user-roles',
      title: 'User Roles',
      icon: Users,
      content: 'There are several user roles on our platform. Clients post jobs and fund the work. Home Pros offer professional services. Crew Members provide skilled labor. Specialists serve as project coordinators or homeowner representatives. Each role comes with its own permissions, responsibilities, and access.'
    },
    {
      id: 'account-registration',
      title: 'Account Registration',
      icon: FileText,
      content: 'To use the platform, you must register and create an account. You\'re responsible for maintaining the confidentiality of your login credentials and for all activity on your account. Misuse of your account or the platform may result in suspension or termination.'
    },
    {
      id: 'payment-processing',
      title: 'Payment Processing',
      icon: CreditCard,
      content: `${PAYMENTS_STORY} Clients fund their wallet before hiring a professional. Wallets can be funded using a debit card or ACH bank transfer. Payments are processed by ${PAYMENTS_PROVIDER_NAME}. A List does not store your banking or card information.`
    },
    {
      id: 'escrow-disputes',
      title: 'Escrow & Dispute Resolution',
      icon: Scale,
      content: 'Funds are held in escrow and only released once the client verifies that work has been completed or a milestone has been met. If there\'s a disagreement, A List offers a dispute resolution process. We do not guarantee outcomes but will mediate based on the evidence provided.'
    },
    {
      id: 'subscription-plans',
      title: 'Subscription Plans',
      icon: CreditCard,
      content: 'We offer free directory listings and paid subscription plans. Free users can list their business but do not have access to tools like messaging, proposal submission, lead generation, or marketing resources. Paid plans unlock these features and more. You may upgrade or cancel your subscription anytime. Plan changes take effect at the start of your next billing cycle. We do not issue prorated refunds for unused time.'
    },
    {
      id: 'conduct-standards',
      title: 'Conduct Standards',
      icon: Shield,
      content: 'By using the platform, you agree to conduct business with honesty and professionalism. Misrepresentation, solicitation outside of A List, payment circumvention, harassment, or uploading harmful content may result in removal from the platform and forfeiture of funds in escrow.'
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: FileText,
      content: 'You retain ownership of your profile content, photos, and portfolio uploads, but grant us the right to use them to promote your services on the platform. All site content and platform code is the exclusive property of A List Home Professionals and may not be copied or reused without permission.'
    },
    {
      id: 'liability-disclaimer',
      title: 'Liability Disclaimer',
      icon: AlertTriangle,
      content: 'We do not guarantee the quality, timing, or success of any project. A List is a marketplace and tool provider, not the contractor on record. Use of the platform is at your own risk. We are not liable for damages, delays, or losses resulting from services rendered by professionals listed on the platform.'
    },
    {
      id: 'account-termination',
      title: 'Account Termination',
      icon: Users,
      content: 'You may close your account at any time. We reserve the right to remove users who violate our terms or compromise the integrity of the platform. Funds held in escrow at the time of termination may be reviewed before release.'
    },
    {
      id: 'terms-updates',
      title: 'Terms Updates',
      icon: FileText,
      content: 'We may update these Terms periodically. Continued use of the platform means you accept the updated version. A timestamp of the last revision will always be visible.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Scale className="h-5 w-5 mr-2" />
              <span className="text-sm font-semibold">Legal Document</span>
            </div>
            <h1 className="font-heading font-bold text-5xl lg:text-6xl mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Welcome to A List Home Professionals. By using our platform, services, or website, you agree to these Terms of Service. Please read them carefully.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-primary-100 text-sm">
                <strong>Last Updated:</strong> July 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="font-heading font-bold text-2xl text-dark-900 mb-6 text-center">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <a
                  key={index}
                  href={`#${section.id}`}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 group"
                >
                  <div className="bg-gray-100 group-hover:bg-primary-100 p-2 rounded-lg mr-4 transition-colors duration-200">
                    <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-primary-700">
                    {section.title}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-12">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div key={index} id={section.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="font-heading font-bold text-2xl text-dark-900">
                    {section.title}
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl mb-8">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6">
                <Mail className="h-8 w-8 text-primary-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Email Support</h3>
                <a 
                  href={`mailto:${CONTACT_EMAIL}`} 
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <Phone className="h-8 w-8 text-primary-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Phone Support</h3>
                <a 
                  href={`tel:${CONTACT_PHONE}`} 
                  className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="font-heading font-bold text-2xl mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-primary-100 mb-6">
              Join thousands of homeowners and professionals on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Sign Up Today
              </a>
              <a
                href="/how-it-works"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}