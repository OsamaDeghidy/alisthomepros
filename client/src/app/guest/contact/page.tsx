'use client';

import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL, CONTACT_PHONE, CONTACT_EMAIL } from '@/config/site';
import { useState } from 'react';
import { homepageApi } from '@/services/homepageApi';
import { toast } from 'react-hot-toast';

export default function GuestContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      value: CONTACT_EMAIL,
      desc: 'Expert support for your home projects.',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: Phone,
      title: 'Call Support',
      value: CONTACT_PHONE,
      desc: 'Direct line to our A-List specialists.',
      color: 'bg-primary-50 text-primary-600'
    }
  ];

  // Intake Form State
  const [intakeData, setIntakeData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: '',
    budget: '',
    timeline: '',
    location: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       await homepageApi.submitIntakeLead({
          full_name: intakeData.fullName,
          email: intakeData.email,
          phone: intakeData.phone,
          message: `Budget: ${intakeData.budget}\nTimeline: ${intakeData.timeline}\nDescription: ${intakeData.description}`,
          service_type: intakeData.serviceType,
          source_path: '/guest/contact',
          role_type: 'Client',
          lead_source: 'Contact Page Intake',
          consent: true
       });
       toast.success('Project submitted successfully!');
       setTimeout(() => {
          window.location.href = `${APP_GATEWAY_URL}/register?role=homeowner&email=${encodeURIComponent(intakeData.email)}`;
       }, 2000);
    } catch (error) {
       toast.error('Failed to submit. Please try joining directly.');
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfdff] min-h-screen selection:bg-primary-100 selection:text-primary-900">
      {/* Visual Header */}
      <section className="bg-white py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-primary-100">
             <MessageCircle className="w-4 h-4" />
             Direct Bridge
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 mb-8 tracking-tighter leading-none">Get in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-success-500">Touch.</span></h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
            From homeowners seeking elite quality to professionals ready to join the South Florida standard, we're here to guide you.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Info Column */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-12 tracking-tight">Ecosystem Support</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
               {contactMethods.map((method, i) => (
                  <div key={i} className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 group hover:shadow-2xl transition-all duration-500">
                     <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        <method.icon className="w-7 h-7" />
                     </div>
                     <h4 className="text-xl font-black text-gray-950 mb-2 tracking-tight">{method.title}</h4>
                     <p className="text-sm font-bold text-gray-950/80 mb-4 break-all">{method.value}</p>
                     <p className="text-xs text-gray-400 font-medium italic">{method.desc}</p>
                  </div>
               ))}
            </div>

            <div className="bg-gray-950 text-white rounded-[3.5rem] p-12 relative overflow-hidden">
               <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-success-400" />
                     </div>
                     <h4 className="text-2xl font-black tracking-tight">West Palm Beach, FL</h4>
                  </div>
                  <p className="text-lg text-white/50 font-medium italic leading-relaxed mb-10">
                     "Our commitment to quality is rooted in the South Florida community. Every specialist is a neighbor, and every job is a hallmark of the A-List standard."
                  </p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-success-500 shrink-0 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-gray-950" />
                     </div>
                     <span className="text-sm font-black uppercase tracking-widest text-success-400">Founder Verified Standard</span>
                  </div>
               </div>
               <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
                  <Globe className="w-64 h-64" />
               </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="relative">
             <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col justify-center relative z-10">
                <div className="absolute -top-8 -right-8 bg-gray-900 text-primary-400 p-8 rounded-[2.5rem] shadow-2xl hidden md:block">
                   <Lock className="w-10 h-10" />
                </div>
                
                 <h3 className="text-4xl font-black text-gray-950 mb-4 tracking-tight">Project Intake</h3>
                 <p className="text-gray-500 font-medium mb-12 italic">Tell us about your project, and we’ll bridge you to the right A-List professional.</p>
                                 <form onSubmit={handleIntakeSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                       <input 
                          type="text" 
                          className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all" 
                          placeholder="Jeffrey West"
                          value={intakeData.fullName}
                          onChange={(e) => setIntakeData({ ...intakeData, fullName: e.target.value })}
                          required
                       />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                          <input 
                             type="email" 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all" 
                             placeholder="name@email.com"
                             value={intakeData.email}
                             onChange={(e) => setIntakeData({ ...intakeData, email: e.target.value })}
                             required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                          <input 
                             type="tel" 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all" 
                             placeholder="(555) 000-0000"
                             value={intakeData.phone}
                             onChange={(e) => setIntakeData({ ...intakeData, phone: e.target.value })}
                             required
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Project Type</label>
                          <select 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 font-bold text-gray-950 outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                             value={intakeData.serviceType}
                             onChange={(e) => setIntakeData({ ...intakeData, serviceType: e.target.value })}
                             required
                          >
                             <option value="">Select Type...</option>
                             <option value="Interior Painting">Interior Painting</option>
                             <option value="Exterior Painting">Exterior Painting</option>
                             <option value="Full Renovation">Full Renovation</option>
                             <option value="Project Management">Project Management</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Budget Range</label>
                          <select 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 font-bold text-gray-950 outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                             value={intakeData.budget}
                             onChange={(e) => setIntakeData({ ...intakeData, budget: e.target.value })}
                             required
                          >
                             <option value="">Select Budget...</option>
                             <option value="Under $5k">Under $5k</option>
                             <option value="$5k - $25k">$5k - $25k</option>
                             <option value="$25k - $100k">$25k - $100k</option>
                             <option value="$100k+">$100k+</option>
                          </select>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Timeline</label>
                          <select 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 font-bold text-gray-950 outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                             value={intakeData.timeline}
                             onChange={(e) => setIntakeData({ ...intakeData, timeline: e.target.value })}
                             required
                          >
                             <option value="">Select Timeline...</option>
                             <option value="Immediately">Immediately</option>
                             <option value="1-3 Months">1-3 Months</option>
                             <option value="3-6 Months">3-6 Months</option>
                             <option value="Flexible">Flexible</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Location (Zip Code)</label>
                          <input 
                             type="text" 
                             className="w-full bg-gray-50/50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all" 
                             placeholder="e.g. 33401"
                             value={intakeData.location}
                             onChange={(e) => setIntakeData({ ...intakeData, location: e.target.value })}
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Project Description</label>
                       <textarea 
                          rows={4} 
                          className="w-full bg-gray-50/50 p-6 rounded-3xl border border-gray-100 outline-none focus:ring-2 focus:ring-primary-500 font-bold transition-all" 
                          placeholder="Tell us what you need transformed..."
                          value={intakeData.description}
                          onChange={(e) => setIntakeData({ ...intakeData, description: e.target.value })}
                       ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full bg-gray-950 text-white p-7 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl flex items-center justify-center group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                       {isSubmitting ? 'Connecting...' : 'Get Matched Now'}
                       {!isSubmitting && <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />}
                    </button>
                 </form>
             </div>
             {/* Background Blob */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-600 rounded-full blur-[80px] opacity-10 -z-10"></div>
          </div>

        </div>
      </section>

      {/* Trust Meta */}
      <section className="py-24 bg-white border-t border-gray-100 px-4 text-center">
         <ShieldCheck className="w-16 h-16 text-success-500 mx-auto mb-10" />
         <h2 className="text-4xl md:text-6xl font-black text-gray-950 mb-6 tracking-tighter">Your bridge to premium.</h2>
         <p className="text-gray-500 font-medium mb-16 text-lg italic max-w-xl mx-auto leading-relaxed">Experience a faster, safer, and more elite standard in Florida home services. Download the app to begin.</p>
         <Link
           href={APP_GATEWAY_URL}
           target="_blank"
           className="inline-flex items-center justify-center bg-gray-950 text-white px-16 py-7 rounded-[2rem] font-black text-2xl transition-all hover:bg-black shadow-2xl group"
         >
           <Smartphone className="mr-4 h-8 w-8 text-primary-400 group-hover:scale-110 transition-transform" />
           Get the App
           <ArrowRight className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
         </Link>
      </section>
    </div>
  );
}
