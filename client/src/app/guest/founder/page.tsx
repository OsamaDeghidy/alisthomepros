'use client';

import { 
  ArrowRight, 
  Smartphone, 
  ShieldCheck, 
  Shield, 
  ArrowLeft, 
  Zap,
  Phone,
  Mail,
  CheckCircle,
  Building2,
  Target,
  Share2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';
import { motion } from 'framer-motion';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function FounderPage() {
  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      
      {/* B.1 — Hero */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group max-w-md mx-auto lg:mx-0">
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary-600 to-[#B8960C] rounded-[3.5rem] blur-2xl opacity-20"></div>
               <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                  <Image 
                    src="/images/jeffery.jpeg" 
                    alt="Jeffrey D. West Jr." 
                    width={800} 
                    height={1000} 
                    className="w-full h-auto object-cover"
                    priority
                  />
               </div>
            </div>
            
            <div className="text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600/10 text-primary-400 border border-primary-500/20 rounded-full text-xs font-black tracking-widest uppercase italic mb-8">
                  A Message from the Founder
               </div>
               <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none uppercase italic">
                  Jeffrey Donald <br/> West Jr.
               </h1>
               <p className="text-2xl text-primary-400 font-bold uppercase tracking-[0.2em] italic">Founder, A-List Home Pros</p>
            </div>
          </div>
        </div>
      </section>

      {/* B.2 — The Founder's Message */}
      <section className="py-32 px-4 bg-white relative">
         <div className="max-w-4xl mx-auto">
            <div className="prose prose-2xl prose-gray max-w-none">
               <div className="space-y-16 text-2xl text-gray-600 font-medium leading-relaxed">
                  <div className="space-y-8">
                     <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter border-l-8 border-[#B8960C] pl-8">Why I Built This</h2>
                     <p>
                        I didn't build this in a boardroom. I built it because I saw the system eat the people who build Florida.
                     </p>
                     <p>
                        I've spent years in construction. I've been on the ground, watching how this industry actually moves. I saw new contractors with massive skill get ignored because they didn't have the ad budget to pay off the gatekeepers. I saw veterans — guys who've been doing high-end work in Florida for thirty years — burned out and disgusted because lead platforms were selling them the same recycled leads they just sold to five of their competitors.
                     </p>
                     <p>
                        The trust was dead. Homeowners were gambling on whoever had the biggest marketing budget, not the best results. Contractors were losing jobs to guys who gamed the review systems. It was a structural failure, and it needed a structural solution.
                     </p>
                  </div>

                  {/* B.3 — Pull Quote */}
                  <div className="py-12 px-10 bg-primary-50/30 border-l-[12px] border-[#B8960C] rounded-r-[3rem] italic">
                     <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                        "Most contractors compete for jobs. A-List members get positioned for them."
                     </p>
                     <cite className="text-xl font-bold uppercase tracking-widest text-[#B8960C] not-italic">— Jeffrey D. West Jr.</cite>
                  </div>

                  <div className="space-y-8">
                     <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter border-l-8 border-primary-600 pl-8">What Changed My Thinking</h2>
                     <p>
                        I started studying the platforms that actually changed industries. Uber didn't just make taxis more convenient — they rebuilt the entire relationship between the rider, the driver, and the infrastructure connecting them. They created accountability, transparency, and a system where the quality of the experience was the product.
                     </p>
                     <p>
                        That model stayed with me. I started asking: what would that look like for construction? What if the platform actually served the professional — not just processed them? What if "license-verified" actually meant something specific, documented, and current? What if homeowners could connect with someone who genuinely earned their standing?
                     </p>
                  </div>

                  <div className="space-y-8">
                     <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter border-l-8 border-[#B8960C] pl-8">What A-List Is</h2>
                     <p className="text-3xl font-black text-gray-900 italic">
                        That's what A-List is. And you have to earn it.
                     </p>
                     <p>
                        When you join A-List and go through the verification process — license confirmation, insurance verification, identity validation — you become an A-List Member. When you complete additional accountability steps and earn your badges, you become A-List Certified.
                     </p>
                     <p>
                        A-List Members are in the family. They're inside the ecosystem. But they haven't yet completed everything required to carry the certified name. The badge isn't given — it's built. Through credentials. Through accountability. Through a process that proves you're not just in this industry — you're committed to doing it right.
                     </p>
                     <p>
                        We don't certify everyone who applies. We're building a network of South Florida's serious professionals — general contractors, skilled tradespeople, project coordinators, handymen, and the income earners who keep this industry moving.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* B.4 — What A-List Stands For (4-tile grid) */}
      <section className="py-32 px-4 bg-gray-50">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-20 uppercase italic tracking-tighter">What A-List Stands For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                  { icon: Zap, title: 'No Bidding Wars', body: 'We don\'t sell your project to five competing contractors. One project, one match.', symbol: '🚫' },
                  { icon: ShieldCheck, title: 'License-Verified Only', body: 'Every member\'s Florida contractor or trade license is confirmed through the DBPR.', link: '/verification', symbol: '✓' },
                  { icon: Smartphone, title: 'Direct Access', body: 'Clean, direct connections between homeowners and pros. No middleman pushing for "lead conversions."', symbol: '🔗' },
                  { icon: CheckCircle, title: 'Built-In Accountability', body: 'Every project, every interaction, every milestone — handled inside the A-List app.', symbol: '📋' }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl flex flex-col gap-8 group hover:scale-[1.02] transition-all">
                     <div className="flex items-center justify-between">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                           <item.icon className="w-8 h-8 text-primary-600" />
                        </div>
                        <span className="text-4xl opacity-20">{item.symbol}</span>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{item.title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-6">{item.body}</p>
                        {item.link && (
                           <Link href={item.link} className="inline-flex items-center text-primary-600 font-black uppercase text-sm tracking-widest hover:gap-3 transition-all">
                              See our standards <ArrowRight className="w-4 h-4 ml-2" />
                           </Link>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* B.5 — Who This Is For */}
      <section className="py-32 px-4 bg-white">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-12 uppercase italic tracking-tighter">Who This Is For</h2>
            <div className="space-y-10 text-2xl text-gray-600 font-medium leading-relaxed italic">
               <p>
                  A-List is for the serious homeowners, general contractors, skilled trades, project coordinators, and income earners who keep South Florida running.
               </p>
               <p className="text-gray-900 font-black">
                  It's for contractors who are tired of paying for the same lead five other guys already bought.
               </p>
               <p>
                  It's for homeowners who are tired of getting bombarded by calls from companies they never asked to hear from.
               </p>
               <p className="text-gray-900 font-black">
                  It's for the trades who do the work right and want to be positioned alongside others who do the same.
               </p>
               <p className="text-primary-600 font-black text-3xl not-italic uppercase tracking-tighter">
                  If you want a directory, go to the yellow pages. If you want an ecosystem where quality is the currency — you belong here.
               </p>
            </div>
         </div>
      </section>

      {/* B.6 — Sign-off */}
      <section className="py-32 px-4 bg-gray-50 border-t border-gray-100">
         <div className="max-w-7xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-16">
            <div>
               <div className="space-y-2 mb-10">
                  <p className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">— Jeffrey Donald West Jr.</p>
                  <p className="text-xl text-[#B8960C] font-bold uppercase tracking-widest">Founder, A-List Home Pros</p>
               </div>
               <div className="flex flex-col gap-4">
                  <a href="tel:5618884930" className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 hover:text-primary-600 transition-colors font-bold text-xl">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <Phone className="w-6 h-6" />
                     </div>
                     (561) 888-4930
                  </a>
                  <a href="mailto:jwest@alisthp.com" className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 hover:text-primary-600 transition-colors font-bold text-xl">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                     </div>
                     jwest@alisthp.com
                  </a>
               </div>
            </div>

            {/* B.7 — CTAs */}
            <div className="flex flex-col sm:flex-row gap-6">
               <Link 
                 href={`${APP_GATEWAY_URL}/register?role=pro`}
                 className="px-10 py-6 bg-gray-950 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl flex items-center justify-center uppercase tracking-widest"
               >
                  Apply for Founding Membership
                  <ArrowRight className="ml-3 w-5 h-5" />
               </Link>
               <Link 
                 href="/start-your-project"
                 className="px-10 py-6 bg-white text-gray-900 border-2 border-gray-950 rounded-3xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center uppercase tracking-widest"
               >
                  Submit Your Project
                  <ArrowRight className="ml-3 w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}
