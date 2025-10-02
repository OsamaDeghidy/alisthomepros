import Link from 'next/link';
import { Shield, Award, Target, Heart, Check, X } from 'lucide-react';
import { PAYMENTS_STORY, PAYMENTS_PROVIDER_NAME } from '@/config/site';
import { Metadata } from 'next';
import JsonLdSchema from '../components/JsonLdSchema';

export const metadata: Metadata = {
  title: 'About Us | A-List Home Professionals',
  description: 'Learn about A-List Home Professionals, our mission, values, and how we connect homeowners with trusted home improvement experts.',
  keywords: 'about us, home professionals, mission, values, team, history',
  openGraph: {
    title: 'About A-List Home Professionals',
    description: 'Learn about our mission to connect homeowners with trusted home improvement experts',
    url: 'https://alisthomepros.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About A-List Home Professionals',
    description: 'Learn about our mission to connect homeowners with trusted home improvement experts',
  },
};

export default function AboutPage() {
  const whyChooseUs = [
    {
      icon: Target,
      title: 'Comprehensive Coverage',
      description: 'From new construction to essential repairs, we connect you with professionals across every area of construction and home improvement.'
    },
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All our professionals are background-checked, licensed, and insured to ensure you work with trusted experts you can rely on.'
    },
    {
      icon: Award,
      title: 'Secure Payments (escrow)',
      description: 'Our secure escrow system protects your funds until work is completed and approved, giving you peace of mind throughout the project.'
    },
    {
      icon: Heart,
      title: 'Fair Opportunities for all roles',
      description: 'We provide equal opportunities for clients, home pros, crew members, and specialists to succeed and grow within our platform.'
    },
    {
      icon: Target,
      title: 'Customer Confidence',
      description: 'Our transparent review system and quality assurance processes ensure you can hire with confidence every time.'
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
        { text: 'Advanced analytics dashboard', included: true },
        { text: 'Priority customer support', included: true },
        { text: 'Marketing automation tools', included: true }
      ]
    }
  ];

  return (
    <>
      <JsonLdSchema type="organization" />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About A-List Home Professionals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the home improvement industry by connecting homeowners 
            with trusted professionals through our comprehensive platform.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose A-List Home Professionals?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Pricing Plans
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-2xl font-bold text-primary-600 mb-6">{plan.price}</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-3" />
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              At A-List Home Professionals, we believe that every homeowner deserves access to 
              reliable, skilled professionals for their home improvement needs. Our platform 
              bridges the gap between homeowners and trusted contractors, creating opportunities 
              for growth and success for everyone involved.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
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
    </>
  );
}