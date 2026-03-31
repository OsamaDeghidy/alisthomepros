'use client';

import { 
  Target, 
  Gem, 
  Award, 
  ArrowRight, 
  Smartphone, 
  Check, 
  Zap, 
  Shield, 
  MessageSquare, 
  Briefcase, 
  ArrowLeft, 
  Star, 
  Users, 
  Share2,
  Cpu,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestAboutPage() {
  const perks = [
    { icon: Briefcase, title: 'Job Opportunities', desc: 'Secure high-value contracts and project management opportunities.' },
    { icon: MessageSquare, title: 'Direct Messaging', desc: 'Real-time collaboration with specialists and crew members in-app.' },
    { icon: Users, title: 'Crew Builder', desc: 'Build and manage elite teams for large-scale Florida projects.' },
    { icon: Target, title: 'Pro Visibility', desc: 'Rank at the top of the A-List directory for your specialty.' },
    { icon: Shield, title: 'Escrow Protection', desc: 'All payments are secured in escrow until milestones are completed.' },
    { icon: Share2, title: 'Network Multipliers', desc: 'Earn referral bonuses that multiply based on your network activity.' },
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-gold-100 selection:text-gold-900">
      {/* Premium Hero Header */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-4xl mx-auto relative z-10">
           <Link href="/" className="inline-flex items-center gap-2 text-gold-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gold-400 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              < Award className="w-4 h-4" />
              Elite Membership
           </div>
           <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">The Specialist <br/><span className="text-gold-400">Ecosystem.</span></h1>
           <p className="text-xl md:text-2xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed italic">
              "A-List Home Professionals isn't just a directory—it's a high-performance engine for Florida's top construction and maintenance specialists."
           </p>
        </div>
      </section>

      {/* Specialist Definition Section */}
      <section className="py-24 px-4 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">What is an A-List Specialist?</h2>
                  <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed">
                     Specialists represent the top 1% of the network. They are verified project managers and master tradespeople who handle high-complexity residential and commercial contracts.
                  </p>
                  <div className="space-y-4">
                     {[
                        { title: 'Project Management', desc: 'Specialists have access to advanced tools to manage multi-trade projects.' },
                        { title: 'Direct Access', desc: 'Direct bridge to homeowners looking for elite, high-standard builds.' },
                        { title: 'Certification Layer', desc: 'Rigorous vetting ensure only the best maintain Specialist status.' }
                     ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                           <h4 className="font-black text-gray-900 mb-1">{item.title}</h4>
                           <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-[4/5] bg-gray-900 rounded-[4rem] p-12 flex flex-col justify-between text-white overflow-hidden">
                     <div className="w-16 h-16 bg-gold-400 text-gray-900 rounded-2xl flex items-center justify-center">
                        <Cpu className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-3xl font-black mb-4">Powered by Tech. <br/>Driven by Quality.</h3>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Standard of Excellence</p>
                     </div>
                     <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Globe className="w-48 h-48" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 px-4 bg-[#fcfdff]">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 px-4">
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">Membership Benefits</h2>
               <p className="text-xl text-gray-500 font-medium">Unlock the full power of the A-List Home Professionals ecosystem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {perks.map((perk, i) => (
                  <div key={i} className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center group hover:bg-gray-950 hover:text-white transition-all duration-500">
                     <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500 group-hover:text-gray-900 transition-all duration-500">
                        <perk.icon className="w-8 h-8" />
                     </div>
                     <h4 className="text-2xl font-black mb-4 tracking-tight">{perk.title}</h4>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-white/50">{perk.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-32 px-4 bg-gray-950 text-white relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full h-[50%] bg-white/5 blur-[150px] -z-10 rotate-12"></div>
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Choose Your Level</h2>
               <p className="text-xl text-white/40 font-medium">Scale your professional footprint in South Florida.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
               {/* Tier 1: Free */}
               <div className="bg-white/5 rounded-[3.5rem] p-10 border border-white/10 flex flex-col h-full hover:border-gold-500/50 transition-colors">
                  <div className="mb-12">
                     <h4 className="text-2xl font-black text-white mb-4">Network Access</h4>
                     <p className="text-white/40 text-sm font-medium mb-10 leading-relaxed italic">Join the directory and appear in basic Florida home service searches.</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">$0</span>
                        <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">/ Forever</span>
                     </div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                     <li className="flex gap-3 text-sm font-bold text-white/70 tracking-tight"><Check className="w-5 h-5 text-gold-500 shrink-0" /> Basic Professional Profile</li>
                     <li className="flex gap-3 text-sm font-bold text-white/70 tracking-tight"><Check className="w-5 h-5 text-gold-500 shrink-0" /> Local Directory Inclusion</li>
                     <li className="flex gap-3 text-sm font-bold text-white/70 tracking-tight"><Check className="w-5 h-5 text-gold-500 shrink-0" /> Network Community Access</li>
                  </ul>
                  <Link href={APP_GATEWAY_URL} target="_blank" className="w-full py-5 px-8 bg-white/10 text-white rounded-2xl font-black text-center hover:bg-white/20 transition-all border border-white/5">
                     Get Started Free
                  </Link>
               </div>

               {/* Tier 2: Home Pro (Most Popular) */}
               <div className="bg-gold-500 rounded-[3.5rem] p-10 flex flex-col h-full relative scale-105 z-10 shadow-[0_40px_80px_-20px_rgba(247,144,9,0.3)]">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-gold-400 px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">
                     Professional Elite
                  </div>
                  <div className="mb-12 pt-6">
                     <h4 className="text-3xl font-black text-gray-950 mb-4">Home Pro</h4>
                     <p className="text-gray-900/60 text-sm font-bold mb-10 leading-relaxed">The high-standard membership for Florida's top contracting businesses.</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-gray-950">$174.99</span>
                        <span className="text-gray-950/40 font-bold uppercase tracking-widest text-[10px]">/ Month</span>
                     </div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                     {['Elite Profile Visibility', 'Full Messaging Suite', 'Job Opportunity Access', 'Project Management Tools', 'Priority Network Placement', 'Real-time Lead Notifications'].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm font-black text-gray-900 tracking-tight">
                           <Star className="w-5 h-5 text-gray-900 shrink-0 fill-gray-900" />
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Link href={APP_GATEWAY_URL} target="_blank" className="w-full py-6 px-8 bg-gray-950 text-white rounded-[2rem] font-black text-center hover:bg-black transition-all shadow-2xl">
                     Register Now
                  </Link>
               </div>

               {/* Tier 3: Crew Member */}
               <div className="bg-white/5 rounded-[3.5rem] p-10 border border-white/10 flex flex-col h-full hover:border-gold-500/50 transition-colors">
                  <div className="mb-12">
                     <h4 className="text-2xl font-black text-white mb-4">Crew Member</h4>
                     <p className="text-white/40 text-sm font-medium mb-10 leading-relaxed">Consistent work and trade visibility for active Florida field professionals.</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">$124.99</span>
                        <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">/ Month</span>
                     </div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-1">
                     {['Trade Specialist Profile', 'Skill & Portfolio Showcase', 'Verified Trade Badges', 'Professional Network Access', 'Work Invitation Gateway'].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm font-bold text-white/70 tracking-tight"><Check className="w-5 h-5 text-gold-500 shrink-0" /> {item}</li>
                     ))}
                  </ul>
                  <Link href={APP_GATEWAY_URL} target="_blank" className="w-full py-5 px-8 bg-white text-gray-950 rounded-2xl font-black text-center hover:bg-gold-50 transition-all">
                     Join the Crew
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* App Bridge Section */}
      <section className="py-24 bg-white">
         <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tighter">Everything is managed inside the A-List App.</h2>
            <p className="text-gray-500 mb-12 text-lg font-medium italic leading-relaxed">Secure payments, verified profiles, and milestone tracking are handled exclusively in-app for your protection.</p>
            <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-20 py-7 rounded-[2.5rem] font-black text-2xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl"
            >
               <Smartphone className="w-8 h-8 mr-4 text-gold-400" />
               Get the App
               <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
            </Link>
         </div>
      </section>
    </div>
  );
}
