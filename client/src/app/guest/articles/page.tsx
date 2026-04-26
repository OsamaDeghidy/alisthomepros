'use client';

import { 
  ArrowLeft, 
  Search,
  ArrowRight,
  Clock,
  User,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function GuestArticlesPage() {
  const articles = [
    {
      title: "How to Spot a 5-Star General Contractor in South Florida",
      preview: "Vetting professionals isn't just about licenses; it's about the infrastructure behind their operations.",
      author: "Jeffrey West",
      readTime: "6 min read",
      category: "Tips",
      color: "bg-primary-600"
    },
    {
      title: "The Reality of Recycled Leads: Why Contractors Are Leaving Traditional Sites",
      preview: "Exploring the financial impact of paying for the same lead five other competitors already called.",
      author: "Industry Watch",
      readTime: "8 min read",
      category: "Industry",
      color: "bg-[#B8960C]"
    },
    {
      title: "Pre-Hurricane Prep: The Essential Home Maintenance Checklist",
      preview: "Protect your property with these high-priority checks before storm season begins.",
      author: "Safety Team",
      readTime: "5 min read",
      category: "Guide",
      color: "bg-primary-400"
    },
    {
      title: "Vetting Your Crew: Building a High-Performance Skilled Force",
      preview: "How to transition from a solo operator to a managed professional crew.",
      author: "Pro Strategy",
      readTime: "10 min read",
      category: "Professional",
      color: "bg-gray-950"
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900 pb-24">
      {/* Hero Section */}
      <section className="bg-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 pt-10">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-gray-950 transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div>
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-[10px] font-black mb-6 tracking-widest uppercase italic">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    Knowledge Hub
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter leading-none uppercase italic pr-12 overflow-visible">
                   Expert <span className="inline-block text-primary-600 pr-10">Articles</span>
                 </h1>
              </div>
              <div className="relative w-full md:w-96">
                 <input 
                   type="text" 
                   placeholder="Search articles..." 
                   className="w-full pl-14 pr-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                 />
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
           </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article, i) => (
              <article key={i} className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full">
                 <div className={`h-4 ${article.color}`}></div>
                 <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 px-3 py-1 rounded-full italic">
                         {article.category}
                       </span>
                       <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                       </div>
                    </div>
                    <Link href="#" className="block mb-6">
                       <h3 className="text-2xl font-black text-gray-950 tracking-tighter leading-tight group-hover:text-primary-600 transition-colors uppercase italic pr-12 overflow-visible">
                         {article.title}
                       </h3>
                    </Link>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8 italic">
                      {article.preview}
                    </p>
                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                             <User className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">{article.author}</span>
                       </div>
                       <Link href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-950 hover:bg-primary-600 hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5" />
                       </Link>
                    </div>
                 </div>
              </article>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <button className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/10">
               Load More Articles
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
