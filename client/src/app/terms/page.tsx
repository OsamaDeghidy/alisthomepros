'use client';

import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, AlertTriangle, CreditCard, Users, FileText, Lock, Scale } from 'lucide-react';
import { APP_GATEWAY_URL, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/site';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    body: `By accessing or using the A-List Home Professionals platform — whether via our website, mobile app, or any related services — you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. These terms apply to all users: Homeowners, Home Pros, Crew Members, Specialists, and Referral Partners.`
  },
  {
    id: 'platform-overview',
    icon: Shield,
    title: '2. What A-List Does',
    body: `A-List Home Professionals is a private network connecting homeowners with verified home service professionals, skilled crew members, project specialists, and referral partners across South Florida. We provide tools for posting projects, hiring vetted professionals, funding work through our Project Funds Account system, communicating within the network, and managing jobs end-to-end inside the A-List app.

We are a marketplace and technology provider — not a contractor of record. All service agreements are between the homeowner and the professional.`
  },
  {
    id: 'user-roles',
    icon: Users,
    title: '3. User Roles & Responsibilities',
    bullets: [
      'Homeowners: Post real projects, fund them through the Project Funds Account, release payments only when milestones are met.',
      'Home Pros: Represent your business honestly, maintain valid licenses and insurance, deliver work as agreed.',
      'Crew Members: Provide skilled, professional labor as committed on each job.',
      'Specialists: Coordinate projects and represent homeowners or pros with full transparency.',
      'Referral Partners: Refer genuine users into the network and earn commissions per the referral terms.'
    ]
  },
  {
    id: 'project-funds',
    icon: CreditCard,
    title: '4. Project Funds Account',
    body: `All payments on the platform are processed through our secure Project Funds Account system. Funds are held and only released when a client confirms that work has been completed or a milestone has been met.

You may fund your account via ACH bank transfer, debit card, credit card, or approved home improvement financing. A-List does not store your card or bank details — all payment data is handled by our certified payment processor.

Attempting to pay or receive payment outside the platform is a violation of these terms and may result in account termination.`
  },
  {
    id: 'conduct',
    icon: Scale,
    title: '5. Code of Conduct',
    bullets: [
      'No misrepresentation of skills, credentials, or identity.',
      'No payment circumvention — all transactions must flow through the Project Funds Account.',
      'No harassment, discrimination, or abusive communication.',
      'No fake reviews, lead manipulation, or fraudulent project postings.',
      'No soliciting clients or pros to work outside the platform.'
    ]
  },
  {
    id: 'subscriptions',
    icon: CheckCircle,
    title: '6. Memberships & Subscriptions',
    body: `A-List offers both free directory listings and paid subscription plans. Free members can create a profile but do not have access to messaging, proposals, job leads, or project tools. Paid plans unlock the full A-List network experience.

Subscriptions are billed monthly. You may cancel anytime — cancellations take effect at the end of the current billing period. We do not issue prorated refunds for unused time. Plans are limited per trade category and geographic area to maintain network quality.`
  },
  {
    id: 'disputes',
    icon: AlertTriangle,
    title: '7. Dispute Resolution',
    body: `If a dispute arises between a homeowner and a professional, A-List offers mediation through our trust and safety team. Funds in the Project Funds Account are held during the review period.

We do not guarantee specific outcomes, but we review all evidence submitted and work toward a fair resolution. Users who repeatedly file bad-faith disputes may be removed from the platform.`
  },
  {
    id: 'intellectual-property',
    icon: Lock,
    title: '8. Intellectual Property',
    body: `You retain ownership of content you upload (portfolio photos, project descriptions, reviews). By posting on the platform, you grant A-List a license to display this content to promote your services.

All platform code, design, branding, and system architecture is the exclusive property of A-List Home Professionals, Inc. Unauthorized use, copying, or reproduction is prohibited.`
  },
  {
    id: 'liability',
    icon: Shield,
    title: '9. Limitation of Liability',
    body: `A-List is a technology platform that facilitates connections. We are not liable for project outcomes, contractor performance, delays, property damage, or any loss resulting from services arranged through the network. Use of the platform is at your own risk. Our maximum liability in any dispute is limited to the fees paid to A-List in the 3 months preceding the claim.`
  },
  {
    id: 'termination',
    icon: AlertTriangle,
    title: '10. Account Termination',
    body: `You may close your account at any time. A-List reserves the right to suspend or permanently remove users who violate these terms, compromise network integrity, or engage in fraudulent behavior. Funds held in the Project Funds Account at the time of termination may be reviewed before release depending on any active disputes.`
  },
  {
    id: 'changes',
    icon: FileText,
    title: '11. Changes to These Terms',
    body: `We may update these Terms of Service periodically. Continued use of the platform after any update constitutes acceptance of the new terms. The effective date at the top of this page will always reflect the most recent revision.`
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <div className="bg-gray-950 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <Scale className="w-4 h-4" /> Legal Document
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            By using A-List Home Professionals, you agree to the following terms. Please read them carefully before entering the network.
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

      {/* Questions */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Questions About These Terms?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Reach out to our team and we'll clarify anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${CONTACT_EMAIL}`} className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all">
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="px-8 py-4 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-black hover:border-gray-400 transition-all">
              {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h3 className="text-4xl font-black tracking-tighter mb-4">Ready to Enter the Network?</h3>
          <p className="text-primary-100 font-medium mb-8 text-lg">
            South Florida's private network for serious homeowners and elite home professionals.
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