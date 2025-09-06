'use client';

import { useState } from 'react';
import { Search, MessageCircle, Phone, Mail } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I post my first project?',
          answer: 'Click "Post Project" in the header, fill out the project details form, and publish it to start receiving proposals from professionals.'
        },
        {
          question: 'How do I find the right professional?',
          answer: 'Browse professional profiles, read reviews, check portfolios, and compare proposals to find the best match for your project.'
        }
      ]
    },
    {
      title: 'Payments & Billing',
      faqs: [
        {
          question: 'How do payments work?',
          answer: 'We use a secure escrow system. Funds are held safely and released to professionals upon milestone completion or project delivery.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.'
        }
      ]
    },
    {
      title: 'Safety & Trust',
      faqs: [
        {
          question: 'Are professionals verified?',
          answer: 'Yes, all professionals undergo background checks, license verification, and insurance validation before joining our platform.'
        },
        {
          question: 'What if I\'m not satisfied with the work?',
          answer: 'We offer dispute resolution services and our satisfaction guarantee protects you in case of unsatisfactory work.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-dark-900 mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the help you need.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="font-heading font-bold text-3xl text-dark-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="font-heading font-semibold text-xl text-dark-900 mb-6">
                    {category.title}
                  </h3>
                  <div className="space-y-6">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
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
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-heading font-semibold text-xl text-dark-900 mb-6">
                Still Need Help?
              </h3>
              <div className="space-y-4">
                <a 
                  href="/contact"
                  className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
                >
                  <MessageCircle className="h-6 w-6 text-primary-600" />
                  <div>
                    <div className="font-medium text-primary-700">Contact Support</div>
                    <div className="text-sm text-primary-600">Send us a message</div>
                  </div>
                </a>
                
                <a 
                  href="tel:+15551234567"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Phone className="h-6 w-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-700">Call Us</div>
                    <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                  </div>
                </a>
                
                <a 
                  href="mailto:support@alisthomepros.com"
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Mail className="h-6 w-6 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-700">Email Us</div>
                    <div className="text-sm text-gray-600">support@alisthomepros.com</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-heading font-semibold text-xl text-dark-900 mb-4">
                Popular Articles
              </h3>
              <div className="space-y-3">
                <a href="#" className="block text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  How to write a great project description
                </a>
                <a href="#" className="block text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  Tips for choosing the right professional
                </a>
                <a href="#" className="block text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  Understanding our payment protection
                </a>
                <a href="#" className="block text-primary-600 hover:text-primary-700 transition-colors duration-200">
                  How to leave effective reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 