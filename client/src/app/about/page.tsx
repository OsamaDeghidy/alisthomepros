'use client';

import { 
  Target, 
  ArrowRight, 
  Smartphone, 
  Zap, 
  Shield, 
  ArrowLeft, 
  Globe,
  UserCheck,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Layers,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function AboutPage() {
  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      
      {/* 3.3 New Hero: The A-List Ecosystem */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 pt-10">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85] uppercase italic pr-12 overflow-visible">
             This is Not <br/>
             <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">A Directory.</span>
           </h1>
           <div className="text-2xl md:text-3xl text-white/90 font-black max-w-4xl mx-auto leading-tight space-y-8 uppercase tracking-tighter italic pr-12 overflow-visible">
              <p className="pr-4">
                <GoldText>A-List</GoldText> Home Professionals is a high-performance ecosystem, engineered specifically to support South Florida's dedicated construction and home service professionals.
              </p>
              <p className="text-primary-400 pr-4">
                Moving beyond outdated directories, we connect property owners directly with qualified professionals through a platform built on trust, transparency, and high service standards.
              </p>
             <div className="pt-8">
                <Link href={APP_GATEWAY_URL} target="_blank" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-gray-950 rounded-[2.5rem] font-black text-xl hover:bg-primary-50 transition-all shadow-2xl shadow-primary-500/20">
                   Enter the Ecosystem
                   <ArrowRight className="w-6 h-6" />
                </Link>
             </div>
           </div>
        </div>
      </section>

      {/* 3.4 Why A-List Home Professionals */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-xs font-black mb-8 tracking-widest uppercase italic pr-4">
               <TrendingUp className="w-4 h-4 text-primary-600" />
               Why A-List Home Professionals
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-gray-950 mb-20 tracking-tighter leading-[0.9] uppercase italic pr-12 overflow-visible">
               The Lead Generation System <br className="hidden md:block"/>
               <span className="inline-block text-primary-600 pr-10">Is Professionally Broken.</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
               <div className="space-y-10 text-2xl text-gray-600 font-medium leading-relaxed pr-4">
                  <p>
                     For twenty years, the big platforms have run the same predatory play: capture a property owner's data, package it as a lead, and sell it to five, six, sometimes ten contractors simultaneously. 
                  </p>
                  <p className="text-gray-950 font-black italic border-l-8 border-primary-500 pl-8 py-4 bg-primary-50/30 pr-4">
                     It’s a race to the bottom where the only winner is the platform collecting fees on a job that only one person can actually perform. 
                  </p>
                  <p>
                     Contractors are burning ad budgets on recycled trash. Property owners are getting bombarded by calls from companies they never vetted. Trust has completely evaporated from the digital home services market.
                  </p>
                  <p>
                     <GoldText>A-List</GoldText> Home Professionals was built to burn that model down. We aren't a marketplace for names; we are a infrastructure for results. We position elite professionals instead of making them chase.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                     { title: 'No Bidding Wars', desc: 'We don’t sell your leads to your competitors.', icon: Zap },
                     { title: 'Verified Only', desc: 'If you aren’t elite, you aren’t on the map.', icon: ShieldCheck },
                     { title: 'Direct Access', desc: 'Clean, direct connections with zero interference.', icon: Smartphone },
                     { title: 'Complete Control', desc: 'Everything from funds to messaging in one place.', icon: Layers }
                  ].map((item, i) => (
                     <div key={i} className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-start gap-6 hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
                           <item.icon className="w-8 h-8 text-primary-600 group-hover:text-white" />
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-gray-950 mb-3 uppercase tracking-tighter pr-4">{item.title}</h4>
                           <p className="text-gray-500 font-medium leading-tight pr-4">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 3.5 Message from the Founder */}
      <section className="py-32 px-4 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <UserCheck className="w-96 h-96" />
         </div>
         
         <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-full text-xs font-black mb-12 tracking-widest uppercase italic relative z-10 pr-4">
               <Shield className="w-4 h-4" />
               Message from the Founder
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-12 tracking-tighter leading-none relative z-10 italic uppercase pr-12 overflow-visible">
              Jeffrey Donald <br className="hidden md:block"/> West Jr.<br/>
              <span className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase mt-4 block">Founder, <GoldText>A-List</GoldText> Home Professionals</span>
            </h2>

            <div className="space-y-12 text-2xl font-medium text-gray-800 leading-relaxed relative z-10 mt-12 bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-gray-100">
                <p className="text-3xl font-black text-gray-950 tracking-tighter uppercase italic leading-tight pr-12 overflow-visible text-primary-600">
                   I built A-List Home Pros from experience.
                </p>
                
                <p className="pr-4">
                   Over the years, I've worked in construction, property services, and project management. I've seen great projects. I've seen difficult projects. I've seen relationships between property owners and professionals succeed, and I've seen them break down.
                </p>

                <p className="pr-4">
                   I've also learned that no one is perfect. Not property owners. Not contractors. Not crew members. Not even me.
                </p>

                <p className="text-gray-950 font-black italic border-l-8 border-primary-500 pl-8 py-4 bg-primary-50/30 pr-4">
                   Construction is a people business. Miscommunication happens. Expectations can get missed. Problems arise. What matters is accountability, transparency, and having a system that helps people work through those challenges.
                </p>

                <p className="pr-4">
                   As I spent more time in the industry, I realized the problem wasn't that there weren't good professionals or good property owners. The problem was that trust was often missing from the process.
                </p>

                <p className="text-3xl font-black text-gray-950 tracking-tighter uppercase italic leading-tight pr-12 overflow-visible text-primary-600">
                   That's what inspired me to build A-List Home Pros.
                </p>

                <p className="pr-4">
                   A platform designed to help create more accountability, more transparency, and better connections between the people who build projects and the people who invest in them.
                </p>

               <div className="p-10 bg-gray-950 text-white rounded-[3rem] font-black italic relative overflow-hidden text-center">
                  <span className="relative z-10 block pr-4">
                     Verification Builds Trust. Certification Earns Respect.
                  </span>
               </div>

               <p className="pr-4">
                  When you join A-List and complete the verification process, you become an A-List Verified Member. Verification may include identity confirmation, credential reviews, licensing verification, insurance verification, and other accountability measures designed to help build trust within the ecosystem.
               </p>

               <p className="pr-4">
                  As you continue to participate, build your reputation, and meet additional accountability standards, you may earn A-List Certified status.
               </p>

               <p className="text-gray-950 font-black pr-4">
                  A-List Verified Members have proven who they are.
               </p>

               <p className="text-primary-600 font-black pr-4">
                  A-List Certified Members have proven how they operate.
               </p>

               <p className="pr-4">
                  Certification is earned through accountability, professionalism, and a demonstrated commitment to the A-List Standard.
               </p>

               <p className="text-gray-950 font-black italic pr-4">
                  That's what being A-List is all about.
               </p>

               <div className="pt-16 border-t border-gray-100 flex items-center justify-between">
                  <div>
                     <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.3em] mb-4 pr-4">The New Standard</p>
                     <h4 className="text-3xl font-black text-gray-950 tracking-tighter uppercase pr-4">Jeffrey Donald West Jr.</h4>
                  </div>
                  <div className="hidden md:block">
                     <ShieldCheck className="w-20 h-20 text-primary-600 opacity-20" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3.2 Bottom CTA: App Bridge Section */}
      <section className="py-40 bg-gray-950 text-white relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-primary-600/20 rounded-full blur-[200px] pointer-events-none"></div>
         <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 leading-[0.85] tracking-tighter uppercase italic pr-12 overflow-visible">
               Everything is <br className="hidden md:block"/>
               <span className="inline-block text-primary-400 pr-10">Inside the App.</span>
            </h2>
            <p className="text-white/60 mb-20 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl mx-auto pr-4">
               Secure payments, verified profiles, and milestone tracking are handled exclusively inside the A-List ecosystem for your absolute protection.
            </p>
            <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="group relative inline-flex items-center justify-center bg-white text-gray-950 px-24 py-10 rounded-[4rem] font-black text-4xl transition-all hover:bg-primary-50 hover:text-primary-600 hover:scale-[1.02] active:scale-95 shadow-[0_0_80px_rgba(255,255,255,0.15)]"
            >
               <Smartphone className="w-12 h-12 mr-6 text-primary-500" />
               Enter the App
               <ArrowRight className="ml-6 h-12 w-12 transition-transform group-hover:translate-x-4" />
            </Link>
         </div>
      </section>
    </div>
  );
}