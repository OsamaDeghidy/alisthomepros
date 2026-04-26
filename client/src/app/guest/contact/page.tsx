'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { CONTACT_PHONE, CONTACT_EMAIL, BUSINESS_HOURS_WEEKDAYS } from '@/config/site';

export default function GuestContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

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
             Get in <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Touch</span>
           </h1>
           <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed italic">
             Have questions about the A-List ecosystem? Our team is ready to provide the answers you need.
           </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
           
           {/* Contact Information Sidebar */}
           <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                 <h2 className="text-4xl font-black text-gray-950 tracking-tighter uppercase italic pr-4">Professional <br/>Support Force.</h2>
                 <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                   A-List is built on accountability. We are here to ensure your experience in the network is seamless and high-performing.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                 {[
                   { icon: Phone, title: 'Direct Line', details: '1-866-882-5478', subtitle: 'Monday - Friday: 8AM - 6PM EST', color: 'text-primary-600' },
                   { icon: Mail, title: 'Email Force', details: 'support@alisthomepros.com', subtitle: '24-hour response target', color: 'text-[#B8960C]' },
                   { icon: MapPin, title: 'Florida Hub', details: 'South Florida, USA', subtitle: 'Regional Headquarters', color: 'text-primary-400' }
                 ].map((info, i) => (
                   <div key={i} className="flex items-start gap-6 group">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
                         <info.icon className={`w-6 h-6 ${info.color}`} />
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-gray-950 uppercase tracking-widest mb-1 italic">{info.title}</h4>
                         <p className="text-xl text-gray-900 font-black italic tracking-tight pr-4">{info.details}</p>
                         <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{info.subtitle}</p>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Badge Area */}
              <div className="p-10 bg-gray-950 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck className="w-32 h-32" />
                 </div>
                 <div className="relative z-10 flex items-center gap-6 mb-6">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                       <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter italic pr-4">A-List Standard</h3>
                 </div>
                 <p className="text-white/60 font-medium leading-relaxed italic relative z-10">
                   All inquiries are encrypted and handled by our regional specialist force. Your privacy and data security are our highest priority.
                 </p>
              </div>
           </div>

           {/* Contact Form */}
           <div className="lg:col-span-7 bg-white rounded-[4rem] p-10 md:p-16 shadow-2xl border border-gray-50 relative">
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                       <input 
                         type="text" 
                         placeholder="John Doe" 
                         className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         required
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                       <input 
                         type="email" 
                         placeholder="john@example.com" 
                         className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         required
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Inquiry Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {['General', 'Support', 'Billing', 'Partnership', 'Media'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: type.toLowerCase() })}
                            className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all italic ${formData.type === type.toLowerCase() ? 'bg-gray-950 text-white border-gray-900 shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-primary-400'}`}
                          >
                             {type}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Subject</label>
                    <input 
                      type="text" 
                      placeholder="What is this about?" 
                      className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Detailed Message</label>
                    <textarea 
                      rows={5}
                      placeholder="Tell us more about your inquiry..." 
                      className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                 </div>

                 <button className="w-full py-8 bg-gray-950 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-4 group">
                    Send Message
                    <Send className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
                 </button>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
}
