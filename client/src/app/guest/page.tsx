'use client';

import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Star, 
  Users, 
  MapPin, 
  Hammer, 
  Briefcase, 
  Target, 
  Share2,
  Building2,
  HardHat,
  Search
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestHomePage() {
  const [zipCode, setZipCode] = useState('');
  const [service, setService] = useState('');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to app with context
    const url = new URL(APP_GATEWAY_URL);
    if (zipCode) url.searchParams.append('zip', zipCode);
    if (service) url.searchParams.append('service', service);
    window.location.href = url.toString();
  };

  const audiences = [
    {
      id: 'homeowners',
      title: 'Homeowners',
      desc: 'Find & book elite Florida pros for any job, small or complex.',
      icon: Building2,
      color: 'bg-primary-50 text-primary-600',
      cta: 'Find a Pro'
    },
    {
      id: 'home-pros',
      title: 'Home Pros',
      desc: 'Grow your business with high-quality leads and professional tools.',
      icon: Hammer,
      color: 'bg-gold-50 text-gold-600',
      cta: 'Join as Pro'
    },
    {
      id: 'crew-members',
      title: 'Crew Members',
      desc: 'Connect with contractors and find consistent work on major projects.',
      icon: HardHat,
      color: 'bg-blue-50 text-blue-600',
      cta: 'Find Work'
    },
    {
      id: 'specialists',
      title: 'Specialists',
      desc: 'Elite management for large-scale residential and commercial projects.',
      icon: Target,
      color: 'bg-gray-900 text-white',
      cta: 'Specialist Access'
    },
    {
      id: 'referral-partners',
      title: 'Referral Partners',
      desc: 'Build your network and earn multipliers on every successful job.',
      icon: Share2,
      color: 'bg-gold-600 text-white',
      cta: 'Start Earning'
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-[#fcfdff]">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary-50 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gold-50 text-gold-700 rounded-full text-xs font-black mb-8 animate-fade-in border border-gold-100 tracking-widest uppercase">
                <MapPin className="w-3 h-3 mr-2 text-gold-600" />
                Serving All of South Florida
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter">
                Home Services <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500">
                  Reimagined.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                The elite ecosystem for South Florida home maintenance. From quick fixes to large-scale specialist projects, manage everything in one powerful app.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link
                  href={APP_GATEWAY_URL}
                  target="_blank"
                  className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200"
                >
                  <Smartphone className="mr-3 h-6 w-6 text-gold-400" />
                  Get the App Now
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
                
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center text-gray-900 font-black text-lg hover:text-primary-600 transition-colors group tracking-tight"
                >
                  How it Works
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-10">
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-700 shadow-sm">JW</div>
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-gold-100 flex items-center justify-center text-[10px] font-black text-gold-700 shadow-sm">AS</div>
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-700 shadow-sm">MK</div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Elite Network</span>
                       <span className="text-sm font-black text-gray-900 leading-none">5k+ Florida Pros</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
                    <span className="text-xs font-black text-gray-900 ml-2">4.9/5 RATING</span>
                 </div>
              </div>
            </div>

            {/* Lead Capture Module */}
            <div className="relative">
              <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
                 <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Need a Pro?</h3>
                 <p className="text-gray-500 mb-8 font-medium">Tell us what you need, and we'll bridge you to the right specialist.</p>
                 
                 <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input 
                         type="text" 
                         placeholder="What service do you need?" 
                         className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                         value={service}
                         onChange={(e) => setService(e.target.value)}
                         required
                       />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input 
                         type="text" 
                         placeholder="Zip Code" 
                         className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                         value={zipCode}
                         onChange={(e) => setZipCode(e.target.value)}
                         required
                       />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center group shadow-xl shadow-gray-200"
                    >
                       Continue in App
                       <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                 </form>
                 
                 <div className="mt-8 flex items-center justify-center gap-8 opacity-30 grayscale contrast-125">
                    <span className="text-xs font-black tracking-tighter">FLORIDA TRUST</span>
                    <span className="text-xs font-black tracking-tighter underline decoration-gold-500 underline-offset-4">PRO SECURE</span>
                    <span className="text-xs font-black tracking-tighter italic">ELITE HUB</span>
                 </div>
              </div>
              {/* Decorative Orb */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-400 rounded-full blur-[80px] opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Routing Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Built for the Entire Ecosystem</h2>
               <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Select your role to see how A-List Home Professionals empowers your workflow.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {audiences.map((audience) => (
                  <Link 
                    key={audience.id}
                    href={APP_GATEWAY_URL}
                    target="_blank"
                    className="p-10 rounded-[3rem] border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:border-white transition-all group flex flex-col h-full"
                  >
                     <div className={`w-16 h-16 ${audience.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        <audience.icon className="w-8 h-8" />
                     </div>
                     <h3 className="text-2xl font-black text-gray-900 mb-4">{audience.title}</h3>
                     <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-1">{audience.desc}</p>
                     <div className="flex items-center text-gray-900 font-black text-sm uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                        {audience.cta}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* One Ecosystem Showcase */}
      <section className="py-32 bg-gray-900 text-white border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 text-primary-400 rounded-full text-xs font-black mb-8 tracking-widest uppercase">
                     Total Control
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none">The Specialist <br/><span className="text-gold-400">Standard.</span></h2>
                  
                  <div className="space-y-10">
                     {[
                        { title: 'Home Services Reality', desc: 'No more generic templates. We connect you with verified tradespeople who know the Florida landscape.' },
                        { title: 'Project Specialists', desc: 'Access elite project managers for complex renovations and residential builds.' },
                        { title: 'Secure App Ecosystem', desc: 'Contracts, payments, and messaging—all handled in the highly secure A-List app.' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-6">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-gold-500 transition-colors">
                              <CheckCircle className="w-6 h-6 text-gold-400" />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <Link
                    href={APP_GATEWAY_URL}
                    target="_blank"
                    className="mt-16 inline-flex items-center justify-center bg-gold-500 text-gray-950 px-12 py-5 rounded-2xl font-black text-lg hover:bg-gold-400 transition-all shadow-xl shadow-gold-500/20"
                  >
                     Explore the App
                     <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
               </div>
               
               <div className="relative">
                  <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 p-12 flex flex-col justify-center items-center text-center">
                     <Smartphone className="w-24 h-24 text-gold-500 mb-12" />
                     <h3 className="text-3xl font-black mb-4 tracking-tight">Trust matters. <br/>Download A-List.</h3>
                     <p className="text-white/40 font-medium">Your bridge into a safer home services market.</p>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl">
                     <Users className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-gold-500 p-6 rounded-3xl shadow-2xl">
                     <ShieldCheck className="w-8 h-8 text-gray-900" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Final Meta */}
      <section className="py-24 px-4 text-center bg-white border-t border-gray-100">
         <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight tracking-tighter">Florida Pros. Global Standard.</h2>
         <p className="text-gray-500 font-medium mb-12">Copyright © 2026 A-List Home Professionals. All rights reserved.</p>
         <div className="flex justify-center gap-8 text-gray-300 font-black text-xs uppercase tracking-[0.2em]">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Safety</span>
         </div>
      </section>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
