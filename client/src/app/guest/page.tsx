'use client';

import { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Star, 
  Users, 
  MapPin, 
  Hammer, 
  Briefcase, 
  Target, 
  Share2,
  Building2,
  HardHat,
  Search,
  Award
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { APP_GATEWAY_URL } from '@/config/site';
import { homepageApi } from '@/services/homepageApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function GuestHomePage() {
  const [zipCode, setZipCode] = useState('');
  const [service, setService] = useState('');

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to app with context
    const url = new URL(APP_GATEWAY_URL);
    if (zipCode) url.searchParams.append('zip', zipCode);
    if (service) url.searchParams.append('service', service);
    window.location.href = url.toString();
  };

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
        source_path: '/guest',
        role_type: 'Client',
        lead_source: 'Funnel Intake',
        consent: true
      });
      toast.success('Project submitted successfully! We will contact you soon.');
      // Update: Redirect to registration after success to keep them in the funnel
      setTimeout(() => {
        window.location.href = `${APP_GATEWAY_URL}/register?role=property-owner&email=${encodeURIComponent(intakeData.email)}`;
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit. Please try again or join directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const audiences = [
    {
      id: 'home-pros',
      title: 'I Am a Home Pro',
      power: 'Scale your business',
      desc: 'Access high-value jobs and grow your business with elite tools.',
      icon: Hammer,
      cta: "I'm a Home Pro",
      slug: 'pro',
      image: '/home_pro_card.png'
    },
    {
      id: 'crew-members',
      title: 'I Am a Crew Member',
      power: 'Secure consistent work',
      desc: 'Find consistent work and join elite teams on South Florida’s top jobs.',
      icon: HardHat,
      cta: "I'm Crew",
      slug: 'crew',
      image: '/crew_member_card.png'
    },
    {
      id: 'property-owners',
      title: 'I Need a Pro',
      power: 'Total project control',
      desc: 'Post projects. Get matched. Stay in control of your property vision.',
      icon: Building2,
      cta: 'I Need a Pro',
      slug: 'property-owner',
      image: '/property_owner_card.png'
    },
    {
      id: 'specialists',
      title: 'I Am a Specialist',
      power: 'Monetize expertise',
      desc: 'Manage projects and earn from coordination in our elite ecosystem.',
      icon: Target,
      cta: "I'm a Specialist",
      slug: 'specialist',
      image: '/specialist_card.png'
    },
    {
      id: 'referral-partners',
      title: 'I Want to Earn',
      power: 'Residual network income',
      desc: 'Build your network and earn recurring income from every connection.',
      icon: Share2,
      cta: 'I Want to Earn',
      slug: 'partner',
      image: '/referral_partner_card.png'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % audiences.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [audiences.length]);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-[#fcfdff]">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-primary-50 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs font-black mb-8 animate-fade-in border border-primary-100 tracking-widest uppercase">
                <MapPin className="w-3 h-3 mr-2 text-primary-600" />
                Serving All of South Florida
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter pr-4">
                South Florida’s <br />
                <span className="text-[#0284c7]">
                  Private Network.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Where top Home Pros, skilled crews, and serious property owners connect, get hired, and get projects done right.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link
                  href={APP_GATEWAY_URL}
                  target="_blank"
                  className="group relative inline-flex items-center justify-center bg-gray-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200"
                >
                  <Smartphone className="mr-3 h-6 w-6 text-primary-400" />
                  Enter the Network
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Link>
                
                <Link
                  href="/inside-a-list"
                  className="inline-flex items-center justify-center text-gray-900 font-black text-lg hover:text-primary-600 transition-colors group tracking-tight"
                >
                  How It Works
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-10">
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-black text-primary-700 shadow-sm">JW</div>
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-success-100 flex items-center justify-center text-[10px] font-black text-success-700 shadow-sm">AS</div>
                       <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-700 shadow-sm">MK</div>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Elite Network</span>
                       <span className="text-sm font-black text-gray-900 leading-none">5k+ Florida Pros</span>
                    </div>
                 </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-blue-400 text-blue-400" />)}
                    <span className="text-xs font-black text-gray-900 ml-2">4.9/5 RATING</span>
                  </div>
              </div>
            </div>

            {/* Lead Capture Module */}
            <div className="relative">
              <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
                 <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Need a Pro?</h3>
                 <p className="text-gray-500 mb-8 font-medium">Tell us what you need and we’ll connect you with the right A-List professional.</p>
                 
                 <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input 
                         type="text" 
                         placeholder="What service do you need?" 
                         className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                         value={service}
                         onChange={(e) => setService(e.target.value)}
                         required
                       />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                       <input 
                         type="text" 
                         placeholder="Zip Code" 
                         className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                         value={zipCode}
                         onChange={(e) => setZipCode(e.target.value)}
                         required
                       />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center group shadow-xl shadow-gray-200"
                    >
                       Continue Inside the Network
                       <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                 </form>
                 
                                  <div className="mt-8 flex items-center justify-center gap-8 opacity-30 grayscale contrast-125">
                    <span className="text-xs font-black tracking-tighter">FLORIDA TRUST</span>
                    <span className="text-xs font-black tracking-tighter underline decoration-primary-500 underline-offset-4">PRO SECURE</span>
                    <span className="text-xs font-black tracking-tighter italic">ELITE HUB</span>
                  </div>
              </div>
              {/* Decorative Orb */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400 rounded-full blur-[80px] opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Choose Your Role to Enter Inside A-List</h2>
               <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">Choose your role to enter Inside A-List. Every user home has a role. Every role has a power.</p>
            </div>
            
            <div className="relative group">
               {/* Carousel Container */}
               <div 
                 className="overflow-hidden cursor-grab active:cursor-grabbing"
                 ref={carouselRef}
               >
                 <motion.div 
                   className="flex gap-6"
                   animate={{ x: `-${activeIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3.2))}%` }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 >
                   {audiences.map((audience, i) => (
                      <Link 
                        key={audience.id}
                        href={`${APP_GATEWAY_URL}?role=${audience.slug}`}
                        target="_blank"
                        className="min-w-[100%] md:min-w-[30%] relative aspect-[4/5] rounded-[3.5rem] overflow-hidden group/card block"
                      >
                         <Image 
                           src={audience.image} 
                           alt={audience.title}
                           fill
                           className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                         
                         <div className="absolute inset-0 p-10 flex flex-col justify-end">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                               <audience.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-primary-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{audience.power}</span>
                            <h3 className="text-3xl font-black text-white mb-4 uppercase">{audience.title}</h3>
                            <p className="text-white/70 font-medium leading-relaxed mb-8 line-clamp-2 md:line-clamp-3">{audience.desc}</p>
                            <div className="flex items-center text-white font-black text-sm uppercase tracking-widest bg-white/10 w-fit px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm group-hover/card:bg-primary-600 group-hover/card:border-primary-500 transition-all">
                               Enter Inside A-List
                               <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/card:translate-x-2" />
                            </div>
                         </div>
                      </Link>
                   ))}
                 </motion.div>
               </div>

               {/* Carousel Indicators */}
               <div className="flex justify-center gap-3 mt-12">
                  {audiences.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-12 bg-primary-600' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                    />
                  ))}
               </div>
            </div>
         </div>
      </section>

      
      {/* The A-List Edge Section */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-5xl md:text-8xl font-black text-gray-950 mb-8 tracking-tighter italic uppercase pr-4">
                  “No bidding wars. <br className="hidden md:block"/>No recycled leads.”
               </h2>
               <p className="text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                  Most platforms sell access. A-List builds real connections. One connected ecosystem for every role in South Florida’s property market.
               </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
               {/* Comparison Block Integrated */}
               <div className="bg-gray-50 p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black text-gray-400 mb-10 uppercase tracking-widest">Traditional Platforms</h3>
                  <ul className="space-y-6">
                     {['Pay for leads that aren’t exclusive', 'Compete against multiple contractors', 'Disconnected communication', 'No real network, just listings'].map((point, i) => (
                        <li key={i} className="flex items-center gap-4 text-gray-500 font-bold">
                           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                           {point}
                        </li>
                     ))}
                  </ul>
               </div>
               
               <div className="bg-gray-900 p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 text-white">
                     <ShieldCheck className="w-64 h-64" />
                  </div>
                  <h3 className="text-2xl font-black mb-10 uppercase tracking-widest text-primary-400">The A-List Network</h3>
                  <ul className="space-y-6 relative z-10">
                     {['Direct access to real opportunities', 'Position yourself instead of chasing leads', 'Build long-term relationships', 'One connected ecosystem'].map((point, i) => (
                        <li key={i} className="flex items-center gap-4 text-white font-black text-lg">
                           <CheckCircle className="w-6 h-6 text-primary-500" />
                           {point}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Get in Early Block */}
            <div className="bg-primary-50 rounded-[4rem] p-12 md:p-24 relative overflow-hidden border border-primary-100">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                  <div>
                     <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter pr-4">Get In Early. <br/>Win Bigger.</h2>
                     <p className="text-xl text-gray-600 mb-10 font-medium leading-relaxed">Early members gain access to opportunities before the platform scales. Position yourself as a founding force in South Florida’s elite network.</p>
                     <Link href={APP_GATEWAY_URL} target="_blank" className="inline-flex items-center gap-2 px-10 py-5 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-200">
                        Join the Network Now
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        { title: 'Priority Access', icon: Zap },
                        { title: 'Less Competition', icon: Target },
                        { title: 'Founding Status', icon: Award },
                        { title: 'High Visibility', icon: Star }
                     ].map((item, i) => (
                        <div key={i} className="p-6 bg-white rounded-3xl border border-primary-100 shadow-sm flex flex-col items-center text-center">
                           <item.icon className="w-8 h-8 text-primary-600 mb-3" />
                           <span className="font-black text-gray-900 uppercase tracking-tighter text-xs">{item.title}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Project Intake Section */}
      <section id="project-intake" className="py-32 px-4 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
               <h2 className="text-5xl md:text-7xl font-black text-gray-950 mb-8 tracking-tighter pr-4">Tell Us About Your Project</h2>
               <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl">We’ll connect you with the right A-List professional for your specific needs in South Florida.</p>
               
               <div className="space-y-6">
                  {['Verified Specialists', 'Rapid Response Time', 'Direct Connections', 'Secure Milestone Funding'].map((text, i) => (
                     <div key={i} className="flex items-center gap-4 text-gray-950 font-black tracking-tight text-lg">
                        <CheckCircle className="w-6 h-6 text-gold-500" />
                        {text}
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 relative">
               <form onSubmit={handleIntakeSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                     <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500"
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
                           placeholder="john@example.com" 
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500"
                           value={intakeData.email}
                           onChange={(e) => setIntakeData({ ...intakeData, email: e.target.value })}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                        <input 
                           type="tel" 
                           placeholder="(555) 000-0000" 
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500"
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
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                           value={intakeData.serviceType}
                           onChange={(e) => setIntakeData({ ...intakeData, serviceType: e.target.value })}
                           required
                        >
                           <option value="">Select Type...</option>
                           <option value="Interior Painting">Interior Painting</option>
                           <option value="Exterior Painting">Exterior Painting</option>
                           <option value="Project Management">Project Management</option>
                           <option value="Full Renovation">Full Renovation</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Budget Range</label>
                        <select 
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
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
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
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
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Location</label>
                        <input 
                           type="text" 
                           placeholder="Zip Code" 
                           className="w-full bg-gray-50 p-5 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500"
                           value={intakeData.location}
                           onChange={(e) => setIntakeData({ ...intakeData, location: e.target.value })}
                           required
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                     <textarea 
                        rows={3} 
                        placeholder="Tell us about the scope of your vision..." 
                        className="w-full bg-gray-50 p-5 rounded-3xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-primary-500"
                        value={intakeData.description}
                        onChange={(e) => setIntakeData({ ...intakeData, description: e.target.value })}
                     ></textarea>
                  </div>
                  <button 
                     type="submit"
                     disabled={isSubmitting}
                     className={`w-full bg-gray-950 text-white p-6 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-gray-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                     {isSubmitting ? 'Connecting...' : 'Get Matched Now'}
                  </button>
               </form>
            </div>
         </div>
      </section>

      {/* Final Meta / Footer CTA */}
      <section className="py-40 px-4 text-center bg-gray-50 border-t border-gray-100 overflow-hidden relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] -z-10"></div>
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-6xl md:text-8xl font-black text-gray-950 dark:text-white mb-10 tracking-tighter leading-none uppercase text-center pr-4">
               Your Network <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-300">Determines Your</span> <br />
               Opportunities.
            </h2>
            <p className="text-2xl text-gray-500 font-medium mb-16 italic max-w-2xl mx-auto">
               Join A-List and position yourself at the top of South Florida’s home service elite.
            </p>
            <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="inline-flex items-center justify-center bg-gray-950 text-white px-20 py-8 rounded-[3rem] font-black text-3xl transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)] group"
            >
               Enter the Network
               <ArrowRight className="ml-5 h-10 w-10 transition-transform group-hover:translate-x-3" />
            </Link>
         </div>
         

      </section>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
