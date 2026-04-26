'use client';

import { Smartphone, Layout, Star, ArrowUpRight, Zap, ShieldCheck, Heart, UserCheck, Camera, Box, MoveRight, Building2, Hammer, HardHat, Target, Share2, Play, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_GATEWAY_URL } from '@/config/site';
import { useEffect, useState } from 'react';

// Gold Component to enforce branding rule
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

// Reusable scrollable video gallery component
const VideoGallery = ({ title, description, videos }: { title: string, description?: string, videos: any[] }) => (
  <section className="py-16 px-4 relative overflow-hidden">
     <div className="max-w-7xl mx-auto">
        <div className="mb-12">
           <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter pr-4">{title}</h2>
           {description && <p className="text-gray-500 font-medium mt-3 text-lg leading-relaxed">{description}</p>}
        </div>
        
        <div className="flex overflow-x-auto pb-12 -mx-4 px-4 space-x-6 snap-x snap-mandatory">
           {videos.map((vid, i) => (
              <div key={i} className="snap-start shrink-0 w-[85vw] sm:w-[400px] lg:w-[450px] group">
                 <div className="aspect-[16/10] bg-gray-950 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden flex items-center justify-center cursor-pointer mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                    {vid.image && (
                      <Image src={vid.image} alt={vid.title} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    )}
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-400 transition-all duration-300 z-10 group-hover:scale-110">
                       <Play className="w-6 h-6 text-white ml-1 fill-current" />
                    </div>
                    {vid.duration && (
                      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-lg">
                         {vid.duration}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                 </div>
                 <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight leading-tight">{vid.title}</h4>
                 <p className="text-base text-gray-500 font-medium leading-relaxed">{vid.desc}</p>
              </div>
           ))}
        </div>
     </div>
     <style jsx>{`
       .flex::-webkit-scrollbar {
         display: none;
       }
       .flex {
         -ms-overflow-style: none;
         scrollbar-width: none;
       }
     `}</style>
  </section>
);

