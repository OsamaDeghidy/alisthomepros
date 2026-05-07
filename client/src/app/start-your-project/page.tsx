'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ArrowRight, 
  ChefHat, 
  Bath, 
  Home, 
  Warehouse, 
  Paintbrush, 
  Waves, 
  Zap, 
  Droplets, 
  Snowflake, 
  Trees, 
  DoorOpen, 
  Construction, 
  ClipboardList,
  ChevronDown,
  X,
  Target,
  User
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { APP_GATEWAY_URL } from '@/config/site';

// Gold Component for branding
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

const SERVICE_CATEGORIES = [
  { id: 'service-kitchen-remodeling', label: 'Kitchen Remodeling', icon: ChefHat },
  { id: 'service-bathroom-remodeling', label: 'Bathroom Remodeling', icon: Bath },
  { id: 'service-full-home-renovation', label: 'Full Home Renovation', icon: Home },
  { id: 'service-roofing', label: 'Roofing & Roof Repair', icon: Warehouse },
  { id: 'service-interior-painting', label: 'Interior Painting', icon: Paintbrush },
  { id: 'service-exterior-painting', label: 'Exterior Painting', icon: Paintbrush },
  { id: 'service-flooring', label: 'Flooring Installation', icon: Construction },
  { id: 'service-electrical', label: 'Electrical Services', icon: Zap },
  { id: 'service-plumbing', label: 'Plumbing Services', icon: Droplets },
  { id: 'service-hvac', label: 'HVAC Installation & Repair', icon: Snowflake },
  { id: 'service-landscaping', label: 'Landscaping & Hardscape', icon: Trees },
  { id: 'service-pool', label: 'Pool Construction & Repair', icon: Waves },
  { id: 'service-windows-doors', label: 'Windows & Doors', icon: DoorOpen },
  { id: 'service-garage-driveways', label: 'Garage & Driveways', icon: Warehouse },
  { id: 'service-tile-masonry', label: 'Tile, Stone & Masonry', icon: Construction },
  { id: 'service-project-management', label: 'Project Management', icon: ClipboardList },
];

const CITIES = {
  'Palm Beach County': [
    'West Palm Beach', 'Boca Raton', 'Boynton Beach', 'Delray Beach', 'Jupiter', 
    'Wellington', 'Royal Palm Beach', 'Lake Worth', 'Greenacres', 'Palm Beach Gardens', 'North Palm Beach'
  ],
  'Broward County': [
    'Fort Lauderdale', 'Pompano Beach', 'Coral Springs', 'Plantation', 'Sunrise', 
    'Davie', 'Hollywood', 'Pembroke Pines', 'Miramar', 'Weston', 'Deerfield Beach'
  ],
  'Miami-Dade County': [
    'Miami', 'Miami Beach', 'Coral Gables', 'Aventura', 'Doral', 
    'Homestead', 'Kendall', 'Hialeah', 'North Miami', 'Pinecrest'
  ]
};

