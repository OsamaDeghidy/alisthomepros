'use client';

import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function GuestInvestorsPage() {
  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white py-40 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 pt-10">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-16 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 tracking-tighter leading-[0.85] uppercase italic pr-12 overflow-visible">
             Build the <br/>
             <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Future</span> of Construction.
           </h1>
           <p className="text-2xl md:text-3xl text-white/60 font-medium max-w-3xl leading-relaxed italic mb-16">
             A-List Home Professionals is the infrastructure for a $600B industry currently operating on broken legacy systems.
           </p>
           <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/investor-contact" className="px-12 py-6 bg-white text-gray-950 rounded-[2rem] font-black text-xl uppercase tracking-tighter hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-primary-500/20 text-center">
                Invest with A-List
              </Link>
              <button className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-xl uppercase tracking-tighter hover:bg-white/10 transition-all text-center">
                Download Deck
              </button>
           </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
           <ChevronDown className="w-10 h-10" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-4 bg-white" id="overview">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-[10px] font-black mb-10 tracking-widest uppercase italic">
                    <Target className="w-4 h-4 text-red-500" />
                    The Problem
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-8 tracking-tighter leading-none uppercase italic pr-12 overflow-visible">A Fragmented, <br/>Legacy System.</h2>
                 <p className="text-2xl text-gray-600 font-medium leading-relaxed italic mb-8">
                   Homeowners are gambling on unvetted reviews. Contractors are bleeding margins on recycled leads. The current lead-gen model is a parasitic middleman that adds no value to the final project.
                 </p>
                 <div className="space-y-6">
                    {[
                      "Recycled leads sold to 5+ competitors",
                      "No real accountability for 'verified' badges",
                      "Opaque pricing and hidden commissions",
                      "Fragmented communication and payment flows"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-gray-950 font-black uppercase italic tracking-tight">
                         <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                         {item}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-gray-50 rounded-[4rem] p-12 md:p-20 relative overflow-hidden border border-gray-100">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <TrendingUp className="w-64 h-64" />
                 </div>
                 <div className="relative z-10 space-y-12">
                    <div>
                       <span className="text-6xl font-black text-gray-950 tracking-tighter italic">$600B+</span>
                       <p className="text-gray-500 font-bold uppercase tracking-widest mt-2 text-sm">US Home Services Market</p>
                    </div>
                    <div>
                       <span className="text-6xl font-black text-gray-950 tracking-tighter italic">60%</span>
                       <p className="text-gray-500 font-bold uppercase tracking-widest mt-2 text-sm">Contractor Churn on Legacy Platforms</p>
                    </div>
                    <div>
                       <span className="text-6xl font-black text-gray-950 tracking-tighter italic">Zero</span>
                       <p className="text-gray-500 font-bold uppercase tracking-widest mt-2 text-sm">Real-Time Vetting Infrastructure</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32 px-4 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-600/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
           <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white border border-white/10 rounded-full text-[10px] font-black mb-10 tracking-widest uppercase italic">
              <ShieldCheck className="w-4 h-4 text-primary-400" />
              The Solution
           </div>
           <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-tight uppercase italic pr-12 overflow-visible">The A-List <br/><span className="inline-block text-primary-400 pr-10">Operating System.</span></h2>
           <p className="text-2xl text-white/60 font-medium max-w-4xl mx-auto leading-relaxed italic mb-20">
             We’ve built an ecosystem that validates professionals, protects payments, and automates trust. We don't sell leads; we build the infrastructure for elite delivery.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Verification Hub", desc: "AI-driven validation of credentials, history, and performance.", icon: ShieldCheck },
                { title: "Exclusive Access", desc: "Zero lead reselling. One professional, one project.", icon: Zap },
                { title: "Financial Shield", desc: "Integrated milestone-based payments and funds protection.", icon: BarChart3 }
              ].map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[3rem] text-left hover:bg-white/10 transition-all">
                   <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary-500/20">
                      <card.icon className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{card.title}</h3>
                   <p className="text-white/40 font-medium leading-relaxed italic">{card.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Why Now / Market Opportunity */}
      <section className="py-32 px-4 bg-white" id="early-access">
        <div className="max-w-5xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-[10px] font-black mb-10 tracking-widest uppercase italic">
              <TrendingUp className="w-4 h-4 text-[#B8960C]" />
              Market Opportunity
           </div>
           <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-10 tracking-tighter uppercase italic pr-12 overflow-visible">The Florida <br/>Land Grab.</h2>
           <p className="text-2xl text-gray-600 font-medium leading-relaxed italic mb-16">
             South Florida is the fastest-growing construction market in the United States. We are capturing the most elite segment of this market before scaling nationally.
           </p>
           
           <div className="bg-gray-50 rounded-[4rem] p-12 md:p-20 border border-gray-100 flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full mb-16">
                 <div>
                    <span className="text-5xl font-black text-gray-950 tracking-tighter italic">10X</span>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs">Project Growth Rate</p>
                 </div>
                 <div>
                    <span className="text-5xl font-black text-gray-950 tracking-tighter italic">Premium</span>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs">Market Positioning</p>
                 </div>
                 <div>
                    <span className="text-5xl font-black text-gray-950 tracking-tighter italic">Scalable</span>
                    <p className="text-gray-400 font-bold uppercase tracking-widest mt-2 text-xs">Infrastructure Model</p>
                 </div>
              </div>
              <Link href="/investor-contact" className="group inline-flex items-center gap-6 px-16 py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-tighter hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/10">
                 Request Investor Package
                 <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-3" />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