export default function InsideAListPage() {
  const [members, setMembers] = useState(0);
  const targetMembers = 1000;
  
  // Animated counter effect for Ticker
  useEffect(() => {
    const target = 842; // Example true current value
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
       current += Math.ceil(target / steps);
       if (current >= target) {
          setMembers(target);
          clearInterval(timer);
       } else {
          setMembers(current);
       }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const howItWorksVideos = [
    { title: 'How Clients Post Projects', duration: '1:45', desc: 'See the streamlined process for bringing your vision to the network taking you direct to a certified pro.', image: '/alist_luxury_kitchen.png' },
    { title: 'How Home Pros Get Work', duration: '2:15', desc: 'Watch how jobs find you without the traditional bidding wars and endless lead subscriptions.', image: '/alist_exterior_painting.png' },
    { title: 'How Payment Works', duration: '1:30', desc: 'Secure milestone funding explained step-by-step to protect both parties on a job build.', image: '/alist_project_management.png' },
    { title: 'How A-List Protects Everyone', duration: '3:00', desc: 'The mechanisms keeping bad actors out and holding the network standard rigorously high.' }
  ];

  const walkthroughVideos = [
    { title: 'Client Experience Walkthrough', duration: '4:20', desc: 'A full tour of the dashboard from the property owner\'s perspective—from finding a pro to tracking job milestones.' },
    { title: 'Home Pro Experience Walkthrough', duration: '5:15', desc: 'See the command center where top businesses manage their pipeline, manage project funds, and grow organically.' },
    { title: 'Crew Experience Walkthrough', duration: '3:40', desc: 'How skilled tradesmen navigate opportunities, find the right foreman to work for, and build their platform reputation.' },
  ];

  const spotlightVideos = [
    { title: 'Featured Home Pro: Apex Builders', desc: 'From solo contractor to 7-figure firm using the ecosystem.', image: '/alist_exterior_painting.png' },
    { title: 'Featured Crew Member: David M.', desc: 'How a master carpenter stays booked year-round, connecting with verified contractors directly in his area.', image: '/alist_project_management.png' },
    { title: 'Featured Project: The Boca Reveal', desc: 'A $450k renovation coordinated entirely inside the app between five independent trades.', image: '/alist_luxury_kitchen.png' },
  ];

  const featuredContent = [
    { title: 'Founder Message', duration: '4:00', desc: 'Jeffrey Donald West Jr. on the ongoing vision and future of A-List Home Professionals.' },
    { title: 'Big Updates & Announcements', duration: '2:30', desc: 'The latest rollouts to the ecosystem and network features.' },
    { title: 'Vision Clips', desc: 'Where the network is expanding next and what features are currently in production.' }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
       
      {/* Header Section */}
      <section className="pt-32 pb-16 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest mb-10 border border-primary-100">
            <Box className="w-5 h-5" />
            The Ecosystem
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-950 mb-8 tracking-tighter leading-none uppercase italic pr-12 overflow-visible">Inside <br/><span className="inline-block pr-10"><GoldText>A-List.</GoldText></span></h1>
          <p className="text-xl md:text-3xl text-gray-500 font-medium max-w-4xl mx-auto leading-relaxed tracking-tight">
            Explore the platform, the projects, and the professionals redefining the standard for home services in South Florida.
          </p>
        </div>
      </section>

      {/* Founding Member Ticker */}
      <section className="py-16 bg-gray-950 text-white border-y border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
             <Users className="w-4 h-4" />
             Founders Circle Initiative
          </div>
          <h3 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic pr-12 overflow-visible">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{members}</span> 
            <span className="text-white/20"> / {targetMembers}</span> 
            <span className="text-2xl text-primary-400 align-middle ml-4 bg-primary-500/10 px-4 py-2 rounded-2xl border border-primary-500/20">Secured</span>
          </h3>
          
          <div className="max-w-4xl mx-auto bg-white/5 rounded-full h-5 mb-6 overflow-hidden p-0.5 border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
             <div 
               className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-400 h-full rounded-full transition-all duration-[2000ms] ease-out relative overflow-hidden shadow-[0_0_20px_rgba(0,191,255,0.5)]" 
               style={{ width: `${(members / targetMembers) * 100}%` }}
             >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12"></div>
             </div>
          </div>
          <p className="text-white/40 text-base md:text-lg font-medium tracking-wide">Help us reach our genesis goal. Limited lifetime access remains.</p>
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </section>

      {/* Ecosystem section (Moved from Home) */}
      <section className="py-32 bg-gray-950 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div>
                  <div className="inline-flex items-center px-5 py-2.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full text-xs font-black mb-10 tracking-widest uppercase italic">
                     Centralized Command
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none pr-4">Everything Runs <br/><span className="text-primary-400">Inside the App.</span></h2>
                  <p className="text-2xl text-white/50 mb-16 leading-relaxed font-medium">From project funding to communication, everything is handled in one place.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                     {[
                        { title: 'Project Funds Account', desc: 'Secure payment protection for every milestone.' },
                        { title: 'Messaging System', desc: 'Direct, encrypted collaboration between roles.' },
                        { title: 'Job Tracking', desc: 'Real-time visibility into every construction phase.' },
                        { title: 'Crew Coordination', desc: 'Manage elite teams without leaving the ecosystem.' },
                        { title: 'Referral Tracking', desc: 'Monitor your rewards and network growth live.' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-5 items-start">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary-500 transition-colors mt-1">
                              <CheckCircle className="w-6 h-6 text-primary-400" />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold mb-2 tracking-tight text-white">{item.title}</h4>
                              <p className="text-white/40 text-sm leading-relaxed font-medium">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <Link
                    href={APP_GATEWAY_URL}
                    target="_blank"
                    className="mt-20 inline-flex items-center justify-center bg-white text-gray-950 px-16 py-6 rounded-[2.5rem] font-black text-xl hover:bg-primary-50 hover:text-primary-600 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group"
                  >
                     Enter the App
                     <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                  </Link>
               </div>
               
               <div className="relative">
                   <div className="aspect-[4/5] bg-gray-900/50 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-12 flex flex-col justify-center items-center text-center shadow-2xl relative z-10">
                      <Smartphone className="w-40 h-40 text-primary-500 mb-12 animate-pulse" />
                      <h3 className="text-5xl font-black mb-6 tracking-tighter leading-tight pr-4">Elite Control <br/>at Your Fingertips.</h3>
                      <p className="text-white/40 font-medium text-lg max-w-[320px] leading-relaxed">Your bridge into a safer, more profitable property services market.</p>
                   </div>
                   <div className="absolute top-10 -right-8 bg-white p-8 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20">
                      <ShieldCheck className="w-10 h-10 text-primary-600" />
                   </div>
                   <div className="absolute -bottom-6 -left-6 bg-primary-600 p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20">
                      <div className="text-white font-black text-3xl uppercase tracking-tighter leading-none mb-2"><GoldText>Gold</GoldText></div>
                      <div className="text-white/80 text-[10px] font-black uppercase tracking-widest">Standard Secured</div>
                   </div>
                </div>
            </div>

            {/* Comparison Block */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
               <div className="bg-white/5 p-12 md:p-20 backdrop-blur-md">
                  <h3 className="text-3xl font-black text-white/30 mb-12 uppercase tracking-widest">Traditional Platforms</h3>
                  <ul className="space-y-8">
                     {[
                        'Pay for leads that aren’t exclusive',
                        'Compete against multiple contractors',
                        'Limited control over project flow',
                        'Disconnected communication',
                        'No real network, just listings'
                     ].map((point, i) => (
                        <li key={i} className="flex items-center gap-4 text-white/50 font-bold">
                           <div className="w-2 h-2 rounded-full bg-white/20"></div>
                           {point}
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="bg-primary-600 p-12 md:p-20 text-white relative">
                  <h3 className="text-3xl font-black mb-12 uppercase tracking-widest text-primary-100">The A-List Network</h3>
                  <ul className="space-y-8 relative z-10">
                     {[
                        'Direct access to real opportunities',
                        'Position yourself instead of chasing leads',
                        'Build long-term relationships',
                        'Full project visibility and coordination',
                        'One connected ecosystem for every role'
                     ].map((point, i) => (
                        <li key={i} className="flex items-center gap-4 text-white font-black text-lg">
                           <CheckCircle className="w-6 h-6 text-gold-400" />
                           {point}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Galleries section content */}
      <div className="bg-gray-50 pt-24 pb-32">
        <VideoGallery 
           title="How It Works" 
           description="Detailed breakdowns of our core systems and the protection they offer."
           videos={howItWorksVideos} 
        />
        
        <VideoGallery 
           title="Platform Walkthroughs" 
           description="Step-by-step tours of the A-List dashboard tailored to your role."
           videos={walkthroughVideos} 
        />

        <VideoGallery 
           title="A-List Spotlights" 
           description="Stories from the network. See how top pros and huge projects thrive inside A-List."
           videos={spotlightVideos} 
        />

        <VideoGallery 
           title="Featured Content" 
           description="Direct updates from the founders and the future of the platform."
           videos={featuredContent} 
        />
      </div>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center bg-white border-t border-gray-100">
        <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-12 tracking-tighter pr-4">Ready to join <br/>the <GoldText>Gold</GoldText> Standard?</h2>
        <Link
          href={APP_GATEWAY_URL}
          target="_blank"
          className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-20 py-8 rounded-[2.5rem] font-black text-3xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl"
        >
          <Smartphone className="w-10 h-10 mr-5 text-primary-400" />
          Join the Network
          <ArrowUpRight className="ml-5 h-10 w-10 transition-transform group-hover:translate-x-2" />
        </Link>
      </section>

    </div>
  );
}
