'use client';

import { 
  ShieldCheck, 
  ArrowRight, 
  Smartphone,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  Coins,
  TrendingUp,
  Network,
  X,
  Check,
  Award,
  Users,
  MessageSquare,
  Search,
  Wallet,
  Scale,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';
import { motion } from 'framer-motion';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function GuestPricingPage() {
  const tiers = [
    {
      name: 'Network Access',
      price: '$0',
      regularPrice: '$0',
      desc: 'Join the ecosystem and start building your reputation.',
      features: ['Basic profile', 'Basic interaction', 'Basic visibility'],
      cta: 'Join Now',
      isFounding: false
    },
    {
      name: 'Home Pro',
      price: '$100',
      regularPrice: '$200',
      period: '/mo',
      desc: 'The elite standard for South Florida contractors.',
      features: ['Priority Verification', 'Exclusive Opportunities', 'Pro Visibility'],
      cta: 'Become a Pro',
      isFounding: true
    },
    {
      name: 'Crew Member',
      price: '$50',
      regularPrice: '$80',
      period: '/mo',
      desc: 'For skilled workers ready to join top-tier teams.',
      features: ['Team Matching', 'Job Alerts', 'Milestone Protection'],
      cta: 'Join a Crew',
      isFounding: true
    },
    {
      name: 'Home Pro — Lifetime',
      price: '$5,000',
      period: 'one-time',
      desc: 'Eternal access to the A-List ecosystem.',
      features: ['All Pro Features', 'Lifetime Status', 'No Recurring Fees'],
      cta: 'Secure Lifetime',
      isFounding: false
    },
    {
      name: 'Crew Member — Lifetime',
      price: '$3,500',
      period: 'one-time',
      desc: 'Forever part of Florida\'s elite crew network.',
      features: ['All Crew Features', 'Lifetime Status', 'No Recurring Fees'],
      cta: 'Secure Lifetime',
      isFounding: false
    }
  ];

  const steps = [
    { 
      icon: Network, 
      title: 'Invite Experts', 
      desc: 'Connect property owners, crew members, and specialists to the secure ecosystem.',
      step: '01'
    },
    { 
      icon: Coins, 
      title: 'Active Multipliers', 
      desc: 'Every successful milestone in your network triggers a builder reward.',
      step: '02'
    },
    { 
      icon: TrendingUp, 
      title: 'Scale Earnings', 
      desc: 'Watch your referral earnings grow as your bridge connects more professionals.',
      step: '03'
    }
  ];

  const benefits = [
    { icon: Search, title: 'Job Opportunities', desc: 'Direct access to high-value project leads.' },
    { icon: MessageSquare, title: 'Direct Messaging', desc: 'Communicate securely within the ecosystem.' },
    { icon: Users, title: 'Crew Builder', desc: 'Form or join elite teams for complex projects.' },
    { icon: Star, title: 'Pro Visibility', desc: 'Stand out with the A-List verified badge.' },
    { icon: Wallet, title: 'Project Funds Account', desc: 'Secure payment protection for every milestone.' },
    { icon: Scale, title: 'Network Multipliers', desc: 'Earn rewards for growing the A-List network.' },
    { icon: CreditCard, title: 'Secure & Direct Payments', desc: 'Fast, reliable payouts on project completion.' }
  ];

  const comparison = [
    { 
      feature: 'Leads', 
      trad: 'Pay for leads — shared with multiple contractors', 
      alist: 'Exclusive, verified opportunities — no bidding wars' 
    },
    { 
      feature: 'Quality', 
      trad: 'Leads recycled and resold repeatedly', 
      alist: 'Real connections, not recycled data' 
    },
    { 
      feature: 'Verification', 
      trad: 'No verification — anyone can sign up', 
      alist: 'Every member is verified and validated' 
    },
    { 
      feature: 'Trust', 
      trad: 'Property owners can\'t trust who they hire', 
      alist: 'Property owners know every pro is A-List certified' 
    },
    { 
      feature: 'Profit', 
      trad: 'Platform profits, contractor competes', 
      alist: 'Platform builds — everyone in the ecosystem wins' 
    },
    { 
      feature: 'Value', 
      trad: 'No community or network value', 
      alist: 'Built-in network multiplier and crew builder' 
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900 pb-32">
      {/* Hero Header */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-4xl mx-auto relative z-10">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded-full text-xs font-black uppercase tracking-widest mb-8">
              <Star className="w-4 h-4" />
              Elite Membership
           </div>
           <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase italic pr-12 overflow-visible">Choose Your <br/><span className="inline-block text-primary-400 pr-10">Power in the Hub.</span></h1>
           <p className="text-xl md:text-2xl text-white/40 font-medium max-w-3xl mx-auto leading-relaxed italic">
              "Build the bridge. Connect the pros. Earn the rewards. The A-List Home Pros ecosystem is built for Florida's elite bridge builders."
           </p>
        </div>
      </section>

      {/* Membership Tiers Grid */}
      <section className="py-24 px-4 -mt-20 relative z-20">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
               {tiers.map((tier, i) => (
                  <div key={i} className={`flex flex-col bg-white rounded-[3rem] p-8 border ${tier.isFounding ? 'border-primary-200 ring-4 ring-primary-50/50' : 'border-gray-100'} shadow-2xl hover:scale-[1.02] transition-all group`}>
                     {tier.isFounding && (
                        <div className="bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full self-start mb-6 -ml-2 -mt-2">
                           Founding Rate
                        </div>
                     )}
                     <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{tier.name}</h3>
                     <p className="text-xs text-gray-400 font-medium mb-8 leading-relaxed h-12 overflow-hidden">{tier.desc}</p>
                     
                     <div className="mb-8">
                        {tier.isFounding && (
                           <span className="text-gray-300 line-through text-lg font-black mr-2">{tier.regularPrice}</span>
                        )}
                        <span className="text-4xl font-black text-gray-950">{tier.price}</span>
                        {tier.period && (
                           <span className="text-gray-400 text-xs font-black uppercase tracking-widest ml-1">{tier.period}</span>
                        )}
                     </div>

                     <ul className="space-y-4 mb-10 flex-1">
                        {tier.features.map((f, j) => (
                           <li key={j} className="flex items-start gap-2 text-xs font-bold text-gray-600">
                              <Check className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                              {f}
                           </li>
                        ))}
                     </ul>

                     <Link
                        href={`${APP_GATEWAY_URL}/register?tier=${tier.name.toLowerCase()}`}
                        target="_blank"
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all ${
                           tier.isFounding 
                           ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/20 hover:bg-primary-700' 
                           : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                     >
                        {tier.cta}
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Three Steps to Gold Standard Section */}
      <section className="py-32 px-4 bg-gray-950 relative overflow-hidden">
         <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
         </div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                  Three Steps to <br className="md:hidden"/>
                  the <GoldText>Gold</GoldText> Standard.
               </h2>
               <p className="text-white/40 font-medium text-lg max-w-2xl mx-auto italic">
                  The A-List ecosystem rewards the high-standard bridge builders who ensure South Florida remains the hub of home service quality.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {steps.map((step, i) => (
                  <div key={i} className="relative group">
                     <div className="absolute -top-10 left-10 text-[10rem] font-black text-white/5 leading-none transition-colors group-hover:text-primary-500/10">{step.step}</div>
                     <div className="relative p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] group-hover:border-primary-500/30 transition-all">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                           <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h4>
                        <p className="text-white/40 font-medium leading-relaxed italic">{step.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Membership Benefits Block */}
      <section className="py-32 px-4 bg-white">
         <div className="max-w-7xl mx-auto">
            <div className="bg-gray-50 rounded-[5rem] p-12 md:p-24 border border-gray-100 shadow-inner">
               <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Unlock the Full Power of the A-List Home Pros Ecosystem</h2>
                  <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                  {benefits.map((benefit, i) => (
                     <div key={i} className="flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                           <benefit.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">{benefit.title}</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed italic opacity-70">{benefit.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Platform Comparison Chart */}
      <section className="py-32 px-4">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">Performance Redefined.</h2>
               <p className="text-gray-500 font-medium italic">A-List Home Pros vs. Traditional Platforms</p>
            </div>

            <div className="rounded-[4rem] overflow-hidden border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)]">
               <div className="grid grid-cols-2 bg-gray-950 text-white p-10 md:p-12">
                  <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Traditional Platforms</div>
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-primary-400">A-List Home Pros</div>
               </div>
               
               <div className="divide-y divide-gray-100 bg-white">
                  {comparison.map((row, i) => (
                     <div key={i} className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-gray-100">
                        <div className="p-8 flex items-start gap-4">
                           <X className="w-5 h-5 text-gray-300 mt-1 shrink-0" />
                           <p className="text-sm font-bold text-gray-400 italic leading-relaxed">{row.trad}</p>
                        </div>
                        <div className="p-8 bg-primary-50/20 flex items-start gap-4">
                           <Check className="w-5 h-5 text-success-500 mt-1 shrink-0" />
                           <p className="text-sm font-black text-gray-900 leading-relaxed italic">{row.alist}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
         <Award className="w-20 h-20 text-primary-600 mx-auto mb-12 animate-pulse" />
         <h2 className="text-5xl md:text-8xl font-black text-gray-950 mb-12 tracking-tighter leading-none">Your <GoldText>Gold</GoldText> Standard <br/>Starts Here.</h2>
         <Link
           href={APP_GATEWAY_URL}
           target="_blank"
           className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-20 py-7 rounded-[2.5rem] font-black text-2xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl"
         >
           <Smartphone className="w-8 h-8 mr-4 text-primary-400 transition-transform group-hover:rotate-12" />
           Open App Now
           <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
         </Link>
      </section>
    </div>
  );
}
