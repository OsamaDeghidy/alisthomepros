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
  Cpu,
  CreditCard,
  Phone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function AboutPage() {
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      
      {/* Photo Modal */}
      <AnimatePresence>
        {isPhotoExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoExpanded(false)}
            className="fixed inset-0 z-[100] bg-gray-950/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <Image 
                src="/images/jeffery.jpeg" 
                alt="Jeffrey D. West Jr." 
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
             <p>
               <GoldText>A-List</GoldText> Home Professionals is a high-performance ecosystem — engineered for South Florida's most elite construction and home service forces.
             </p>
             <p className="text-primary-400">
               Stop scrolling through lists of "providers." Start operating inside a system where the best move forward and the rest get left behind.
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
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-xs font-black mb-8 tracking-widest uppercase italic">
               <TrendingUp className="w-4 h-4 text-primary-600" />
               Why A-List Home Professionals
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-gray-950 mb-20 tracking-tighter leading-[0.9] uppercase italic pr-12 overflow-visible">
               The Lead Generation System <br className="hidden md:block"/>
               <span className="inline-block text-primary-600 pr-10">Is Professionally Broken.</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
               <div className="space-y-10 text-2xl text-gray-600 font-medium leading-relaxed">
                  <p>
                     For twenty years, the "big platforms" have run the same predatory play: capture a property owner's data, package it as a "lead," and sell it to five, six, sometimes ten contractors simultaneously. 
                  </p>
                  <p className="text-gray-950 font-black italic border-l-8 border-primary-500 pl-8 py-4 bg-primary-50/30">
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
                     { title: 'Secured Payments', desc: 'Processed via Stripe. We never hold your funds.', icon: CreditCard }
                  ].map((item, i) => (
                     <div key={i} className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col items-start gap-6 hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
                           <item.icon className="w-8 h-8 text-primary-600 group-hover:text-white" />
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-gray-950 mb-3 uppercase tracking-tighter">{item.title}</h4>
                           <p className="text-gray-500 font-medium leading-tight">{item.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 3.5 Message from the Founder */}
      <section className="py-32 px-4 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none text-primary-900">
            <UserCheck className="w-96 h-96" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
               <div className="lg:col-span-5 sticky top-32">
                  <div 
                    className="relative group cursor-zoom-in"
                    onClick={() => setIsPhotoExpanded(true)}
                  >
                     <div className="absolute -inset-4 bg-gradient-to-tr from-primary-600 to-[#B8960C] rounded-[3.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                        <Image 
                          src="/images/jeffery.jpeg" 
                          alt="Jeffrey D. West Jr." 
                          width={800} 
                          height={1000} 
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                     </div>
                     <div className="mt-8 flex flex-col items-center lg:items-start gap-4">
                        <div className="flex items-center gap-3 text-[#B8960C] bg-[#B8960C]/5 px-6 py-3 rounded-2xl border border-[#B8960C]/10">
                           <Phone className="w-5 h-5" />
                           <span className="font-black text-lg tracking-tighter uppercase italic">1-866-88- A-List</span>
                        </div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] pl-2 italic">Direct Founder Access</p>
                     </div>
                  </div>
               </div>

               {/* Right Column: Content */}
               <div className="lg:col-span-7 space-y-12">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-full text-xs font-black tracking-widest uppercase italic">
                        <Shield className="w-4 h-4" />
                        A Message from the Founder
                     </div>
                     
                     <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-none italic uppercase pr-4">
                        Jeffrey Donald <br className="hidden md:block"/> West Jr.
                     </h2>
                     <p className="text-xl md:text-2xl text-gray-400 font-bold tracking-widest uppercase italic">Founder, <GoldText>A-List</GoldText> Home Pros</p>
                  </div>

                  <div className="space-y-10 text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
                     <div className="space-y-6">
                        <h3 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter border-l-8 border-[#B8960C] pl-6">Why I Built This</h3>
                        <p className="text-2xl md:text-3xl font-black text-gray-950 tracking-tighter uppercase italic leading-tight text-primary-600">
                           I didn't build this in a boardroom. I built it because I saw the system eat the people who build Florida.
                        </p>
                        <p>
                           I've spent years in construction. I've been on the ground, watching how this industry actually moves. I saw new contractors with massive skill get ignored because they didn't have the ad budget to pay off the gatekeepers. I saw veterans — guys who've been doing high-end work in Florida for thirty years — burned out and disgusted because lead platforms were selling them the same recycled leads they just sold to five of their competitors.
                        </p>
                        <p>
                           The trust was dead. Homeowners were gambling on whoever had the biggest marketing budget, not the best results. Contractors were losing jobs to guys who gamed the review systems. It was a structural failure, and it needed a structural solution.
                        </p>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter border-l-8 border-primary-600 pl-6">What Changed My Thinking</h3>
                        <p>
                           I started studying the platforms that actually changed industries. Uber didn't just make taxis more convenient — they rebuilt the entire relationship between the rider, the driver, and the infrastructure connecting them. They created accountability, transparency, and a system where the quality of the experience was the product.
                        </p>
                        <p>
                           That model stayed with me. I started asking: what would that look like for construction? What if the platform actually served the professional — not just processed them? What if "license-verified" actually meant something specific, documented, and current? What if homeowners could connect with someone who genuinely earned their standing?
                        </p>
                     </div>

                     <div className="space-y-6">
                        <h3 className="text-3xl font-black text-gray-950 uppercase italic tracking-tighter border-l-8 border-[#B8960C] pl-6">What A-List Is</h3>
                        <p className="bg-gray-950 text-white p-10 rounded-[3rem] font-black italic relative overflow-hidden shadow-2xl">
                           <span className="relative z-10">That's what A-List is. And you have to earn it.</span>
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

                     <div className="pt-16 border-t border-gray-100 flex items-center justify-between">
                        <div>
                           <p className="text-xl text-gray-400 font-bold uppercase tracking-[0.3em] mb-4">The New Standard</p>
                           <h4 className="text-3xl font-black text-gray-950 tracking-tighter uppercase">— Jeffrey D. West Jr.</h4>
                        </div>
                        <div className="hidden md:block">
                           <ShieldCheck className="w-20 h-20 text-primary-600 opacity-20" />
                        </div>
                     </div>
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
            <p className="text-white/60 mb-20 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl mx-auto">
               Secure payments via Stripe, verified profiles, and milestone tracking are handled exclusively inside the A-List ecosystem. We provide the bridge; we never hold your funds.
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
