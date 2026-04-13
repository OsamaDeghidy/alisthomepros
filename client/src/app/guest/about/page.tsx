'use client';

import { 
  Target, 
  ArrowRight, 
  Smartphone, 
  Zap, 
  Shield, 
  ArrowLeft, 
  Globe,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function GuestAboutPage() {
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
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight">
             This isn't a directory.<br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">It never was.</span>
           </h1>
           <div className="text-xl md:text-2xl text-white/80 font-medium max-w-4xl mx-auto leading-relaxed space-y-6">
             <p>
               <GoldText>A-List</GoldText> Home Professionals is a high-performance ecosystem — engineered for Florida's most serious construction and home service professionals. The ones who show up on time, do the work right, and build reputations that outlast any algorithm.
             </p>
             <p>
               We didn't build another list to scroll through. We built an operating system for the trades — where verified professionals connect with real projects, where reputation is earned and not purchased, and where the entire industry moves faster, smarter, and cleaner than it ever has before.
             </p>
             <p className="text-white font-bold italic pt-4">
               If you're looking for the old way of doing things, you won't find it here.
             </p>
             <p className="text-primary-400 font-black text-2xl md:text-3xl pt-2 uppercase tracking-tight">
               A-List is where the best professionals in Florida come to compete — and win.
             </p>
           </div>
        </div>
      </section>

      {/* 3.4 Why A-List Home Professionals */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-xs font-black mb-8 tracking-widest uppercase">
               <Target className="w-4 h-4 text-primary-600" />
               Why A-List Home Professionals
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-950 mb-16 tracking-tighter leading-tight">
               The System Is Broken.<br/>
               <span className="text-primary-600">We’re Replacing It.</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               {/* Left Column: The Problem */}
               <div className="lg:col-span-7 space-y-8 text-xl text-gray-600 font-medium leading-relaxed">
                  <p>
                     The construction lead generation industry has been running the same broken play for over two decades — and contractors and property owners are both paying the price.
                  </p>
                  <p>
                     Here's what actually happens on traditional platforms: a property owner submits a request. That lead gets packaged and sold — not once, but to four, five, sometimes six contractors at the same time. Every one of those contractors pays for that lead. Every one of them makes the same call. The property owner gets bombarded. The contractors burn money. Nobody wins except the platform collecting fees on every transaction.
                  </p>
                  <div className="p-8 bg-gray-50 rounded-3xl border-l-4 border-primary-500 my-8">
                     <p className="text-gray-900 font-bold">
                        Research consistently shows that contractor churn on legacy lead platforms is driven by one thing above everything else: low-quality, recycled leads that don't convert. More than 60% of independent contractors report paying for leads that were already sold to multiple competitors. The return on investment on traditional platforms has collapsed. And contractors know it.
                     </p>
                  </div>
                  <p>
                     On the property owner side, the picture is equally grim. Legacy platforms have eroded trust. With little to no real vetting behind their so-called verified badges, homeowners have been matched with unlicensed operators, abandoned projects, and professionals who disappeared after the deposit cleared. The legal and financial fallout from unvetted contractor matches costs Florida property owners millions every single year.
                  </p>
               </div>

               {/* Right Column: The Solution */}
               <div className="lg:col-span-5 relative">
                  <div className="bg-gray-950 rounded-[3rem] p-12 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] sticky top-32 border border-gray-800">
                     <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary-500/20">
                        <Zap className="w-8 h-8" />
                     </div>
                     <p className="text-2xl font-medium leading-relaxed mb-8 italic text-white/90">
                        "The traditional model wasn’t built for the professional. It was built to monetize the gap between them. <GoldText>A-List</GoldText> Home Professionals was built to close that gap — permanently."
                     </p>
                     <div className="space-y-6 pt-8 border-t border-gray-800">
                        <p className="text-lg text-gray-300 font-medium">
                           We are not a lead reseller. We are not a pay-to-play directory. We are an ecosystem — one where professionals are validated before they ever touch a client, where leads are exclusive and qualified, and where the infrastructure actually supports the business of building.
                        </p>
                        <p className="text-xl font-black text-primary-400 tracking-wide uppercase pt-4">
                           This is the future of construction in Florida. It’s not coming.<br/>
                           <span className="text-white text-3xl mt-2 block">It’s here.</span>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3.5 Message from the Founder */}
      <section className="py-32 px-4 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <UserCheck className="w-96 h-96" />
         </div>
         
         <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-full text-xs font-black mb-12 tracking-widest uppercase relative z-10">
               <Shield className="w-4 h-4" />
               Message from the Founder
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 mb-6 tracking-tighter leading-tight relative z-10">
              Jeffrey Donald West Jr.<br/>
              <span className="text-2xl md:text-3xl text-gray-500 font-bold tracking-tight">Founder, <GoldText>A-List</GoldText> Home Professionals</span>
            </h2>

            <div className="space-y-8 text-xl font-medium text-gray-800 leading-relaxed relative z-10 mt-12 bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
               <p>
                  I built this because the industry I love has been failing the people inside it.
               </p>
               <p>
                  I’ve spent years in construction. Not on the business side — on the ground, watching how this industry actually works. Watching how new contractors with real skill can’t get visibility because the platforms gatekeep exposure behind ad budgets. Watching veterans — guys who’ve been building Florida for twenty, thirty years — burned out and bitter because they’ve been handed the same recycled leads over and over again, competing against five other contractors for a job that maybe one of them gets. And the platform? They already got paid. Every time.
               </p>
               <p>
                  I watched the trust erode in real time. Property owners getting burned by guys who had no business being on any legitimate platform in the first place. Contractors losing jobs to competitors who gamed reviews. Everybody exhausted. Nobody building anything that actually lasted.
               </p>
               <p className="text-2xl font-bold text-gray-950 italic border-l-4 border-gray-200 pl-6 my-10">
                  That’s when I knew — this wasn’t a problem you fix with a better marketing campaign. This was a structural failure. And structural failures require structural solutions.
               </p>
               <p>
                  So I started studying the platforms that actually changed industries. Uber didn’t just make taxis more convenient — they rebuilt the entire relationship between the rider, the driver, and the infrastructure connecting them. They created accountability, transparency, and a system where the quality of the experience was the product. That model stayed with me.
               </p>
               <p>
                  I started asking: what would that look like for construction? What if the platform actually served the professional — not just processed them? What if property owners could connect with people who genuinely earned their standing? What if "verified" actually meant something?
               </p>
               <p className="text-2xl font-black text-primary-600">
                  That’s what A-List is. And you have to earn it.
               </p>

               <div className="my-16 pt-12 border-t border-gray-100">
                  <h3 className="text-3xl font-black text-gray-950 tracking-tighter mb-6">Everyone Has a Place. Not Everyone Has the Badge.</h3>
                  <p className="mb-6">
                     Now — I want to be clear about something, because it matters. A-List isn’t just for licensed contractors. The skilled crewman who handles handyman work, small repairs, the jobs that don’t require a license but absolutely require skill and trust — he belongs here too. He’s part of this industry. He’s part of this ecosystem. And on A-List, he goes through the same vetting process as everyone else. No license required for his tier — but the standards? Those don’t change.
                  </p>
                  <p className="mb-6">
                     Here’s how the platform works. There are two tiers. And the difference between them is everything.
                  </p>
                  <p className="mb-6">
                     When you join A-List for free, you become an <strong>A-List Member (Unverified)</strong>. You’re inside the ecosystem. Your business is visible to others in the network. People can see who you are, what you do, where you operate. That’s real value. That’s exposure. But exposure and visibility are not the same thing.
                  </p>
                  <p className="text-2xl font-bold text-gray-950 mb-6 italic">
                     Visibility is what gets you projects. And visibility has to be earned.
                  </p>
                  <p className="mb-6">
                     When you invest in your visibility on A-List — when you go through the verification, the validation, the accountability process, when you earn your badges — that’s when you become <strong><GoldText>A-List</GoldText> Certified</strong>. That’s when the platform positions you for projects. That’s when property owners searching for a professional find you first. That’s when the leads come. That’s when the work comes.
                  </p>
                  <p>
                     A-List Members (Unverified) are in the family. They’re inside the ecosystem. But they haven’t yet done what it takes to carry the certified name. The badge isn’t given — it’s built. Through credentials. Through accountability. Through a process that proves you’re not just in this industry — you’re the best of it.
                  </p>
               </div>

               <div className="my-16 pt-12 border-t border-gray-100">
                  <h3 className="text-3xl font-black text-gray-950 tracking-tighter mb-6">Who A-List Is Built For</h3>
                  <p className="mb-6">
                     We don’t certify everyone who applies. We are building a network of Florida’s top professionals — general contractors, skilled tradespeople, project coordinators, handymen, and the income earners who keep this industry moving. Everyone who earns that certified badge has been vetted. Their credentials check out. Their reputation is real. When a property owner connects with an A-List Certified professional, they know exactly what that means.
                  </p>
                  <p className="mb-6">
                     We’ve built AI into the infrastructure — not as a gimmick, but as the backbone of how we match, validate, monitor, and scale. This platform can do things the legacy systems were never designed to do, because the legacy systems were never designed with the professional in mind.
                  </p>
                  <p className="mb-6 text-xl text-gray-900 font-bold">
                     I built A-List for the contractor who’s tired of losing. For the property owner who’s tired of gambling. For the new professional who deserves a real shot, and the veteran who deserves real respect. For the skilled crewman who’s been doing excellent work for years without anyone giving him the platform he deserves.
                  </p>
                  <p className="text-2xl font-black text-primary-600 mb-8">
                     Join free. Get exposure. But if you want to be known as the best — you have to earn it.
                  </p>
                  <p className="text-2xl italic font-medium text-gray-600">
                     "This is the platform I wish had existed when I was in the field.<br/>
                     <span className="text-gray-950 font-bold mt-2 block">Now it does.</span>"
                  </p>
                  
                  <div className="mt-12 pt-8 flex items-center justify-between relative z-10 w-full pl-6 border-l-4 border-primary-500">
                     <div>
                        <h4 className="text-2xl font-black text-gray-950 tracking-tighter">— Jeffrey Donald West Jr.</h4>
                        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs mt-2">Founder, A-List Home Professionals</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* App Bridge Section (CTA) */}
      <section className="py-32 bg-gray-950 text-white relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-primary-600/20 rounded-full blur-[200px] pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-none tracking-tighter">Everything is managed <br/><span className="text-primary-400">inside the A-List App.</span></h2>
            <p className="text-white/60 mb-16 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto">Secure payments, verified profiles, and milestone tracking are handled exclusively in-app for your protection.</p>
            <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="group relative inline-flex items-center justify-center bg-white text-gray-950 px-20 py-8 rounded-[3rem] font-black text-3xl transition-all hover:bg-primary-50 hover:text-primary-600 hover:scale-[1.02] active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            >
               <Smartphone className="w-10 h-10 mr-5 text-primary-500" />
               Get the App
               <ArrowRight className="ml-5 h-10 w-10 transition-transform group-hover:translate-x-3" />
            </Link>
         </div>
      </section>
    </div>
  );
}
