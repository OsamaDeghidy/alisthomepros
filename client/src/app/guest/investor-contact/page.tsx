'use client';

import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageSquare, 
  Send,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function GuestInvestorContactPage() {
  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      {/* Header */}
      <section className="bg-gray-950 text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
           <Link href="/investors" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Investors
           </Link>
           <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight uppercase italic pr-12 overflow-visible">
             Investor <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Contact</span>
           </h1>
           <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl italic leading-relaxed">
             Direct access for institutional and accredited individual investors looking to join the A-List journey.
           </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
           
           {/* Info Sidebar */}
           <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-gray-950 tracking-tighter uppercase italic">Get the Full Story.</h2>
                 <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                   Please complete the form to request our comprehensive investor deck, financial projections, and platform roadmap.
                 </p>
              </div>

              <div className="space-y-8">
                  <div className="flex items-start gap-6">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 flex-shrink-0">
                        <Phone className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-gray-950 uppercase tracking-widest mb-1 italic">Direct Line</h4>
                        <p className="text-lg text-gray-500 font-bold italic transition-colors">1-866-882-5478</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Mon - Fri: 8AM - 6PM EST</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-6">
                     <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#B8960C] flex-shrink-0">
                        <Mail className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-gray-950 uppercase tracking-widest mb-1 italic">Email Force</h4>
                        <p className="text-lg text-gray-500 font-bold italic transition-colors">support@alisthomepros.com</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">24-hour response target</p>
                     </div>
                  </div>

                 <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 mt-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <ShieldCheck className="w-24 h-24" />
                    </div>
                    <p className="text-gray-900 font-black italic uppercase tracking-tight relative z-10 leading-tight">
                      All investor communications are handled with absolute confidentiality and professional discretion.
                    </p>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="lg:col-span-7 bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-gray-50">
              <form className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic ml-2">Full Name</label>
                       <input 
                         type="text" 
                         placeholder="John Doe" 
                         className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic ml-2">Email Address</label>
                       <input 
                         type="email" 
                         placeholder="john@company.com" 
                         className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic ml-2">Phone Number</label>
                       <input 
                         type="tel" 
                         placeholder="+1 (000) 000-0000" 
                         className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic ml-2">Investor Type</label>
                       <select className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm appearance-none cursor-pointer italic">
                          <option>Accredited Individual</option>
                          <option>Venture Capital</option>
                          <option>Private Equity</option>
                          <option>Other</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic ml-2">Message / Inquiry Details</label>
                    <textarea 
                      rows={5}
                      placeholder="Tell us about your investment interests..." 
                      className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm resize-none"
                    />
                 </div>

                 <button className="w-full py-8 bg-gray-950 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-4 group">
                    Send Inquiry
                    <Send className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                 </button>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
}
