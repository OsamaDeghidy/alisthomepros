'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Search, Lock, AlertTriangle, Users, CheckCircle, Phone, Mail } from 'lucide-react';
import { APP_GATEWAY_URL, CONTACT_EMAIL, CONTACT_PHONE } from '@/config/site';

const pillars = [
  {
    id: 'vetting',
    icon: Search,
    title: 'Verified Professionals Only',
    body: `Every Home Pro, Crew Member, and Specialist on A-List goes through a verification process before gaining full access to the network. This includes:`,
    bullets: [
      'Identity and business registration confirmation.',
      'Trade license and insurance validation where applicable.',
      'Portfolio and work history review.',
      'Ongoing performance monitoring through client ratings and feedback.'
    ]
  },
  {
    id: 'payments',
    icon: Lock,
    title: 'Project Funds Account — Built-In Payment Protection',
    body: `We replaced traditional payment methods with our Project Funds Account system. Here's how it works:`,
    bullets: [
      'Property Owners fund their account before work begins — no upfront payments to contractors.',
      'Funds are held securely and only released when a milestone is confirmed complete.',
      'All payments are processed through encrypted, certified channels.',
      'Never pay a pro outside the platform — doing so removes all protections for both parties.'
    ]
  },
  {
    id: 'communication',
    icon: Shield,
    title: 'Communication Inside the Network',
    body: `All messaging, negotiations, and project coordination happen inside the A-List app. This means:`,
    bullets: [
      'Every conversation is logged and available for review if a dispute arises.',
      'No off-platform solicitation or shadowing of relationships.',
      'Transparent project timelines, proposals, and milestone agreements in one place.',
      'Direct, encrypted channels between property owners, pros, crew, and specialists.'
    ]
  },
  {
    id: 'disputes',
    icon: AlertTriangle,
    title: 'Dispute Resolution',
    body: `When disagreements happen, A-List steps in with a structured, evidence-based process:`,
    bullets: [
      'Project Funds Account funds are frozen during all active disputes.',
      'Both parties submit their evidence: photos, messages, contracts, and milestone records.',
      'Our trust and safety team reviews submissions and issues a resolution.',
      'We act as a neutral mediator — not an advocate for either side.',
      'Bad-faith disputes or false claims are investigated and may result in account action.'
    ]
  },
  {
    id: 'conduct',
    icon: Users,
    title: 'Community Standards',
    body: `The A-List network only works when everyone participates in good faith. We enforce:`,
    bullets: [
      'Zero tolerance for harassment, discrimination, or threatening conduct.',
      'Authentic reviews only — manipulated ratings or fake testimonials are removed and penalized.',
      'Honest representation — your profile, skills, and history must be accurate.',
      'Professionalism in all interactions, whether with property owners, pros, or crew.',
      'Repeat violations result in permanent removal from the network.'
    ]
  },
  {
    id: 'reporting',
    icon: AlertTriangle,
    title: 'How to Report a Problem',
    body: `If you experience or witness any violation of our Safety Standard, do not ignore it.`,
    bullets: [
      'Use the "Report" flag available on any user profile or within the messaging center.',
      'For payment or project disputes, open a formal dispute from your project dashboard.',
      'For privacy or account security concerns, contact us directly at support@alisthomepros.com.',
      'If you are in physical danger, always call 911 first — then contact us.'
    ]
  }
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <div className="bg-gray-950 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8">
            <Shield className="w-4 h-4" /> Trust & Safety
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Safety Standard
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            The A-List network was built on one rule: real people, real projects, real accountability. Here's how we enforce that standard every day.
          </p>
          <p className="mt-6 text-white/40 text-sm font-bold uppercase tracking-widest">
            Effective Date: July 1, 2025
          </p>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-primary-600 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-white text-sm font-black uppercase tracking-widest">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verified Professionals</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Secure Project Funds Account</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Dispute Protection</div>
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 24/7 Reporting</div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 pt-20 pb-8">
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-3xl p-8">
          <h2 className="text-2xl font-black mb-3 text-gray-900 dark:text-white">Our Commitment to You</h2>
          <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            A-List is a controlled, private network — not an open directory. Every feature, from our Project Funds Account to our verification system, is designed to protect property owners, professionals, and crew from fraud, misrepresentation, and unsafe working conditions. These are not suggestions — they are enforced standards.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-20 space-y-16">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.id} id={pillar.id} className="scroll-mt-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{pillar.title}</h2>
              </div>

              {pillar.body && (
                <p className="pl-14 text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-4">{pillar.body}</p>
              )}

              <ul className="pl-14 space-y-3">
                {pillar.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-950 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-3">Physical Safety Emergency?</h3>
          <p className="text-red-200 font-medium mb-6">
            If you feel physically threatened or unsafe, call <strong>911</strong> immediately. The A-List safety team handles platform violations — not emergencies. Your physical safety always comes first.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">Contact Our Safety Team</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            To report a violation, file a complaint, or ask about our safety policies — reach out directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all">
              <Mail className="w-5 h-5" /> {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-black hover:border-gray-400 transition-all">
              <Phone className="w-5 h-5" /> {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-600 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h3 className="text-4xl font-black tracking-tighter mb-4">Join a Network Built on Standards</h3>
          <p className="text-primary-100 font-medium mb-8 text-lg">
            Every member is vetted. Every project is protected. Enter A-List and work with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={APP_GATEWAY_URL}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-50 transition-all"
            >
              Enter the Network
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:border-white transition-all"
            >
              View Terms of Service
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
