'use client';

import Link from 'next/link';
import {
  ArrowRight, Shield, Eye, Lock, Users, CreditCard, FileText,
  CheckCircle, Mail, AlertTriangle, Database, Globe, RefreshCw, Baby
} from 'lucide-react';
import { APP_GATEWAY_URL, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/site';

const sections = [
  {
    id: 'overview',
    icon: Eye,
    title: '1. What This Policy Covers',
    body: `A-List Home Professionals, LLC ("A-List," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal data when you use our platform — including the website, mobile application, and any related services.

This policy applies to all users: A-List Clients (Property Owners), A-List Home Pros, A-List Crew Members, A-List Specialists, and Referral Partners.`,
  },
  {
    id: 'data-collected',
    icon: Database,
    title: '2. Information We Collect',
    subsections: [
      {
        label: 'Identity Information',
        bullets: ['Name', 'Email address', 'Phone number', 'Business name'],
      },
      {
        label: 'Profile Data',
        bullets: ['Portfolio photos', 'Trade licenses and certifications', 'Work history', 'Reviews and ratings'],
      },
      {
        label: 'Financial Information',
        bullets: ['Payment details submitted through our payment processor', 'Transaction records (amounts, dates, status)'],
        warning: 'A-List does not store full card numbers or bank account details.',
      },
      {
        label: 'Project Data',
        bullets: ['Project descriptions', 'Budgets', 'Timelines', 'Milestones'],
      },
      {
        label: 'Communication Data',
        bullets: ['Messages between users', 'Messages with support'],
      },
      {
        label: 'Usage Data',
        bullets: ['Device type', 'IP address', 'Browser type', 'Pages visited', 'Platform interactions'],
      },
      {
        label: 'Location Data',
        bullets: ['General location (city, zip code, or region)', 'Used to match users with relevant professionals in target markets such as South Florida'],
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: Users,
    title: '3. How We Use Your Information',
    body: 'We use your data to:',
    bullets: [
      'Verify identity and onboard users.',
      'Match property owners with professionals, crew, and specialists.',
      'Facilitate payments through the Project Funds Account.',
      'Enable communication within the platform.',
      'Provide customer support and resolve disputes.',
      'Send platform updates, alerts, and notifications.',
      'Improve platform performance and user experience.',
      'Analyze usage trends (aggregated and anonymized where possible).',
      'Comply with legal and regulatory obligations.',
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: '4. Payments & Financial Data',
    body: 'All payment processing is handled by third-party providers supporting the Project Funds Account system. Payments may include ACH, debit card, credit card, or financing. Data is transmitted securely using industry-standard encryption.',
    bullets: [
      'A-List Home Professionals, LLC does not store sensitive financial data.',
      'Only retains transaction records necessary for account management, dispute resolution, and compliance.',
    ],
  },
  {
    id: 'sharing',
    icon: Globe,
    title: '5. Who We Share Your Data With',
    subsections: [
      {
        label: 'Other Platform Users',
        bullets: ['Only the information necessary to complete projects or business relationships.'],
      },
      {
        label: 'Payment Processors',
        bullets: ['To facilitate Project Funds Account transactions.'],
      },
      {
        label: 'Service Providers',
        bullets: ['Customer support tools', 'Platform infrastructure providers', 'Operational partners'],
      },
      {
        label: 'Analytics Providers',
        bullets: ['Data is anonymized and aggregated', 'Used strictly for platform improvement'],
      },
      {
        label: 'Legal Authorities',
        bullets: ['When required by law, subpoena, or regulatory obligation.'],
      },
      {
        label: 'Business Transfers',
        bullets: ['In the event of a merger, acquisition, or sale of assets.'],
      },
    ],
  },
  {
    id: 'no-sale',
    icon: Shield,
    title: '6. We Do Not Sell Your Data',
    body: 'A-List Home Professionals, LLC does not sell, rent, or trade your personal information to third parties. Your data is used solely to operate the platform, improve services, and support your experience as a member of the network.',
  },
  {
    id: 'cookies',
    icon: Eye,
    title: '7. Cookies & Tracking Technologies',
    body: 'We use cookies and similar technologies to keep users logged in, remember preferences, and understand platform usage. You may disable cookies in your browser, but this may limit functionality.',
    bullets: [
      'We do not use cookies for third-party advertising tracking.',
    ],
  },
  {
    id: 'retention',
    icon: Database,
    title: '8. Data Retention',
    body: 'We retain your data while your account is active, and as required for legal, financial, or dispute purposes. Retention period may extend up to 7 years where necessary.',
    bullets: [
      'You may request deletion of your data, subject to legal obligations.',
    ],
  },
  {
    id: 'rights',
    icon: CheckCircle,
    title: '9. Your Rights',
    body: 'You have the right to:',
    bullets: [
      'Access your personal data.',
      'Correct inaccurate information.',
      'Request deletion of your data.',
      'Request portability of your data.',
      'Object to certain processing activities.',
      'All verified requests are processed within 30 days.',
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: '10. Data Security',
    body: 'We implement industry-standard security measures including TLS encryption, secure servers, access controls, and routine system monitoring.',
    warning: 'No system is 100% secure, but we take all reasonable measures to protect your data. If you suspect unauthorized access, contact us immediately.',
  },
  {
    id: 'minors',
    icon: Baby,
    title: '11. Children & Minor Data',
    body: 'The platform is intended for users 18 and older. However:',
    bullets: [
      'Users aged 16–17 may participate as Referral Partners only.',
      'Parental or legal guardian consent is required.',
      'Parent or guardian is responsible for all data and activity.',
      'We do not knowingly collect data from users under 16.',
    ],
  },
  {
    id: 'updates',
    icon: RefreshCw,
    title: '12. Policy Updates',
    body: 'We may update this Privacy Policy periodically. When updates occur, users may be notified via email or in-app notification. Continued use of the platform constitutes acceptance. The Effective Date at the top reflects the latest version.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <div className="bg-gray-950 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <Lock className="w-4 h-4" /> Privacy Policy
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Your Privacy Matters.
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            A-List Home Professionals, LLC — Version 2.0
          </p>
          <p className="mt-4 text-white/40 text-sm font-bold uppercase tracking-widest">
            Effective Date: April 9, 2026
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">Table of Contents</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-20 space-y-16">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} id={section.id} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
              </div>

              <div className="pl-14 space-y-4">
                {section.body && section.body.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{para}</p>
                ))}

                {section.warning && (
                  <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-800 dark:text-amber-300 font-bold text-sm leading-relaxed">{section.warning}</p>
                  </div>
                )}

                {section.bullets && (
                  <ul className="space-y-3">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && section.subsections.map((sub, si) => (
                  <div key={si} className="mt-6 border-l-2 border-primary-100 dark:border-primary-900 pl-5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{sub.label}</h3>
                    {sub.warning && (
                      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-amber-800 dark:text-amber-300 font-bold text-xs leading-relaxed">{sub.warning}</p>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {sub.bullets.map((bullet, bi) => (
                        <li key={bi} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-primary-500 shrink-0 mt-1" />
                          <span className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-8 h-8 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Privacy Questions?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            To submit a data access, correction, or deletion request — contact our team directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all">
              <Mail className="w-5 h-5" />
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-black hover:border-gray-400 transition-all">
              {CONTACT_PHONE}
            </a>
          </div>
          <p className="mt-4 text-gray-400 text-sm font-medium">All verified requests are processed within 30 days.</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h3 className="text-4xl font-black tracking-tighter mb-4">Enter the Network with Confidence</h3>
          <p className="text-primary-100 font-medium mb-8 text-lg">
            Your data is protected. Your connections are real. South Florida's private home service network is waiting.
          </p>
          <Link
            href={APP_GATEWAY_URL}
            target="_blank"
            className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-50 transition-all"
          >
            Enter the Network
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>
  );
}