const FAQ_DATA = [
  {
    q: "How fast will I be matched with a contractor?",
    a: "Jeffrey, our founder, personally reviews every project submission. You'll be matched with a vetted A-List Founding Pro within 24–72 hours."
  },
  {
    q: "Will my information be sold to multiple contractors?",
    a: "No. Unlike traditional lead-gen platforms like Angi or HomeAdvisor, your project goes to one matched contractor — not five. We never sell or resell your information."
  },
  {
    q: "Is there a fee to submit a project?",
    a: "Submitting a project is free for homeowners and property owners. There are no fees, no obligations, and no commitments. Pricing for the actual work is negotiated directly between you and your matched contractor."
  },
  {
    q: "What kinds of projects can I submit?",
    a: "Any construction or home services project — kitchen and bathroom remodels, roofing, painting, flooring, electrical, plumbing, HVAC, landscaping, pool construction, full renovations, and more. If it's residential or light commercial in South Florida, we likely have a pro for it."
  },
  {
    q: "Where does A-List Home Pros currently operate?",
    a: "We currently serve Palm Beach County, Broward County, and Miami-Dade County in South Florida. If your project is outside this area, submit it anyway — we may be able to refer you."
  },
  {
    q: "Are A-List contractors licensed and insured?",
    a: "Every A-List Founding Pro has their Florida contractor or trade license verified through the Florida Department of Business and Professional Regulation (DBPR), and provides a current general liability insurance certificate before joining the network."
  },
  {
    q: "Who is Jeffrey D. West Jr.?",
    a: "Jeffrey is the founder of A-List Home Pros. He's a longtime South Florida construction professional who built A-List as the alternative to lead-gen platforms that sell leads to multiple competing contractors. Jeffrey personally reviews every project that comes through this page."
  },
  {
    q: "What if I'm not happy with my match?",
    a: "Reach out directly to (561) 888-4930 or jwest@alisthp.com. Jeffrey will personally re-match you with a different A-List Founding Pro at no additional cost."
  },
  {
    q: "Does A-List Home Pros guarantee the work?",
    a: "A-List Home Pros is a matching platform — we connect property owners with license-verified contractors but do not perform the work ourselves or guarantee outcomes. All work is between you and your matched contractor under a direct agreement."
  },
  {
    q: "Can property managers and businesses submit projects too?",
    a: "Yes. The form welcomes homeowners, property managers, real estate investors, landlords, and business owners. Just submit your project and Jeffrey will match it appropriately."
  }
];

