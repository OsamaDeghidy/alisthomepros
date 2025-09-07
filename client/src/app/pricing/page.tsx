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
        { text: 'Access to homeowner project leads', included: true },
        { text: 'Customer rating system', included: true },
        { text: 'Basic marketing tools', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Payment processing', included: true },
        { text: 'Priority lead placement', included: true },
        { text: 'Featured profile listing', included: true },
        { text: 'Custom portfolio builder', included: true },
        { text: 'Lead generation tools', included: true },
        { text: 'Team management access', included: true }
      ],
      buttonText: 'Go Premium',
      buttonClass: 'bg-primary-600 text-white hover:bg-primary-700'
    },
    {
      name: 'Specialist Plan',
      description: 'For project managers, homeowner reps, or site coordinators',
      price: '$60/month',
      features: [
        { text: 'Project Management Suite (tools for managing entire project flow, tasks, and milestones)', included: true },
        { text: 'Task Coordination (assigning/tracking tasks for crews & pros)', included: true },
        { text: 'Communication Hub (centralized messaging/updates)', included: true },
        { text: 'Role-Based Dashboard Access (different visibility by role)', included: true },
        { text: 'Scheduling Tools (calendar/project timeline integration)', included: true },
        { text: 'Client Relationship Features (log client requests, update status, maintain history)', included: true }
      ],
      buttonText: 'Become a Specialist',
      buttonClass: 'bg-secondary-500 text-white hover:bg-secondary-600'
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




    </div>
  );
}