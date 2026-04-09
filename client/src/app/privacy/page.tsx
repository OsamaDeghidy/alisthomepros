'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Eye, Lock, Users, CreditCard, FileText, CheckCircle, Mail } from 'lucide-react';
import { APP_GATEWAY_URL, CONTACT_EMAIL, PAYMENTS_PROVIDER_NAME } from '@/config/site';

const sections = [
  {
    id: 'overview',
    icon: Eye,
    title: '1. What This Policy Covers',
    body: `A-List Home Professionals ("A-List," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal data when you use our platform — including the website, mobile app, and any related services.

This policy applies to all user types: Homeowners, Home Pros, Crew Members, Specialists, and Referral Partners.`
  },
  {
    id: 'data-collected',
    icon: FileText,
    title: '2. Information We Collect',
    bullets: [
      'Identity information: name, email address, phone number, business name.',
      'Profile data: portfolio photos, trade licenses, certifications, work history, and user-generated reviews.',
      'Financial information: bank account or card details for funding your Project Funds Account (processed securely — never stored on our servers).',
      'Project data: descriptions, budgets, timelines, and milestones you enter on the platform.',
      'Communication data: messages exchanged with other users or our support team.',
      'Usage data: device type, IP address, browser, pages visited, and platform interactions.',
      'Location data: general area or zip code to match you with relevant professionals in South Florida.'
    ]
  },
  {
    id: 'how-we-use',
    icon: Users,
    title: '3. How We Use Your Information',
    bullets: [
      'To verify your identity and onboard you into the network.',
      'To match homeowners with the right professionals, crew, or specialists.',
      'To process payments through the Project Funds Account system.',
      'To facilitate communication within the platform.',
      'To provide customer support and resolve disputes.',
      'To send you relevant updates, notifications, and platform announcements.',
      'To analyze usage patterns and improve the platform experience.',
      'To comply with legal obligations.'
    ]
  },
  {
    id: 'payments-security',
    icon: CreditCard,
    title: '4. Payments & Financial Data',
    body: `All payment processing is handled by ${PAYMENTS_PROVIDER_NAME}. When you fund your Project Funds Account via ACH, debit card, credit card, or home improvement financing, your financial data is transmitted directly to our payment processor using industry-standard encryption.

A-List does not store your full card numbers or bank account details on our servers. We only retain transaction records (amounts, dates, status) necessary for account management and dispute resolution.`
  },
  {
    id: 'data-sharing',
    icon: Shield,
    title: '5. Who We Share Your Data With',
    bullets: [
      'Other platform users — only the information needed to facilitate your project or business relationship.',
      'Payment processors and financial service partners who power the Project Funds Account system.',
      'Customer support and platform operations vendors who assist in running A-List.',
      'Analytics providers (data is anonymized and aggregated).',
      'Law enforcement or legal authorities when required by applicable law.',
      'A successor entity in the event of a business merger, acquisition, or sale.'
    ]
  },
  {
    id: 'no-sale',
    icon: Lock,
    title: '6. We Do Not Sell Your Data',
    body: `A-List does not sell, rent, or trade your personal information to third-party advertisers. Your data is used solely to operate and improve the platform and to serve you as a member of the network.`
  },
  {
    id: 'cookies',
    icon: Eye,
    title: '7. Cookies & Tracking',
    body: `We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how users interact with the platform. You can disable cookies in your browser settings, but doing so may limit certain features.

We do not use tracking for third-party advertising purposes.`
  },
  {
    id: 'data-retention',
    icon: FileText,
    title: '8. How Long We Keep Your Data',
    body: `We retain your account data for as long as your account is active, or as required by applicable law. If you close your account, we may retain certain records for legal, financial, or dispute-related purposes for up to 7 years.

You may request deletion of your personal data at any time (subject to legal retention requirements) by contacting our support team.`
  },
  {
    id: 'your-rights',
    icon: CheckCircle,
    title: '9. Your Rights',
    bullets: [
      'Access: Request a copy of the personal data we hold about you.',
      'Correction: Ask us to correct inaccurate or outdated information.',
      'Deletion: Request removal of your data where legally permitted.',
      'Portability: Receive your data in a portable format.',
      'Objection: Opt out of certain data processing activities.',
      'All requests are responded to within 30 days.'
    ]
  },
  {
    id: 'security',
    icon: Lock,
    title: '10. Data Security',
    body: `We use industry-standard security measures including TLS encryption, access controls, and regular audits to protect your data. While no system is 100% immune to risk, we take every reasonable precaution to safeguard your information.

If you suspect unauthorized access to your account, contact us immediately at ${CONTACT_EMAIL}.`
  },
  {
    id: 'updates',
    icon: FileText,
    title: '11. Policy Updates',
    body: `We may update this Privacy Policy as our platform evolves. When we do, we'll notify active users by email or in-app notification. Continued use of the platform after an update constitutes your acceptance of the revised policy. The effective date is always displayed at the top of this page.`
  }
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
            We built A-List on trust. Here's exactly how we collect, use, and protect your data inside the network.
          </p>
          <p className="mt-6 text-white/40 text-sm font-bold uppercase tracking-widest">
            Effective Date: July 1, 2025
          </p>
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
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
              </div>

              {section.body && (
                <div className="pl-14 space-y-4">
                  {section.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{para}</p>
                  ))}
                </div>
              )}

              {section.bullets && (
                <ul className="pl-14 space-y-3">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
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
            To submit a data request or ask about our privacy practices, contact our team directly.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all"
          >
            <Mail className="w-5 h-5" />
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 text-gray-400 text-sm font-medium">We respond to all privacy requests within 30 days.</p>
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