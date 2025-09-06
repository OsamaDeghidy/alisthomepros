'use client';

import { Shield, Lock, Eye, Users, CreditCard, FileText, Clock, Mail, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      icon: Eye,
      content: [
        'We collect information when you register, create a listing, post a project, apply for work, message other users, or use features on the platform. This includes:',
        '• Contact information such as name, email, phone number, and business address',
        '• Profile and business information including licenses, portfolios, work history, and reviews',
        '• Payment and funding details, such as bank account info, ACH routing, and debit or credit card data',
        '• Usage data including device information, IP address, and browsing behavior',
        '• Communications with our support team or during dispute resolution processes'
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'We use the information we collect to:',
        '• Operate and improve the platform',
        '• Verify accounts and facilitate user matching',
        '• Process payments, escrow deposits, and wallet funding',
        '• Communicate with you about projects, updates, support issues, or promotions',
        '• Offer dispute resolution support and ensure platform integrity',
        '• Analyze trends and improve performance across all devices'
      ]
    },
    {
      id: 'wallet-payment-security',
      title: 'Wallet & Payment Security',
      icon: CreditCard,
      content: [
        'All payments on A-List Home Pros are securely handled through our escrow wallet system. You may fund your wallet by:',
        '• ACH bank transfer',
        '• Debit or credit card',
        '• Personal home improvement loan (subject to third-party approval)',
        '',
        'We use National Bank Card Services to securely process all payment methods. Your card or bank information is never stored on our servers.'
      ]
    },
    {
      id: 'sharing-disclosure',
      title: 'Sharing and Disclosure',
      icon: Shield,
      content: [
        'We do not sell or rent your personal information. We may share information with:',
        '• Payment processors and escrow partners',
        '• Customer support, marketing, and analytics service providers',
        '• Lenders and funding partners, when you request a loan',
        '• Government or legal authorities, when required by law',
        '• A successor entity in the case of a merger, acquisition, or sale'
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      icon: Eye,
      content: [
        'We use cookies and similar technologies to maintain your session, remember preferences, and understand how users interact with our platform. You can disable cookies in your browser, but doing so may limit some features.'
      ]
    },
    {
      id: 'data-retention-security',
      title: 'Data Retention and Security',
      icon: Lock,
      content: [
        'We retain your data for as long as your account is active or as needed to comply with legal obligations. Your data is stored on secure, encrypted servers and only accessible to authorized personnel.',
        '',
        'We implement safeguards to protect your information against unauthorized access, disclosure, or misuse. However, no system is completely immune to risk, so we encourage users to keep passwords secure and monitor account activity.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: CheckCircle,
      content: [
        'You have the right to access, correct, or delete your personal data. You may also request that we stop processing your information or provide a portable copy. To make a privacy request, contact us at legal@alisthomepros.com.',
        '',
        'We respond to all verified requests within 30 days.'
      ]
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Policy',
      icon: FileText,
      content: [
        'We may update this Privacy Policy to reflect changes in our practices, services, or legal obligations. Any updates will be posted on this page with the revised date. Continued use of the platform after a policy update indicates your acceptance of those changes.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 p-4 rounded-full">
                <Shield className="h-12 w-12 text-primary-600" />
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center text-gray-600 mb-6">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-lg">Last Updated: July 2025</span>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A-List Home Pros ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, share, and safeguard your data when you use our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="font-heading font-bold text-2xl text-dark-900 mb-6">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h2 className="font-heading font-bold text-2xl lg:text-3xl text-dark-900">
                    {section.title}
                  </h2>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  {section.content.map((paragraph, pIndex) => {
                    if (paragraph === '') {
                      return <div key={pIndex} className="h-4" />;
                    }
                    
                    if (paragraph.startsWith('•')) {
                      return (
                        <div key={pIndex} className="flex items-start mb-3">
                          <div className="bg-primary-100 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-primary-600 rounded-full" />
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {paragraph.substring(2)}
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 p-4 rounded-full">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h2 className="font-heading font-bold text-2xl text-dark-900 mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your personal information, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:legal@alisthomepros.com"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                legal@alisthomepros.com
              </a>
              <span className="text-gray-500">We respond within 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}