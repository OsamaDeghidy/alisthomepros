'use client';

import { 
  ArrowLeft, 
  Calendar, 
  ArrowRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

export default function PressPage() {
  const news = [
    {
      title: "A-List Home Professionals Launches South Florida's Elite Construction Ecosystem",
      date: "April 15, 2026",
      category: "Press Release",
      excerpt: "Bridging the gap between premium property owners and the top 1% of construction talent in the region.",
      url: "#"
    },
    {
      title: "The Death of the Directory: Why Traditional Lead Gen is Failing Florida Contractors",
      date: "March 28, 2026",
      category: "Industry Insights",
      excerpt: "Analysis of the broken lead reseller model and how infrastructure-based solutions are taking over.",
      url: "#"
    },
    {
      title: "A-List Integrates Advanced AI for Real-Time Credential Validation",
      date: "February 12, 2026",
      category: "Product Update",
      excerpt: "Setting a new global standard for professional accountability in the home services sector.",
      url: "#"
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 pt-10">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight uppercase italic pr-12 overflow-visible">
             Press & <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">News</span>
           </h1>
           <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl leading-relaxed italic pr-4">
             The latest announcements, insights, and stories from the A-List ecosystem.
           </p>
        </div>
      </section>

      {/* News Feed */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          {news.map((item, i) => (
            <article key={i} className="group border-b border-gray-100 pb-16 last:border-0">
               <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest italic pr-4">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest pr-4">
                     <Calendar className="w-4 h-4" />
                     {item.date}
                  </div>
               </div>
               <Link href={item.url} className="block group">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-950 mb-6 tracking-tighter leading-tight group-hover:text-primary-600 transition-colors uppercase italic pr-12 overflow-visible">
                    {item.title}
                  </h2>
               </Link>
               <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-4xl mb-8 pr-4">
                 {item.excerpt}
               </p>
               <Link href={item.url} className="inline-flex items-center gap-3 text-sm font-black text-primary-600 uppercase tracking-widest hover:gap-5 transition-all italic">
                  Read Article <ArrowRight className="w-5 h-5" />
               </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter / Contact CTA */}
      <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
           <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-10 border border-gray-100">
              <MessageSquare className="w-10 h-10 text-[#B8960C]" />
           </div>
           <h2 className="text-4xl font-black text-gray-950 mb-6 tracking-tighter uppercase italic pr-12 overflow-visible">Stay in the Loop</h2>
           <p className="text-gray-500 text-xl font-medium italic mb-10 pr-4">Get the latest industry shifts and platform updates delivered directly to your inbox.</p>
           
           <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-8 py-5 rounded-2xl border border-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              />
              <button className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10 whitespace-nowrap">
                Subscribe
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}