export default function StartYourProject() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('primary-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for HubSpot integration
    console.log("Form data would be sent to HubSpot here.");
    setFormSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* A.3 Schema Markup (AEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "A-List Home Pros",
            "description": "South Florida contractor matching service. Founder personally matches homeowners and property owners with vetted, license-verified contractors.",
            "url": "https://www.alisthomepros.com/start-your-project",
            "telephone": "+1-561-888-4930",
            "email": "jwest@alisthp.com",
            "areaServed": [
              {"@type": "AdministrativeArea", "name": "Palm Beach County, Florida"},
              {"@type": "AdministrativeArea", "name": "Broward County, Florida"},
              {"@type": "AdministrativeArea", "name": "Miami-Dade County, Florida"}
            ],
            "serviceType": SERVICE_CATEGORIES.map(s => s.label),
            "founder": {
              "@type": "Person",
              "name": "Jeffrey D. West Jr.",
              "jobTitle": "Founder"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_DATA.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />

      {/* B.1 — Sticky top bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-950/95 backdrop-blur-md py-3 shadow-xl' : 'bg-gray-950 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="group">
            <BrandLogo width={180} height={60} className="h-10 md:h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <a href="tel:5618884930" className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
              <Phone className="w-5 h-5 text-[#B8960C]" />
              <span className="hidden md:inline font-bold">(561) 888-4930</span>
              <span className="md:hidden"><Smartphone className="w-6 h-6" /></span>
            </a>
            <button 
              onClick={scrollToForm}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
              Submit Project
            </button>
          </div>
        </div>
      </nav>

      {/* B.2 — Hero section */}
      <header className="relative bg-gray-950 text-white pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left: Copy */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
              Have a Project <br/>
              on Your Property <br/>
              <span className="text-primary-400">in South Florida?</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-medium leading-relaxed max-w-xl">
              Whether you're a homeowner, property manager, investor, or business owner — submit your project and our founder will personally match you with a vetted A-List Founding Pro within 24–72 hours.
            </p>
            <ul className="space-y-4">
              {[
                "No bidding wars. Your project goes to one matched pro, not five.",
                "License-verified contractors only.",
                "Direct line to the founder — every match is personal.",
                "Free for homeowners. No fees, no obligations."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg font-bold">
                  <CheckCircle className="w-6 h-6 text-[#B8960C] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Short Form */}
          <div id="primary-form" className="bg-white p-8 md:p-10 rounded-[2.5rem] text-gray-950 shadow-2xl relative">
            <div className="absolute -top-6 -left-6 bg-[#B8960C] text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest italic shadow-lg">
              Match in 24–72 Hrs
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">Get Matched</h2>
            
            {formSubmitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black uppercase italic">Thanks — your project is in.</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Jeffrey will personally review and reach out within 24–72 hours with your matched pro. Keep an eye on your inbox and phone.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="text-primary-600 font-black uppercase text-xs tracking-widest hover:underline"
                >
                  Submit another project
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">First Name</label>
                    <input required type="text" placeholder="John" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">ZIP Code</label>
                    <input required type="text" inputMode="numeric" placeholder="33401" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
                  <input required type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone</label>
                  <input required type="tel" placeholder="(561) 000-0000" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Project Type</label>
                  <select required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold appearance-none">
                    <option value="">Select Category...</option>
                    {SERVICE_CATEGORIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                
                <div className="pt-4">
                  <p className="text-[10px] text-gray-400 leading-relaxed mb-6 font-medium italic">
                    By submitting, I agree A-List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with my matched A-List Founding Pro. Message and data rates may apply. Reply STOP to unsubscribe. See <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms</Link>.
                  </p>
                  <button type="submit" className="w-full bg-gray-950 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-600 transition-all shadow-xl shadow-gray-950/10 flex items-center justify-center group">
                    Get Matched
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </button>
                  <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase italic">Free. No spam. One personal match — not five competing bids.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* B.3 — Trust strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: User, label: 'Founder Matches You', sub: 'No auto-routing' },
              { icon: ShieldCheck, label: 'License-Verified Pros', sub: 'Florida DBPR confirmed' },
              { icon: Lock, label: 'Info Stays Private', sub: 'Never sold to bidders' },
              { icon: Clock, label: '24–72 Hour Response', sub: 'Direct from founder' }
            ].map((trust, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <trust.icon className="w-8 h-8 text-[#B8960C]" />
                <h4 className="font-black uppercase text-xs tracking-tighter text-gray-950">{trust.label}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-widest">{trust.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.4 — How It Works */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest italic">
              Simple Process
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tighter uppercase italic">How A-List Matches You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Submit Your Project',
                desc: 'Tell us what you need done — kitchen remodel, roofing, plumbing, full renovation, anything. Takes about 2 minutes.'
              },
              {
                step: '02',
                title: 'Founder Reviews & Matches',
                desc: 'Jeffrey personally reviews every submission and matches you with the right vetted contractor for your project, location, and budget. Within 24–72 hours.'
              },
              {
                step: '03',
                title: 'Connect Directly',
                desc: 'You and your matched pro talk directly. No middleman, no lead resold to five competitors. Pricing is between you and the contractor.'
              }
            ].map((step, i) => (
              <div key={i} className="relative p-12 bg-gray-50 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden">
                <span className="absolute -top-6 -right-6 text-9xl font-black text-primary-500/5 italic">{step.step}</span>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary-600 transition-colors">
                  <span className="text-2xl font-black text-primary-600 group-hover:text-white italic">{step.step}</span>
                </div>
                <h4 className="text-2xl font-black text-gray-950 mb-6 uppercase tracking-tighter italic">{step.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.5 — Service categories grid */}
      <section className="py-24 md:py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Every Type of Project, <br/> Every Type of Property</h2>
            <p className="text-xl text-white/50 font-medium italic">From single-room renovations to full property builds — across South Florida.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((service, i) => (
              <div 
                key={i} 
                id={service.id}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group cursor-default flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-[#B8960C]/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#B8960C] transition-colors">
                  <service.icon className="w-7 h-7 text-[#B8960C] group-hover:text-white" />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tighter italic">{service.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.6 — Comparison block */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-gray-950 text-center mb-20 tracking-tighter uppercase italic">Why Property Owners Choose A-List</h2>
          
          <div className="overflow-hidden rounded-[3rem] border border-gray-100 shadow-2xl">
            <div className="grid grid-cols-2 bg-gray-950 text-white p-10 font-black uppercase tracking-widest text-xs italic">
              <div className="px-4">Legacy Platforms</div>
              <div className="px-4 text-primary-400">A-List Home Pros</div>
            </div>
            {[
              ["Your info sold to 4–6 competing contractors", "One personal match, made by the founder"],
              ["Bombarded by phone calls and emails", "One contractor reaches out, that's it"],
              ["\"Verified\" pros with no real verification", "Florida DBPR license-verified"],
              ["Pay for leads that never convert", "Free for homeowners, always"],
              ["No accountability when things go wrong", "Direct line to the founder, every project"]
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-2 p-10 font-bold text-lg ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-4 text-gray-400 flex items-start gap-3">
                  <span className="text-red-500 shrink-0">✕</span>
                  {row[0]}
                </div>
                <div className="px-4 text-gray-950 flex items-start gap-3 italic">
                  <span className="text-green-600 shrink-0">✓</span>
                  {row[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.7 — Founder block */}
      <section className="py-24 md:py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Photo Column */}
            <div className="relative group">
              <div className="absolute -inset-6 bg-primary-600/10 rounded-[4rem] blur-2xl group-hover:bg-primary-600/20 transition-all"></div>
              <div className="relative rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl">
                <Image 
                  src="/images/jeffery.jpeg" 
                  alt="Jeffrey D. West Jr." 
                  width={800} 
                  height={1000} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-12 text-white">
                  <div className="flex flex-col gap-2">
                    <p className="text-2xl font-black italic tracking-tighter">Jeffrey D. West Jr.</p>
                    <p className="text-primary-400 font-bold uppercase tracking-widest text-xs">Founder, A-List Home Pros</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Column */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase italic leading-none">Built by a <br/> <GoldText>Contractor.</GoldText></h2>
                <div className="w-32 h-2 bg-[#B8960C] rounded-full"></div>
              </div>
              
              <div className="space-y-8 text-2xl text-gray-600 font-medium leading-relaxed">
                <p>
                  Jeffrey D. West Jr. spent years in South Florida construction watching skilled contractors lose to lead-gen platforms that sold their leads to five competitors at once.
                </p>
                <p>
                  A-List is the alternative — built so good contractors get matched with serious projects, and serious property owners get matched with one verified pro instead of five competing pitches.
                </p>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 italic font-black text-gray-950">
                   "Every project that comes in, I see it. I match it. That's not changing anytime soon."
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                <a href="tel:5618884930" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-[#B8960C] text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Call Directly</p>
                    <p className="text-xl font-black text-gray-950 italic tracking-tighter">(561) 888-4930</p>
                  </div>
                </a>
                <a href="mailto:jwest@alisthp.com" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-gray-950 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Email Founder</p>
                    <p className="text-xl font-black text-gray-950 italic tracking-tighter">jwest@alisthp.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B.8 — Service area */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tighter uppercase italic">Currently Serving South Florida</h2>
            <p className="text-xl text-gray-400 font-medium italic">A-List Home Pros matches projects across the South Florida tri-county area.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {Object.entries(CITIES).map(([county, cities]) => (
              <div key={county} className="space-y-8 p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                <h4 className="text-xl font-black text-primary-600 uppercase italic tracking-tighter border-b border-primary-100 pb-4">{county}</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                  {cities.map((city, i) => (
                    <span key={i} className="hover:text-primary-600 transition-colors cursor-default whitespace-nowrap">{city} {i < cities.length - 1 && '·'}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-16 text-gray-400 font-bold italic uppercase tracking-widest">
            Don't see your city? <button onClick={scrollToForm} className="text-primary-600 underline">Submit your project</button> — if you're in South Florida, we likely cover it.
          </p>
        </div>
      </section>

      {/* B.9 — Secondary form (Full version) */}
      <section className="py-24 md:py-40 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-white p-8 md:p-20 rounded-[4rem] text-gray-950 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Tell Us About Your Project</h2>
              <p className="text-lg text-gray-500 font-medium italic">The more we know, the better we match. All fields help us pair you with the right A-List Founding Pro.</p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-8">
                <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle className="w-16 h-12" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Project Submitted Successfully</h3>
                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
                  Jeffrey will personally review your details and connect you with a vetted pro within 24–72 hours.
                </p>
                <div className="pt-8">
                  <button onClick={() => setFormSubmitted(false)} className="bg-gray-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-600 transition-all">Submit Another</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">First Name</label>
                    <input required type="text" placeholder="John" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Last Name</label>
                    <input required type="text" placeholder="Doe" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email</label>
                    <input required type="email" placeholder="john@doe.com" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Phone</label>
                    <input required type="tel" placeholder="(561) 888-4930" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Property ZIP Code</label>
                    <input required type="text" inputMode="numeric" placeholder="33401" className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Project Type</label>
                    <select required className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none">
                      <option value="">Select Category...</option>
                      {SERVICE_CATEGORIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Budget Range</label>
                    <select required className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none">
                      <option value="">Select Budget...</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-25k">$5,000 – $25,000</option>
                      <option value="25k-100k">$25,000 – $100,000</option>
                      <option value="100k-plus">$100,000+</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Timeline</label>
                    <select required className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none">
                      <option value="">Select Timeline...</option>
                      <option value="urgent">Urgent — within 2 weeks</option>
                      <option value="1-3-months">1–3 months</option>
                      <option value="3-6-months">3–6 months</option>
                      <option value="flexible">Flexible / planning ahead</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Project Description</label>
                  <textarea 
                    required 
                    minLength={50}
                    placeholder="Please describe your project in detail (e.g., 'Full kitchen remodel including new cabinets, granite countertops, and flooring...')" 
                    className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg min-h-[200px] resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">How did you hear about us?</label>
                  <select className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none">
                    <option value="">Select Option...</option>
                    <option value="Google">Google</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="pt-6 space-y-8">
                   <div className="space-y-4">
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic px-4">
                        By submitting, I agree A-List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with the matched A-List Founding Pro. Message and data rates may apply. Reply STOP to unsubscribe. See <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms</Link>.
                      </p>
                      <label className="flex items-center gap-4 px-4 cursor-pointer group">
                        <input type="checkbox" className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500 italic group-hover:text-primary-600 transition-colors">I'd like to receive marketing communications and project updates.</span>
                      </label>
                   </div>
                   
                   <button type="submit" className="w-full bg-gray-950 text-white py-8 rounded-3xl font-black uppercase tracking-widest text-lg hover:bg-primary-600 transition-all shadow-2xl shadow-gray-950/20 active:scale-[0.98] flex items-center justify-center group">
                      Submit Project
                      <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-3" />
                   </button>
                   
                   <p className="text-center text-xs font-black text-gray-400 uppercase italic tracking-widest">
                     Jeffrey D. West Jr. personally reviews every project. You'll hear back within 24–72 hours.
                   </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* B.10 — FAQ section */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase italic leading-none">Frequently <br/> <GoldText>Asked Questions</GoldText></h2>
            <p className="text-xl text-gray-400 font-medium italic">Everything you need to know before submitting your project.</p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-10 flex justify-between items-center text-left group"
                >
                  <span className="text-xl md:text-2xl font-black text-gray-950 uppercase tracking-tighter italic group-hover:text-primary-600 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-500 ${activeFaq === i ? 'rotate-180 text-primary-600' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-[500px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
                  <p className="text-xl text-gray-600 font-medium leading-relaxed italic pr-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B.11 — Final CTA */}
      <section className="py-32 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-primary-600/30 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-12 tracking-tighter uppercase italic leading-none">Ready to Stop <br/> <GoldText>Chasing Quotes?</GoldText></h2>
          <p className="text-2xl text-white/70 mb-20 font-medium italic max-w-2xl mx-auto">One project. One vetted match. One personal touch from the founder.</p>
          <button 
            onClick={scrollToForm}
            className="group inline-flex items-center justify-center bg-[#B8960C] text-white px-20 py-8 rounded-3xl font-black text-2xl uppercase tracking-widest hover:bg-primary-600 transition-all shadow-[0_20px_80px_rgba(184,150,12,0.3)] hover:scale-105 active:scale-95"
          >
            Submit Your Project
            <ArrowRight className="ml-6 h-8 w-8 transition-transform group-hover:translate-x-4" />
          </button>
          <p className="mt-12 text-sm font-black text-white/30 uppercase italic tracking-[0.3em]">Free. No spam. South Florida only.</p>
        </div>
      </section>
    </div>
  );
}
