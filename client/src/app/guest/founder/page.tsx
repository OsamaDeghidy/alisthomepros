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
                     <p className="text-3xl font-black text-gray-900 italic">
                        I built A-List Home Pros from experience.
                     </p>
                     <p>
                        Over the years, I've worked in construction, property services, and project management. I've seen great projects. I've seen difficult projects. I've seen relationships between property owners and professionals succeed, and I've seen them break down.
                     </p>
                     <p>
                        I've also learned that no one is perfect. Not property owners. Not contractors. Not crew members. Not even me.
                     </p>
                     <p className="text-gray-950 font-black italic border-l-8 border-[#B8960C] pl-8 py-4 bg-primary-50/30">
                        Construction is a people business. Miscommunication happens. Expectations can get missed. Problems arise. What matters is accountability, transparency, and having a system that helps people work through those challenges.
                     </p>
                     <p>
                        As I spent more time in the industry, I realized the problem wasn't that there weren't good professionals or good property owners. The problem was that trust was often missing from the process.
                     </p>
                     <p className="text-3xl font-black text-gray-950 tracking-tighter uppercase italic leading-tight text-primary-600">
                        That's what inspired me to build A-List Home Pros.
                     </p>
                     <p>
                        A platform designed to help create more accountability, more transparency, and better connections between the people who build projects and the people who invest in them.
                     </p>
                  </div>

                  <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter border-l-8 border-[#B8960C] pl-8">What A-List Is</h2>
                      <div className="p-10 bg-gray-950 text-white rounded-[3rem] font-black italic relative overflow-hidden text-center mb-8">
                         <span className="relative z-10 block">
                            Verification Builds Trust. Certification Earns Respect.
                         </span>
                      </div>
                      <p>
                         When you join A-List and complete the verification process, you become an A-List Verified Member. Verification may include identity confirmation, credential reviews, licensing verification, insurance verification, and other accountability measures designed to help build trust within the ecosystem.
                      </p>
                      <p>
                         As you continue to participate, build your reputation, and meet additional accountability standards, you may earn A-List Certified status.
                      </p>
                      <p className="text-gray-950 font-black">
                         A-List Verified Members have proven who they are.
                      </p>
                      <p className="text-primary-600 font-black">
                         A-List Certified Members have proven how they operate.
                      </p>
                      <p>
                         Certification is earned through accountability, professionalism, and a demonstrated commitment to the A-List Standard.
                      </p>
                      <p className="text-gray-950 font-black italic">
                         That's what being A-List is all about.
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
                  <p className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Jeffrey Donald West Jr.</p>
                  <p className="text-xl text-[#B8960C] font-bold uppercase tracking-widest">Founder, A-List Home Pros</p>
               </div>
               <div className="flex flex-col gap-4">
                  <a href="tel:18668825478" className="flex items-center justify-center lg:justify-start gap-4 text-gray-600 hover:text-primary-600 transition-colors font-bold text-xl">
                     <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <Phone className="w-6 h-6" />
                     </div>
                     1-866-882-5478
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
                 href="https://pay.alisthomepros.com/b/cNidR991ta0tchxfHMfMA01"
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
