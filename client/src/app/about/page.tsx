'use client';

import Link from 'next/link';
import { Shield, Award, Target, Heart, Check, X } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'We Work Within Your Budget',
      description: 'We do our best to keep your project within budget while delivering quality results. If anything changes, we communicate clearly and never move forward without your approval.'
    },
    {
      icon: Shield,
      title: 'Trusted Professionals',
      description: 'We partner with experienced pros and skilled crew members who are reviewed and rated for their work. We strive to connect you with reliable talent you can feel good about hiring.'
    },
    {
      icon: Award,
      title: 'Commitment to Quality',
      description: 'We stand behind the work performed through our platform. If something doesn\'t meet expectations, we\'ll help make it right.'
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Our system connects you with the right professionals for your project based on skills, availability, and job fit.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'We care about your experience. From the first request to final cleanup, we prioritize clear communication, accountability, and support every step of the way.'
    }
  ];

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
      ]
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
      ]
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
      ]
    },
    {
      name: 'Home Pro – Premium',
      description: 'For high-performing contractors who want full visibility and marketing power',
      price: '$275/month',
      features: [
        { text: 'Priority lead placement', included: true },
        { text: 'Featured profile listing', included: true },
        { text: 'Custom portfolio builder', included: true },
        { text: 'Lead generation tools', included: true },
        { text: 'Team management access', included: true },
        { text: 'White-label branding', included: true },
        { text: 'Premium customer support', included: true }
      ]
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
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I post my first project?',
      answer: 'Click "Post Project" at the top of the homepage, fill in your project details, and publish it. You\'ll start receiving proposals from qualified professionals based on your location and project scope.'
    },
    {
      question: 'How do I find the right professional?',
      answer: 'Browse profiles, read reviews, view portfolios, and compare proposals. Our system helps you make the best decision based on experience, location, and your specific needs.'
    },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-6xl text-dark-900 mb-6">
              A-List Home Pros
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your trusted source for verified home improvement professionals. We connect homeowners with licensed pros, skilled crews, and experienced specialists to get the job done right — on time and within budget.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                At A-List Home Pros, we know how important it is to stick to a budget — and we take that seriously. Since launching in 2019, our mission has been to help homeowners find skilled, verified professionals who can get the job done right without breaking the bank.
              </p>
              <p>
                We built this platform after experiencing the frustrations ourselves — shady contractors, surprise costs, and poor communication. So we created something better: a system that prioritizes transparency, trust, and real protection for homeowners.
              </p>
              <p>
                We always aim to keep projects within your set budget, and in most cases, we do. But when unexpected changes come up whether it's materials, permits, or structural issues — we communicate clearly, adjust responsibly, and never move forward without your approval. No pressure. No surprises.
              </p>
              <p>
                Today, A-List Home Pros is a growing network of reliable contractors, skilled crews, and experienced specialists who value your time, your home, and your wallet. We're here to make sure the job gets done the right way with honesty, quality, and your peace of mind in place from start to finish.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A-List Home Pros was built with homeowners in mind. Every decision we make is rooted in trust, quality, and respect for your investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl mr-4">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-dark-900">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Subscription Plans */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Professional Subscription Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Choose the plan that fits your level of growth. Whether you're just getting listed or ready to expand, we've got a plan for you. All payments are securely processed through National Bank Card Services — no hidden fees, no guesswork.
            </p>
            
            {/* Why Choose A-List Plans */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-12">
              <h3 className="font-heading font-bold text-2xl text-dark-900 mb-6">
                Why Choose A-List Plans?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-lg text-dark-900 mb-2">Fast Setup</h4>
                  <p className="text-gray-600">Create your listing or activate your plan in just minutes.</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg text-dark-900 mb-2">Secure Payments</h4>
                  <p className="text-gray-600">All subscriptions are processed safely through National Bank Card Services.</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg text-dark-900 mb-2">Support When You Need It</h4>
                  <p className="text-gray-600">Our team is here to help with real answers in real time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Options */}
          <div className="space-y-8">
            {plans.map((plan, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-dark-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{plan.description}</p>
                    <div className="text-3xl font-bold text-primary-600">{plan.price}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
                Getting Started
              </h3>
              <div className="space-y-6">
                {faqs.slice(0, 2).map((faq, index) => (
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

            <div>
              <h3 className="font-heading font-bold text-2xl text-dark-900 mb-8">
                Subscription FAQ
              </h3>
              <div className="space-y-6">
                {faqs.slice(2).map((faq, index) => (
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
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-dark-900 mb-6">
              Ready to join our community?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you're a homeowner looking for professionals or a professional looking to grow your business, 
              we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/post-project"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200"
              >
                Post Your Project
              </Link>
              <Link
                href="/register"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Join as Professional
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}