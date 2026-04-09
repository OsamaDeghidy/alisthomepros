'use client';

import Link from 'next/link';
import {
  ArrowRight, Shield, CheckCircle, AlertTriangle, CreditCard,
  Users, FileText, Lock, Scale, Briefcase, Ban, RefreshCw,
  Gavel, Globe, Edit
} from 'lucide-react';
import { APP_GATEWAY_URL, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/site';

const sections = [
  {
    id: 'acceptance',
    icon: FileText,
    title: '1. Acceptance of Terms',
    body: `By accessing or using A-List Home Professionals, LLC ("A-List," "Company," "Platform"), whether through our website, mobile application, or related services, you agree to be bound by these Terms of Service.

If you do not agree, you must not use the Platform.

These Terms apply to all users, including A-List Clients (Homeowners), A-List Home Pros, A-List Crew Members, A-List Specialists, and Referral Partners.`,
  },
  {
    id: 'platform',
    icon: Globe,
    title: '2. Platform Description',
    body: `A-List Home Professionals, LLC is a private marketplace and technology platform that connects homeowners with vetted home service professionals, skilled labor, project coordinators, and referral partners.

The Platform provides tools for posting and managing projects, connecting with professionals, facilitating payments through the Project Funds Account, and managing communications and workflow.`,
    warning: 'A-List Home Professionals, LLC is not a contractor, subcontractor, or employer. All services are performed by independent third parties.',
  },
  {
    id: 'eligibility',
    icon: Users,
    title: '3. User Eligibility',
    body: 'Users must be at least 18 years old to access and use the Platform. However:',
    bullets: [
      'Individuals aged 16–17 may participate only as Referral Partners.',
      'Minor participation requires verified parental or legal guardian consent.',
      'Minors are restricted to referral-based activity only.',
      'A-List Home Professionals, LLC reserves the right to verify age and deny access at any time.',
    ],
  },
  {
    id: 'minors',
    icon: Shield,
    title: '4. Minor Participation & Parental Responsibility',
    body: 'Users under 18 may not perform construction services, act as Home Pros, Crew Members, or Specialists, or enter into contracts with clients. Parents or legal guardians:',
    bullets: [
      'Accept full legal responsibility for the minor\'s participation.',
      'Must supervise all Platform activity.',
      'Must receive and manage all earnings.',
      'Agree to be bound by these Terms on behalf of the minor.',
    ],
  },
  {
    id: 'roles',
    icon: Briefcase,
    title: '5. User Roles & Responsibilities',
    subsections: [
      {
        label: 'A-List Clients (Homeowners)',
        bullets: ['Post legitimate projects.', 'Fund projects through the Project Funds Account.', 'Release payments only upon milestone completion.'],
      },
      {
        label: 'A-List Home Pros',
        bullets: ['Represent qualifications honestly.', 'Maintain proper licensing and insurance.', 'Deliver services as agreed.'],
      },
      {
        label: 'A-List Crew Members',
        bullets: ['Provide skilled labor professionally.', 'Fulfill agreed responsibilities on each project.'],
      },
      {
        label: 'A-List Specialists',
        bullets: ['Coordinate projects transparently.', 'Act in the best interest of involved parties.'],
      },
      {
        label: 'Referral Partners',
        bullets: ['Refer genuine users into the Platform.', 'Comply with all referral program rules.'],
      },
    ],
  },
  {
    id: 'independent',
    icon: Users,
    title: '6. Independent Relationships',
    body: 'All users operate as independent entities. Nothing in these Terms creates employment relationships, partnerships, or joint ventures. A-List Home Professionals, LLC does not control or supervise work performed by users.',
  },
  {
    id: 'funds',
    icon: CreditCard,
    title: '7. Project Funds Account',
    body: 'All payments must be processed through the Project Funds Account system. Funds are held and released based on confirmed milestones. Payment methods may include ACH, debit card, credit card, or financing. Payment processing is handled by third-party providers.',
    warning: 'A-List Home Professionals, LLC is a payment facilitator only, not a bank or escrow institution.',
  },
  {
    id: 'noncircumvention',
    icon: Ban,
    title: '8. Non-Circumvention',
    body: 'Users agree not to bypass the Platform to conduct transactions with users introduced through A-List Home Professionals, LLC. Violations may result in:',
    bullets: [
      'Immediate account termination.',
      'Forfeiture of earnings.',
      'Additional legal action if necessary.',
    ],
  },
  {
    id: 'conduct',
    icon: Shield,
    title: '9. Code of Conduct',
    body: 'Users may NOT:',
    bullets: [
      'Misrepresent identity, licensing, or qualifications.',
      'Circumvent Platform payments.',
      'Engage in harassment, discrimination, or abuse.',
      'Post fake projects, reviews, or leads.',
      'Solicit off-platform transactions.',
      'Attempt to manipulate or exploit the system.',
    ],
  },
  {
    id: 'subscriptions',
    icon: RefreshCw,
    title: '10. Memberships & Subscriptions',
    body: 'A-List Home Professionals, LLC offers free directory listings and paid subscription plans. Paid plans provide access to messaging, leads, proposals, and full platform tools.',
    bullets: [
      'Subscriptions are billed monthly.',
      'Cancellation takes effect at end of billing cycle.',
      'No prorated refunds.',
      'A-List may limit memberships by region or trade category.',
    ],
  },
  {
    id: 'referral',
    icon: Users,
    title: '11. Referral Program',
    body: 'A-List Home Professionals, LLC may offer compensation for referring new users.',
    bullets: [
      'Referral earnings are performance-based.',
      'A-List may modify or revoke commissions at any time.',
      'Fraudulent referrals will result in forfeiture.',
    ],
  },
  {
    id: 'ip',
    icon: Lock,
    title: '12. Intellectual Property',
    body: 'Users retain ownership of content they upload. However, by posting content, you grant A-List Home Professionals, LLC a license to display, promote, and distribute it. All platform elements — including code, system architecture, workflows, and branding — are the exclusive property of A-List Home Professionals, LLC. Copying, replicating, or reverse-engineering the platform is strictly prohibited.',
  },
  {
    id: 'disputes',
    icon: Scale,
    title: '13. Dispute Resolution',
    body: 'A-List Home Professionals, LLC may assist in dispute mediation between users. Funds may be held during investigation. A-List does not guarantee outcomes. Repeated bad-faith disputes may result in removal.',
  },
  {
    id: 'warranties',
    icon: AlertTriangle,
    title: '14. Disclaimer of Warranties',
    body: 'The Platform is provided "AS IS" and "AS AVAILABLE." A-List Home Professionals, LLC makes no guarantees regarding project success, user performance, or availability of opportunities.',
  },
  {
    id: 'liability',
    icon: Shield,
    title: '15. Limitation of Liability',
    body: 'To the fullest extent permitted by law, A-List Home Professionals, LLC is not liable for damages arising from user interactions. Maximum liability is limited to fees paid to A-List Home Professionals, LLC in the past 3 months.',
  },
  {
    id: 'indemnification',
    icon: Briefcase,
    title: '16. Indemnification',
    body: 'Users agree to defend and indemnify A-List Home Professionals, LLC from any claims arising from their actions, services, or violations.',
  },
  {
    id: 'termination',
    icon: Ban,
    title: '17. Account Termination',
    body: 'A-List Home Professionals, LLC may suspend or terminate accounts for violations of these Terms, fraudulent behavior, or threats to platform integrity. Funds may be held pending review of disputes.',
  },
  {
    id: 'arbitration',
    icon: Gavel,
    title: '18. Dispute Resolution & Arbitration',
    body: 'All disputes shall be resolved through binding arbitration in the State of Florida. No class actions are permitted.',
  },
  {
    id: 'governing-law',
    icon: Globe,
    title: '19. Governing Law',
    body: 'These Terms are governed by the laws of the State of Florida.',
  },
  {
    id: 'changes',
    icon: Edit,
    title: '20. Changes to Terms',
    body: 'A-List Home Professionals, LLC may update these Terms at any time. Continued use of the Platform constitutes acceptance of updated Terms.',
  },
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
                  <div key={si} className="mt-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{sub.label}</h3>
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
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Questions About These Terms?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Reach out to our team for clarification.
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