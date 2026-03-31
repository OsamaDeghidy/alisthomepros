'use client';

import { 
  Share2, 
  Users, 
  DollarSign, 
  ArrowRight, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  Heart, 
  Play, 
  Award, 
  Network, 
  Gem,
  Coins,
  TrendingUp,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestReferralPage() {
  const videoPlaceholders = [
    { title: 'The Network Vision', duration: '1:24', desc: 'How the A-List bridge creates value for Florida.' },
    { title: 'Earning Multipliers', duration: '2:15', desc: 'Understanding the network builder mathematics.' },
    { title: 'The Specialist Standard', duration: '1:45', desc: 'Why the top 1% choose A-List Pros.' }
  ];

  const steps = [
    { 
      icon: Network, 
      title: 'Invite Experts', 
      desc: 'Connect homeowners, crew members, and specialists to the secure ecosystem.',
      color: 'bg-gold-50 text-gold-600'
    },
    { 
      icon: Coins, 
      title: 'Active Multipliers', 
      desc: 'Every successful milestone in your network triggers a builder reward.',
      color: 'bg-gold-100 text-gold-700'
    },
    { 
      icon: TrendingUp, 
      title: 'Scale & Earn', 
      desc: 'Watch your referral earnings grow as your bridge connects more professionals.',
      color: 'bg-gold-600 text-white shadow-xl shadow-gold-500/20'
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-gold-100 selection:text-gold-900">
      {/* Network Hub Hero */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden text-center border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-4xl mx-auto relative z-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Share2 className="w-4 h-4" />
              Network Hub Builder
           </div>
           <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">Your Network <br/><span className="text-gold-400">is Your Net Worth.</span></h1>
           <p className="text-xl md:text-2xl text-white/40 font-medium max-w-3xl mx-auto leading-relaxed italic">
              "Build the bridge. Connect the pros. Earn the rewards. The A-List Referral Program is built for those who understand the value of a high-standard connection."
           </p>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Learn the System</h2>
               <p className="text-gray-500 font-medium mt-4">Watch these short briefings on how to maximize your network participation.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {videoPlaceholders.map((vid, i) => (
                  <div key={i} className="group">
                     <div className="aspect-video bg-gray-900 rounded-[2.5rem] border border-gray-100 shadow-2xl relative overflow-hidden flex items-center justify-center cursor-pointer mb-6 transform transition-transform duration-500 group-hover:scale-105">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center group-hover:bg-gold-500 group-hover:border-gold-400 transition-all">
                           <Play className="w-6 h-6 text-white group-hover:text-gray-950 fill-current" />
                        </div>
                        <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                           {vid.duration}
                        </div>
                        <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <h4 className="text-xl font-black text-gray-900 mb-2">{vid.title}</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">{vid.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Network Logic */}
      <section className="py-24 px-4 bg-gray-50/50">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
               <div className="max-w-xl text-center lg:text-left">
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">Three Steps <br/>to the <span className="text-gold-500">Gold Standard.</span></h2>
                  <p className="text-lg text-gray-500 font-medium">The A-List Network Hub rewards the high-standard bridge builders who ensure South Florida remains the hub of home service quality.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                  {steps.map((step, i) => (
                     <div key={i} className={`p-8 rounded-[2.5rem] ${step.color} h-full flex flex-col`}>
                        <div className="mb-6 shrink-0">
                           <step.icon className="w-8 h-8" />
                        </div>
                        <h4 className="text-xl font-black mb-4 leading-tight">{step.title}</h4>
                        <p className="text-sm font-medium leading-relaxed opacity-70 italic">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Deep Link Redirect CTA */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden text-center px-4">
         <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gold" strokeWidth="0.5" />
                  </pattern>
               </defs>
               <rect width="100" height="100" fill="url(#grid)" />
            </svg>
         </div>

         <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gold-400 rounded-full text-xs font-black uppercase tracking-widest mb-12">
               <Award className="w-4 h-4" />
               A-List Builder Program
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight leading-none">Your Network Hub <br/>Starts in the App.</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link
                  href={APP_GATEWAY_URL}
                  target="_blank"
                  className="group relative inline-flex items-center justify-center bg-gold-500 text-gray-950 px-16 py-7 rounded-[2.5rem] font-black text-2xl transition-all hover:bg-gold-400 hover:scale-105 active:scale-95 shadow-2xl shadow-gold-500/20"
               >
                  <Smartphone className="mr-4 h-8 w-8 transition-transform group-hover:rotate-12" />
                  Open App Now
                  <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
               </Link>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-10">
               <div className="flex items-center gap-2 opacity-50">
                  <ShieldCheck className="w-5 h-5 text-gold-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Verified Payouts</span>
               </div>
               <div className="flex items-center gap-2 opacity-50">
                  <Gem className="w-5 h-5 text-gold-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Premium Rewards</span>
               </div>
               <div className="flex items-center gap-2 opacity-50">
                  <Target className="w-5 h-5 text-gold-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Real-time Tracking</span>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Meta */}
      <section className="py-24 px-4 text-center bg-white border-t border-gray-100">
         <Heart className="w-12 h-12 text-gold-600 mx-auto mb-8 animate-pulse" />
         <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Connect. Build. Prosper.</h2>
         <p className="text-gray-500 font-medium text-lg italic">The A-List Network Hub: Built for Florida's elite bridge builders.</p>
      </section>
    </div>
  );
}
