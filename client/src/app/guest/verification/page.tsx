import { 
  ShieldCheck, 
  UserCheck, 
  FileCheck, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  Shield,
  Zap,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Verification Standards | A-List Home Pros",
  description: "How A-List Home Pros verifies every member: license confirmation through Florida DBPR, insurance verification, identity validation, and annual recertification.",
  openGraph: {
    title: "Verification Standards | A-List Home Pros",
    description: "How we verify every contractor and crew member on A-List Home Pros.",
    url: "https://www.alisthomepros.com/verification",
    type: "article",
  }
};

const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C] font-black">{children}</span>
);

export default function VerificationPage() {
  const lastUpdated = "May 2, 2026";
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does 'license-verified' mean on A-List Home Pros?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "License-verified means a member's active Florida contractor or trade license has been confirmed through the Florida Department of Business and Professional Regulation (DBPR) public records as of the verification date."
        }
      },
      {
        "@type": "Question",
        "name": "How often is verification renewed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All A-List members are recertified annually. License status, insurance certificates, and contact information are reconfirmed every twelve months. License changes reported by the Florida DBPR may trigger re-verification at any time."
        }
      },
      {
        "@type": "Question",
        "name": "Does A-List Home Pros guarantee the work of its verified members?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. A-List Home Pros is a networking and matching platform. We verify license status, insurance, and identity at the time of certification, but we do not perform contracting work, supervise projects, or guarantee outcomes. All contractors on A-List are independent businesses, not employees or agents of A-List Home Pros."
        }
      }
    ]
  };

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* B.1 — Hero */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center pt-10">
           <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600/10 text-primary-400 border border-primary-500/20 rounded-full text-xs font-black tracking-widest uppercase italic mb-8">
              Verification Standards
           </div>
           <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase italic">
              What "Verified" <br/> Actually Means.
           </h1>
           <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed italic mb-8">
              Every contractor, trade, and crew member on A-List Home Pros completes a four-step verification process before they can carry the A-List badge. This is what we check, how we check it, and how often.
           </p>
           <p className="text-xs font-black text-primary-400 uppercase tracking-[0.3em]">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* B.2 — The 4-Step Verification Process (overview) */}
      <section className="py-24 px-4 bg-white border-b border-gray-100">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">The A-List Verification Process</h2>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Four steps. Documented. Repeatable. Renewed annually.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { step: '01', icon: FileCheck, title: 'License Verification', desc: 'We confirm every contractor and trade license through the Florida DBPR public records database.' },
                  { step: '02', icon: ShieldCheck, title: 'Insurance Verification', desc: 'We require a current general liability insurance certificate on file, with A-List Home Pros listed for notification of cancellation.' },
                  { step: '03', icon: UserCheck, title: 'Identity Verification', desc: 'We verify each member\'s identity through a third-party identity-verification provider.' },
                  { step: '04', icon: RefreshCw, title: 'Annual Recertification', desc: 'License status, insurance certificates, and member information are reconfirmed every twelve months.' }
               ].map((item, i) => (
                  <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 group hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center justify-between">
                        <span className="text-4xl font-black text-primary-600/20">{item.step}</span>
                        <item.icon className="w-8 h-8 text-primary-600" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tighter">{item.title}</h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Detailed Steps B.3 - B.6 */}
      <section className="py-32 px-4 bg-white">
         <div className="max-w-4xl mx-auto space-y-32">
            
            {/* Step 1 */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic">01</div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Step 1 — License Verification</h2>
               </div>
               <div className="prose prose-xl prose-gray max-w-none space-y-8 font-medium text-gray-600 leading-relaxed">
                  <p>
                     Every A-List member who provides licensed services in Florida must hold an active license issued by the Florida Department of Business and Professional Regulation (DBPR) or the appropriate Florida licensing authority for their trade.
                  </p>
                  <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                     <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm mb-6">What we verify:</h4>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Active license status</li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Service matching</li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Good standing (no active discipline)</li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Matching legal business names</li>
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-gray-900 font-black uppercase italic">How we verify:</h4>
                     <p>
                        We confirm license information through the Florida DBPR public license search at <a href="https://www.myfloridalicense.com" target="_blank" className="text-primary-600 font-bold hover:underline inline-flex items-center gap-1">myfloridalicense.com <ExternalLink className="w-4 h-4" /></a>. Verification dates are recorded in the member's internal A-List profile.
                     </p>
                  </div>
                  <div className="p-8 bg-warning-50 rounded-3xl border border-warning-100 italic text-warning-900 text-base">
                     <h4 className="font-black uppercase mb-2">What this does not verify:</h4>
                     License verification confirms a member's legal authorization to perform licensed work in Florida as of the verification date. It is <strong>not</strong> a guarantee of competence, quality of work, or future conduct.
                  </div>
               </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic">02</div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Step 2 — Insurance Verification</h2>
               </div>
               <div className="prose prose-xl prose-gray max-w-none space-y-8 font-medium text-gray-600 leading-relaxed">
                  <p>
                     Every A-List member who performs licensed contracting work in Florida must provide current proof of general liability insurance before becoming verified.
                  </p>
                  <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                     <h4 className="text-gray-900 font-black uppercase tracking-widest text-sm mb-6">What we require:</h4>
                     <ul className="space-y-4 list-none p-0">
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Current Certificate of Insurance (COI)</li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Liability coverage of no less than $1,000,000 per occurrence</li>
                        <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" /> Workers' compensation coverage where required by Florida law</li>
                     </ul>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-gray-900 font-black uppercase italic">How we verify:</h4>
                     <p>
                        We require members to upload their current COI directly to their A-List profile. Where possible, we request that A-List Home Pros be listed as a certificate holder so we receive notification if coverage lapses.
                     </p>
                  </div>
                  <div className="p-8 bg-warning-50 rounded-3xl border border-warning-100 italic text-warning-900 text-base">
                     <h4 className="font-black uppercase mb-2">What this does not verify:</h4>
                     Insurance verification confirms the existence of an active policy at the time of verification. It is <strong>not</strong> a guarantee that any specific claim will be covered or that coverage remains active between verification dates.
                  </div>
               </div>
            </div>

            {/* Step 3 & 4 (Consolidated for space but distinct) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Step 3 — Identity Verification</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                     Every A-List member completes identity verification before becoming visible. We verify government-issued photo ID and perform a liveness check through a third-party provider.
                  </p>
               </div>
               <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Step 4 — Annual Recertification</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                     A-List verification is renewed every twelve months. We recheck license status, insurance coverage, and business standing to ensure the ecosystem remains elite.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* B.7 — Membership Tiers */}
      <section className="py-32 px-4 bg-gray-50">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">What the Badges Mean</h2>
               <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Status is built in stages. Every level represents a point in the process.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Tier 1 */}
               <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 flex flex-col gap-8 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success-600" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter">A-List Member</h4>
                  </div>
                  <p className="text-gray-500 italic font-medium">Entry-level status.</p>
                  <ul className="space-y-4 text-sm text-gray-600 font-bold uppercase tracking-tighter">
                     <li>• Profile Created</li>
                     <li>• Business Info Submitted</li>
                     <li>• Verification Pending</li>
                  </ul>
                  <div className="mt-auto pt-8 border-t border-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest">
                     No Verified Badge
                  </div>
               </div>

               {/* Tier 2 */}
               <div className="bg-white p-12 rounded-[3.5rem] border-2 border-primary-500/20 flex flex-col gap-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter">License-Verified</h4>
                  </div>
                  <p className="text-gray-500 italic font-medium">Standard verified status.</p>
                  <ul className="space-y-4 text-sm text-gray-900 font-black uppercase tracking-tighter">
                     <li className="text-primary-600">• Step 1: License Verified</li>
                     <li className="text-primary-600">• Step 2: Insurance Verified</li>
                     <li className="text-primary-600">• Step 3: Identity Verified</li>
                  </ul>
                  <div className="mt-auto pt-8 border-t border-gray-100 flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5 text-primary-600" />
                     <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Carries Verified Badge</span>
                  </div>
               </div>

               {/* Tier 3 */}
               <div className="bg-gray-950 text-white p-12 rounded-[3.5rem] flex flex-col gap-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary-600" />
                     </div>
                     <h4 className="text-2xl font-black uppercase tracking-tighter">Certified Founder</h4>
                  </div>
                  <p className="text-primary-400 italic font-black">Highest standard.</p>
                  <ul className="space-y-4 text-sm font-black uppercase tracking-tighter">
                     <li>• All 4 Verification Steps</li>
                     <li>• Founding Member Period</li>
                     <li>• Locked-in Charter Pricing</li>
                     <li>• Personally Vetted by Founder</li>
                  </ul>
                  <div className="mt-auto pt-8 border-t border-white/10 flex items-center gap-2">
                     <GoldText>Priority Placement</GoldText>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* B.8 — What Can Revoke Your Status */}
      <section className="py-32 px-4 bg-white border-t border-gray-100">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12">What Revokes A-List Status</h2>
            <div className="bg-error-50 p-12 rounded-[3.5rem] border border-error-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold text-error-900 uppercase tracking-tighter">
                  <div className="space-y-4">
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> License suspension or expiration</p>
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> Lapse in insurance coverage</p>
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> Failure to recertify</p>
                  </div>
                  <div className="space-y-4">
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> Fraud or substantiated complaints</p>
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> Misrepresentation of credentials</p>
                     <p className="flex items-start gap-3"><ShieldAlert className="w-5 h-5 flex-shrink-0" /> Platform policy violations</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* B.9 — Limitations & Disclaimers */}
      <section className="py-32 px-4 bg-gray-950 text-white">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-primary-400">What Verification Does Not Mean</h2>
            <div className="space-y-10 text-xl text-white/70 font-medium leading-relaxed">
               <p>
                  A-List Home Pros is a networking and matching platform. Our verification standards confirm specific facts about our members at the time of verification. They are not guarantees of future conduct or work quality.
               </p>
               <div className="space-y-6 border-l-4 border-primary-500 pl-8">
                  <p><span className="text-white font-black">Not a guarantee:</span> We verify credentials, not project outcomes or contractor competence.</p>
                  <p><span className="text-white font-black">Due diligence required:</span> Homeowners should always request their own copies of COIs and check references.</p>
                  <p><span className="text-white font-black">Snapshot in time:</span> Verification reflects status as of a specific date. Real-time accuracy depends on DBPR updates.</p>
                  <p><span className="text-white font-black">Independent entities:</span> A-List members are independent businesses, not agents or employees of A-List Home Pros.</p>
               </div>
            </div>
         </div>
      </section>

      {/* B.10 — Reporting Concerns */}
      <section className="py-32 px-4 bg-white">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8">Reporting a Concern</h2>
            <p className="text-xl text-gray-500 font-medium mb-12">All reports are reviewed by Jeffrey D. West Jr. directly.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <a href="mailto:jwest@alisthp.com" className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary-500 transition-all flex flex-col items-center gap-4">
                  <Mail className="w-8 h-8 text-primary-600" />
                  <span className="font-black uppercase italic text-sm">jwest@alisthp.com</span>
               </a>
               <a href="tel:5618884930" className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary-500 transition-all flex flex-col items-center gap-4">
                  <Phone className="w-8 h-8 text-primary-600" />
                  <span className="font-black uppercase italic text-sm">(561) 888-4930</span>
               </a>
               <Link href="/contact" className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary-500 transition-all flex flex-col items-center gap-4">
                  <HelpCircle className="w-8 h-8 text-primary-600" />
                  <span className="font-black uppercase italic text-sm">Submit Form</span>
               </Link>
            </div>
         </div>
      </section>

      {/* B.11 — FAQ */}
      <section className="py-32 px-4 bg-gray-50">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
               {[
                  { q: 'How long does verification take?', a: 'For most members, license and insurance verification completes within 2–5 business days of submitting documentation.' },
                  { q: 'Do I have to recertify every year?', a: 'Yes. All A-List members are recertified annually. We send reminders 30 and 14 days before recertification is due.' },
                  { q: 'What if my license is in another state?', a: 'A-List Home Pros currently serves South Florida and verifies licenses issued by Florida licensing authorities.' },
                  { q: 'Does A-List guarantee the work?', a: 'No. A-List Home Pros is a matching platform. We verify credentials, but we do not perform, supervise, or warrant any work.' }
               ].map((item, i) => (
                  <details key={i} className="bg-white rounded-3xl border border-gray-100 p-6 group">
                     <summary className="font-black uppercase italic tracking-tighter text-lg cursor-pointer flex items-center justify-between list-none">
                        {item.q}
                        <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                     </summary>
                     <p className="mt-4 text-gray-600 font-medium leading-relaxed">{item.a}</p>
                  </details>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
