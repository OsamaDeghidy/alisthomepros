'use client';

import { 
  ArrowLeft, 
  Search,
  HelpCircle,
  Plus,
  Minus,
  MessageCircle,
  BookOpen,
  Smartphone,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function GuestHelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I sign up as a Property Owner?",
      a: "Download the A-List app, select 'I Need a Pro' during onboarding, and follow the verification steps. You'll gain immediate access to our network of verified specialists."
    },
    {
      q: "What is the difference between an A-List Member and A-List Certified?",
      a: "A-List Members are verified professionals inside the network with base visibility. A-List Certified professionals have passed our highest validation standards and are actively positioned for the most premium projects."
    },
    {
      q: "How are payments handled in the ecosystem?",
      a: "All financial transactions are handled securely inside the A-List app. We use milestone-based payments to ensure funds are only released when the work is validated and approved by the project owner."
    },
    {
      q: "What areas do you currently serve?",
      a: "We are currently focused on the South Florida market, specifically targeting elite construction hubs in Miami-Dade, Broward, and Palm Beach counties."
    },
    {
      q: "Is there a background check for every professional?",
      a: "Yes. Every A-List Certified professional goes through a rigorous validation process including credential checks, history of performance, and background screening."
    }
  ];

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900 pb-24">
      {/* Hero Section */}
      <section className="bg-gray-950 text-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-[200px] opacity-10 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto relative z-10 pt-10 text-center">
           <Link href="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
           </Link>
           <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight uppercase italic pr-12 overflow-visible">
             Help <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Center</span>
           </h1>
           <div className="relative max-w-2xl mx-auto mt-12">
              <input 
                type="text" 
                placeholder="How can we help you today?" 
                className="w-full pl-14 pr-8 py-6 rounded-[2rem] bg-white/10 border border-white/10 font-bold text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all backdrop-blur-xl"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-400" />
           </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
           
           {/* Sidebar Categories */}
           <div className="lg:col-span-4 space-y-4">
              {[
                { label: 'Getting Started', icon: BookOpen, active: true },
                { label: 'Roles & Permissions', icon: HelpCircle, active: false },
                { label: 'Payments & Fees', icon: Smartphone, active: false },
                { label: 'Account Security', icon: MessageCircle, active: false }
              ].map((cat, i) => (
                <button 
                  key={i} 
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all font-black uppercase tracking-widest text-xs italic ${cat.active ? 'bg-gray-950 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-400 border-gray-100 hover:border-primary-400'}`}
                >
                   <div className="flex items-center gap-4">
                      <cat.icon className={`w-5 h-5 ${cat.active ? 'text-primary-400' : 'text-gray-300'}`} />
                      {cat.label}
                   </div>
                   <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              ))}
           </div>

           {/* FAQ Accordion */}
           <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl font-black text-gray-950 mb-10 tracking-tighter uppercase italic pr-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                     <button 
                       onClick={() => setOpenIndex(openIndex === i ? null : i)}
                       className="w-full flex items-center justify-between p-8 text-left group"
                     >
                        <span className="text-xl font-black text-gray-950 tracking-tight uppercase italic group-hover:text-primary-600 transition-colors pr-4">{faq.q}</span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${openIndex === i ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                           {openIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                     </button>
                     <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 pb-8 px-8' : 'max-h-0'}`}>
                        <div className="pt-4 border-t border-gray-50 text-gray-500 font-medium text-lg leading-relaxed italic">
                           {faq.a}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Still Need Help? */}
      <section className="px-4">
         <div className="max-w-5xl mx-auto bg-gray-950 rounded-[4rem] p-16 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary-600/5 pointer-events-none"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic pr-4">Still Need Help?</h2>
                  <p className="text-white/60 text-xl font-medium italic">Our support force is ready to assist you with any platform questions.</p>
               </div>
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="text-2xl font-black italic">1-866-882-5478</p>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic">Mon - Fri: 8AM - 6PM EST</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-[#B8960C] rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="text-2xl font-black italic">support@alisthomepros.com</p>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic">24-hour response target</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
