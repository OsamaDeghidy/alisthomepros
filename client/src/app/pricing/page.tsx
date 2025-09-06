'use client';

import Link from 'next/link';
import { Check, X, Star, Crown, Zap, Shield, Phone, Home, Users, Settings, CreditCard, HelpCircle, MessageCircle } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Freemium Plan',
      description: 'For new pros and crews who just want to list their business',
      price: '$0/month',
      features: [
        { text: 'Business listed in the A-List directory', included: true },
        { text: 'No access to messaging', included: false },
        { text: 'No lead generation', included: false },
        { text: 'No marketing or app tools', included: false }
      ],
      buttonText: 'Get Started Free',
      buttonClass: 'bg-gray-500 text-white hover:bg-gray-600'
    },
    {
      name: 'Crew Member – Basic',
      description: 'Perfect for individual subcontractors and field workers',
      price: '$90/month',
      features: [
        { text: 'On-demand job access', included: true },
        { text: 'Portfolio upload', included: true },
        { text: 'Skill verification badge', included: true },
        { text: 'Crew directory listing', included: true },
        { text: 'In-app messaging', included: true },
        { text: 'Mobile access', included: true }
      ],
      buttonText: 'Join as Crew Member',
      buttonClass: 'bg-blue-500 text-white hover:bg-blue-600'
    },
    {
      name: 'Home Pro – Basic',
      description: 'For growing contractors or service providers',
      price: '$150/month',
      features: [
        { text: 'Access to homeowner project leads', included: true },
        { text: 'Customer rating system', included: true },
        { text: 'Basic marketing tools', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Payment processing', included: true }
      ],
      buttonText: 'Start Basic Plan',
      buttonClass: 'bg-primary-500 text-white hover:bg-primary-600'
    },
    {
      name: 'Home Pro – Premium',
      description: 'For high-performing contractors who want full visibility and marketing power',
      price: '$275/month',
      popular: true,
      features: [
        { text: 'Priority lead placement', included: true },
        { text: 'Featured profile listing', included: true },
        { text: 'Custom portfolio builder', included: true },
        { text: 'Lead generation tools', included: true },
        { text: 'Team management access', included: true },
        { text: 'White-label branding', included: true },
        { text: 'Premium customer support', included: true }
      ],
      buttonText: 'Go Premium',
      buttonClass: 'bg-primary-600 text-white hover:bg-primary-700'
    },
    {
      name: 'Specialist Plan',
      description: 'For project managers, homeowner reps, or site coordinators',
      price: '$60/month',
      features: [
        { text: 'Project management suite', included: true },
        { text: 'Task coordination', included: true },
        { text: 'Communication hub', included: true },
        { text: 'Role-based dashboard access', included: true },
        { text: 'Resource tracking', included: true },
        { text: 'Scheduling tools', included: true },
        { text: 'Client relationship features', included: true }
      ],
      buttonText: 'Become a Specialist',
      buttonClass: 'bg-secondary-500 text-white hover:bg-secondary-600'
    }
  ];

  const subscriptionFaqs = [
    {
      question: 'Is there a free trial?',
      answer: 'We don\'t offer a free trial, but you can create a free business listing to get started. Free listings give you visibility in our directory, but you won\'t have access to premium features like messaging, lead access, or marketing tools. Upgrade anytime when you\'re ready to grow.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes. You can upgrade or downgrade your subscription at any time. Changes will be prorated on your next billing cycle.'
    },
    {
      question: 'What happens if I cancel?',
      answer: 'You can cancel at any time. You\'ll keep your plan benefits through the end of your current billing period, and your listing will remain visible in our directory unless removed.'
    }
  ];

  const gettingStartedFaqs = [
    {
      question: 'How do I post my first project?',
      answer: 'Click "Post Project" at the top of the homepage, fill in your project details, and publish it. You\'ll start receiving proposals from qualified professionals based on your location and project scope.'
    },
    {
      question: 'How do I find the right professional?',
      answer: 'Browse profiles, read reviews, view portfolios, and compare proposals. Our system helps you make the best decision based on experience, location, and your specific needs.'
    }
  ];

  const paymentsFaqs = [
    {
      question: 'How do payments work?',
      answer: 'All payments go through our secure escrow system. You fund your wallet, and we hold those funds safely until work is completed and approved. Only then are funds released to the professional.'
    },
    {
      question: 'How do I fund my A-List Wallet?',
      answer: 'You have three options: 1. ACH transfer using your bank account and routing number 2. Debit or credit card 3. Apply for a personal home improvement loan through one of our lender partners (approval based on credit). You can access all funding options directly from your client dashboard.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept major debit and credit cards, ACH transfers, and bank payments processed securely through National Bank Card Services.'
    }
  ];

  const subscriptionListingsFaqs = [
    {
      question: 'Is there a free plan available?',
      answer: 'Yes. You can create a free listing on our directory with no monthly fee. However, free users cannot access features like lead requests, direct messaging, proposal submissions, or marketing tools.'
    },
    {
      question: 'Can I upgrade later?',
      answer: 'Yes. You can upgrade or downgrade your plan at any time. If you upgrade mid-cycle, changes will be prorated on your next billing.'
    },
    {
      question: 'What happens if I cancel my subscription?',
      answer: 'You\'ll retain access to premium features until your current billing cycle ends. Your listing will remain in the directory unless you choose to remove it.'
    }
  ];

  const safetyTrustFaqs = [
    {
      question: 'Are professionals verified?',
      answer: 'We aim to vet all professionals on the platform, but verification levels vary. Some users may be fully licensed and insured, while others are skilled tradespeople building their portfolios. We show credentials where available and encourage all clients to review each pro\'s profile and history.'
    },
    {
      question: 'Can I request license or insurance info from a pro?',
      answer: 'Yes. You can request documentation directly through the messaging system or during your vetting process.'
    }
  ];

  const satisfactionDisputesFaqs = [
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'We offer a dispute resolution process to review complaints and mediate issues between clients and professionals. Your funds are held in escrow until you\'re satisfied or a resolution is reached. We also have a satisfaction guarantee on verified milestone payments.'
    }
  ];

  const supportContactFaqs = [
    {
      question: 'How can I contact support?',
      answer: 'You can message us directly through your dashboard, call us, or email: • 📞 Call: +1 (XXX) XXX-XXXX • 📧 Email: support@alisthomepros.com • 💬 Live Chat: Available inside your account dashboard'
    }
  ];

  const platformFeaturesFaqs = [
    {
      question: 'What\'s the difference between Crew, Home Pro, and Specialist roles?',
      answer: '• Crew Members are subcontractors available for hire on demand • Home Pros are licensed contractors or companies offering services • Specialists act as project managers or client representatives who help coordinate and oversee your job'
    },
    {
      question: 'What tools do paid members get access to?',
      answer: 'Depending on your plan, features include lead generation, messaging, project dashboards, marketing toolkits, analytics, payment tools, client management systems, and more. Visit the Subscription Plans page for full details.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Professional Subscription Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Choose the plan that fits your level of growth. Whether you're just getting listed or ready to expand, we've got a plan for you. All payments are securely processed through National Bank Card Services — no hidden fees, no guesswork.
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <Shield className="h-5 w-5" />
              <span>Secure payments powered by National Bank Card Services</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-dark-900 mb-4">
            Plan Options
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg border ${plan.popular ? 'border-primary-500 transform scale-105' : 'border-gray-200'} p-8`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="font-heading font-bold text-2xl text-dark-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-primary-600">{plan.price}</div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-500'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${plan.buttonClass}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose A-List Plans */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-dark-900 mb-4">
              Why Choose A-List Plans?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg text-dark-900 mb-2">Fast Setup</h3>
              <p className="text-gray-600">Create your listing or activate your plan in just minutes.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg text-dark-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">All subscriptions are processed safely through National Bank Card Services.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-lg text-dark-900 mb-2">Support When You Need It</h3>
              <p className="text-gray-600">Our team is here to help with real answers in real time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Subscription FAQ */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Subscription FAQ
            </h3>
            <div className="space-y-6">
              {subscriptionFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Getting Started
            </h3>
            <div className="space-y-6">
              {gettingStartedFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payments & Wallet Funding */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Payments & Wallet Funding
            </h3>
            <div className="space-y-6">
              {paymentsFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription & Listings */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Subscription & Listings
            </h3>
            <div className="space-y-6">
              {subscriptionListingsFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Trust */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Safety & Trust
            </h3>
            <div className="space-y-6">
              {safetyTrustFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction & Disputes */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Satisfaction & Disputes
            </h3>
            <div className="space-y-6">
              {satisfactionDisputesFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Support & Contact
            </h3>
            <div className="space-y-6">
              {supportContactFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform & Features */}
          <div>
            <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
              Platform & Features
            </h3>
            <div className="space-y-6">
              {platformFeaturesFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-lg text-dark-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl text-dark-900 mb-4">
            Ready to Start Your Subscription?
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of professionals growing their business with A-List Home Pros subscription plans
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2" />
              Start Your Subscription
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}