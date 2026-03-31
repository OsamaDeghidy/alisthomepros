'use client';

import { Smartphone, Layout, Star, ArrowUpRight, Zap, ShieldCheck, Heart, UserCheck, Camera, Box, MoveRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestGalleryPage() {
  const projects = [
    {
      title: 'Luxury Kitchen Reveal',
      location: 'Boca Raton, FL',
      category: 'Renovation',
      image: '/alist_luxury_kitchen.png',
      stats: '4.9 Rating'
    },
    {
      title: 'Exterior Gold Standard',
      location: 'Palm Beach, FL',
      category: 'Painting & Stucco',
      image: '/alist_exterior_painting.png',
      stats: 'Verified Pro'
    },
    {
      title: 'Smart Project Management',
      location: 'Miami, FL',
      category: 'Specialist Management',
      image: '/alist_project_management.png',
      stats: '100% Milestone Success'
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-gold-100 selection:text-gold-900">
      {/* Visual Header */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gold-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 text-gold-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-gold-100">
            <Camera className="w-4 h-4" />
            Project Showcase
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 mb-8 tracking-tighter leading-none">The Standard <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-500">of Excellence.</span></h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            Witness the transformation. Every project in our gallery was managed, executed, and completed by verified A-List Specialists in South Florida.
          </p>
        </div>
      </section>

      {/* Featured Project Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {projects.map((project, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-8 shadow-2xl transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(247,144,9,0.2)] group-hover:-translate-y-4">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 p-10 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-4 border border-white/10">
                      {project.category}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 leading-tight">{project.title}</h3>
                    <p className="text-white/60 font-medium mb-6 flex items-center gap-2">
                       <MoveRight className="w-4 h-4 text-gold-400" />
                       {project.location}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                       <span className="text-xs font-black text-gold-400 uppercase tracking-widest">{project.stats}</span>
                       <div className="w-10 h-10 bg-white text-gray-950 rounded-xl flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                          <ArrowUpRight className="w-6 h-6" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Network Pro Section */}
      <section className="py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold-600 rounded-full blur-[200px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-gold-500/20">
                <UserCheck className="w-4 h-4" />
                Featured Specialist
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">Jeffrey West <br/><span className="text-gold-400">Master Finisher.</span></h2>
              <p className="text-xl text-white/50 font-medium mb-12 leading-relaxed italic">
                 "Professional excellence isn't just about the tools—it's about the standard. In West Palm Beach, A-List is the only bridge I trust for my clients and my crew."
              </p>
              
              <div className="flex flex-wrap gap-8 mb-16">
                 <div>
                    <h5 className="text-gold-400 font-black text-xs uppercase tracking-widest mb-2">Network Rank</h5>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
                    </div>
                 </div>
                 <div>
                    <h5 className="text-gold-400 font-black text-xs uppercase tracking-widest mb-2">Verified Since</h5>
                    <p className="font-bold">2023</p>
                 </div>
              </div>

              <Link
                href={APP_GATEWAY_URL}
                target="_blank"
                className="inline-flex items-center justify-center bg-white text-gray-950 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-gold-500 transition-all shadow-2xl"
              >
                View Network Profile
                <ArrowUpRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
            
            <div className="relative">
               <div className="aspect-square bg-white/5 border border-white/10 rounded-[4rem] p-16 flex flex-col justify-center items-center text-center">
                  <Box className="w-24 h-24 text-gold-500 mb-8" />
                  <h3 className="text-3xl font-black mb-4">Every project <br/>is milestoned.</h3>
                  <p className="text-white/40 font-medium">Full transparency on every step of your home journey.</p>
               </div>
               {/* Decorators */}
               <div className="absolute -top-10 -left-10 bg-gold-500 p-8 rounded-3xl animate-bounce shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-gray-950" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-gray-950 mb-12 tracking-tighter">Your high standard <br/>awaits.</h2>
        <Link
          href={APP_GATEWAY_URL}
          target="_blank"
          className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-20 py-7 rounded-[2.5rem] font-black text-2xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl"
        >
          <Smartphone className="w-8 h-8 mr-4 text-gold-400" />
          Join the Network
          <ArrowUpRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
        </Link>
      </section>
    </div>
  );
}
