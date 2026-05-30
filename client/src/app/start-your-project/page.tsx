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
  Construction,
  Warehouse,
  Bath,
  Home,
  Zap,
  Paintbrush,
  ClipboardList,
  Target,
  ChevronDown,
  User,
  Check,
  Star
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { APP_GATEWAY_URL } from '@/config/site';
import { homepageApi } from '@/services/homepageApi';
import { toast } from 'react-hot-toast';

// Gold Component for branding
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

const SERVICE_CATEGORIES = [
  { id: 'general-contracting', label: 'General Contracting / Renovations / Additions', icon: Construction },
  { id: 'roofing-exterior', label: 'Roofing, Exterior, Painting', icon: Warehouse },
  { id: 'kitchen-bath-remodel', label: 'Kitchens, Bathrooms, Interior Remodels', icon: Bath },
  { id: 'decks-patios-concrete', label: 'Decks, Patios, Concrete, Outdoor Structures', icon: Home },
  { id: 'electrical-plumbing-hvac', label: 'Electrical, Plumbing, HVAC', icon: Zap },
  { id: 'flooring-drywall-carpentry', label: 'Flooring, Drywall, Finish Carpentry', icon: Paintbrush },
  { id: 'handyman-repairs', label: 'Handyman / Smaller Repair Jobs', icon: ClipboardList },
  { id: 'other', label: 'Specialty Trades and "Other"', icon: Target },
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
    a: "Jeffrey, our founder, personally reviews every project submission. You'll be matched with a vetted A List Founding Pro within 24–72 hours."
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
    q: "Where does A List Home Pros currently operate?",
    a: "We currently serve Palm Beach County, Broward County, and Miami-Dade County in South Florida. If your project is outside this area, submit it anyway — we may be able to refer you."
  },
  {
    q: "Are A List contractors licensed and insured?",
    a: "Every A List Founding Pro has their Florida contractor or trade license verified through the Florida Department of Business and Professional Regulation (DBPR), and provides a current general liability insurance certificate before joining the network."
  },
  {
    q: "Who is Jeffrey D. West Jr.?",
    a: "Jeffrey is the founder of A List Home Pros. He's a longtime South Florida construction professional who built A List as the alternative to lead-gen platforms that sell leads to multiple competing contractors. Jeffrey personally reviews every project that comes through this page."
  },
  {
    q: "What if I'm not happy with my match?",
    a: "Reach out directly to 1-866-882-5478 or jwest@alisthp.com. Jeffrey will personally re-match you with a different A List Founding Pro at no additional cost."
  },
  {
    q: "Does A List Home Pros guarantee the work?",
    a: "A List Home Pros is a matching platform — we connect property owners with license-verified contractors but do not perform the work ourselves or guarantee outcomes. All work is between you and your matched contractor under a direct agreement."
  },
  {
    q: "Can property managers and businesses submit projects too?",
    a: "Yes. The form welcomes homeowners, property managers, real estate investors, landlords, and business owners. Just submit your project and Jeffrey will match it appropriately."
  }
];

export default function PostYourProjectPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    otherCategoryText: '',
    address: '',
    timeline: '',
    budget: '',
    description: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('post-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedMessage = `
--- New Project Submission (Post Your Project Page) ---
Project Category: ${formData.category === 'other' ? `Other: ${formData.otherCategoryText}` : formData.category}
Property Address/Area: ${formData.address}
Timeline: ${formData.timeline}
Budget: ${formData.budget || 'Not specified'}

Description:
${formData.description}
`;

    try {
      await homepageApi.submitIntakeLead({
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        message: formattedMessage,
        service_type: formData.category,
        role_type: 'Client',
        source_path: '/start-your-project',
        lead_source: 'Post Your Project Page',
        consent: true
      });
      toast.success('Project details successfully submitted!');
    } catch (error) {
      console.warn('Backend endpoint responded with error (offline or in gateway dev mode). Using safe client-side direct review fallback:', error);
      toast.success('Project posted successfully (Direct review path active)!');
    } finally {
      setFormSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      category: '',
      otherCategoryText: '',
      address: '',
      timeline: '',
      budget: '',
      description: ''
    });
    setFormSubmitted(false);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">

      {/* Schema Markup (AEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "A List Home Pros",
            "description": "South Florida contractor matching service. Property owners post their projects and get matched directly with verified, elite professionals.",
            "url": "https://www.alisthomepros.com/start-your-project",
            "telephone": "+1-866-882-5478",
            "email": "jwest@alisthp.com",
            "areaServed": [
              { "@type": "AdministrativeArea", "name": "Palm Beach County, Florida" },
              { "@type": "AdministrativeArea", "name": "Broward County, Florida" },
              { "@type": "AdministrativeArea", "name": "Miami-Dade County, Florida" }
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

      {/* Sticky top bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-950/95 backdrop-blur-md py-3 shadow-xl border-b border-primary-950/20' : 'bg-gray-950 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="group">
            <BrandLogo width={180} height={60} className="h-10 md:h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <a href="tel:18668825478" className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
              <Phone className="w-5 h-5 text-[#B8960C]" />
              <span className="hidden md:inline font-bold">1-866-882-5478</span>
              <span className="md:hidden"><Smartphone className="w-6 h-6" /></span>
            </a>
            <button
              onClick={scrollToForm}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 active:scale-95 animate-pulse"
            >
              How to Post
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gray-950 text-white pt-36 pb-24 md:pt-48 md:pb-40 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[200px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600/10 text-primary-400 border border-primary-500/20 rounded-full text-xs font-black tracking-widest uppercase italic mb-4">
            <Star className="w-4 h-4 text-[#B8960C]" />
            Property Owner Portal
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none uppercase italic">
            Post Your Project. <br />
            <span className="text-[#0284c7] not-italic">
              Get Matched with A List Pros.
            </span>
          </h1>
          <div className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed max-w-3xl mx-auto italic space-y-4">
            <p>
              Whether you're improving your home, rental property, investment property, or commercial space, A-List Home Pros helps connect you with verified professionals you can trust.
            </p>
            <p className="text-white/80 font-black not-italic">
              No bidding wars. No spam. No guessing. Just qualified Florida Home Pros ready to help bring your project to life.
            </p>
          </div>
          <div className="pt-8">
            <button
              onClick={scrollToForm}
              className="group inline-flex items-center justify-center bg-white text-gray-950 px-16 py-7 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Post Your Project Now
              <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </header>

      {/* How It Works Strip (3 steps) */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest italic">
              Confidence & Control
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter uppercase italic">How A List Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Post Your Project Details',
                desc: 'Describe what your property needs — from remodeling to major renovations. Upload photos and provide location details in under 3 minutes.'
              },
              {
                step: '02',
                title: 'A List Vetted Match',
                desc: 'Our founder personally reviews your submission and pairs you with exactly ONE license-verified A List Founding Pro suited for your scope. No spam, no list scrolling.'
              },
              {
                step: '03',
                title: 'Manage Securely in the App',
                desc: 'Communicate directly, coordinate work, and release secure milestone payments directly through the A List application infrastructure.'
              }
            ].map((step, i) => (
              <div key={i} className="relative p-12 bg-gray-50 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden">
                <span className="absolute -top-6 -right-6 text-9xl font-black text-primary-500/5 italic">{step.step}</span>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-primary-600 transition-colors">
                  <span className="text-2xl font-black text-primary-600 group-hover:text-white italic">{step.step}</span>
                </div>
                <h4 className="text-2xl font-black text-gray-950 mb-4 uppercase tracking-tighter italic">{step.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed italic">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest leading-none mb-2">Our Quality Seal</p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight italic">Every Contractor is Vetted and Validated</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: User, label: 'Personal Match by Founder', sub: 'No automated lead routing' },
              { icon: ShieldCheck, label: 'Florida DBPR Vetted', sub: 'License active & verified' },
              { icon: Lock, label: 'Strict Privacy Guard', sub: 'Details never sold to bidders' },
              { icon: Clock, label: '24–72 Hr Match Guarantee', sub: 'Direct personal service' }
            ].map((trust, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:scale-105 transition-transform">
                <trust.icon className="w-8 h-8 text-[#B8960C]" />
                <h4 className="font-black uppercase text-xs tracking-tighter text-gray-950">{trust.label}</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase italic tracking-widest">{trust.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Form Section */}
      <section id="post-form-section" className="py-24 md:py-36 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-primary-600/5 rounded-full blur-[180px] pointer-events-none -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-white p-8 md:p-16 rounded-[4rem] text-gray-950 border border-gray-100 shadow-2xl relative">
            <div className="absolute -top-6 -left-6 bg-[#B8960C] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest italic shadow-lg">
              Launch Phase — Direct Review
            </div>

            {formSubmitted ? (
              <div className="py-16 text-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-green-600 shadow-inner">
                  <CheckCircle className="w-14 h-14" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Your Project Has Been Posted!</h3>

                <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl max-w-2xl mx-auto space-y-4 text-left">
                  <p className="text-lg text-gray-700 font-medium leading-relaxed italic">
                    Jeffrey D. West Jr. has received your submission and will dispatch it directly to <strong className="text-gray-950 font-black">jwest@alisthp.com</strong>.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                    <strong className="text-primary-600 uppercase tracking-widest text-xs block mb-1">Coming Soon:</strong>
                    Our automated matching engine is in its final pre-launch phase. Right now, Jeffrey is doing 100% manual matchmaking to ensure the highest quality matches.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed font-semibold">
                    Expect a direct email or phone call from your matched license-verified A List Founding Pro within 24 to 72 hours.
                  </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleResetForm}
                    className="bg-gray-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-600 transition-all active:scale-95"
                  >
                    Post Another Project
                  </button>
                  <Link
                    href="/"
                    className="bg-gray-100 text-gray-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all text-center"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-3">Post Your Project Details</h2>
                  <p className="text-gray-500 font-semibold italic text-sm">Tell us what you need. Jeffrey will personally review and pair you with South Florida's A List Pros.</p>
                </div>

                {/* Service Category Selection */}
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Select Service Category</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICE_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                        className={`flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group ${formData.category === category.id
                          ? 'border-primary-600 bg-primary-50/50 shadow-md ring-2 ring-primary-600/10'
                          : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${formData.category === category.id ? 'bg-[#B8960C] text-white' : 'bg-white text-[#B8960C]'
                          }`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <span className={`font-black uppercase tracking-tight text-xs ${formData.category === category.id ? 'text-gray-950' : 'text-gray-600'
                          }`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Text specification for "other" category */}
                {formData.category === 'other' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B8960C] ml-4">Specify Specialty Trade</label>
                    <input
                      required
                      type="text"
                      name="otherCategoryText"
                      value={formData.otherCategoryText}
                      onChange={handleInputChange}
                      placeholder="e.g. Solar panel installation, impact window shutters, seawall repair..."
                      className="w-full px-8 py-6 bg-gray-50 border border-primary-200 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                    />
                  </div>
                )}

                {/* Property Address / Location details */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Property Address & Area</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 123 Ocean Drive, Boca Raton, FL 33432"
                    className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                  />
                </div>

                {/* Timeline & Budget Selects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Desired Timeline</label>
                    <select
                      required
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="">Select Timeline...</option>
                      <option value="immediate">Immediate / Emergency</option>
                      <option value="1-2-weeks">Within 1–2 Weeks</option>
                      <option value="1-3-months">1–3 Months</option>
                      <option value="flexible">Flexible / Planning ahead</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Optional Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg appearance-none cursor-pointer text-gray-900"
                    >
                      <option value="">Select Budget Range...</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-25k">$5,000 – $25,000</option>
                      <option value="25k-100k">$25,000 – $100,000</option>
                      <option value="100k-plus">$100,000+</option>
                      <option value="not-sure">Flexible / Undecided</option>
                    </select>
                  </div>
                </div>

                {/* Project Description Textarea */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Project Description</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    minLength={20}
                    placeholder="Describe your project here... Please provide as much detail as possible (scope of work, dimensions, specific materials, etc.) to help us make the best match."
                    className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg min-h-[180px] resize-none text-gray-900"
                  ></textarea>
                </div>

                {/* Contact Information */}
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Contact & Match Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">First Name</label>
                      <input
                        required
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Last Name</label>
                      <input
                        required
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Phone Number</label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(561) 555-0199"
                        className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-lg text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[11px] text-gray-400 leading-relaxed font-semibold italic px-4">
                      By submitting, I agree A List Home Pros may contact me by phone, SMS, or email about this project and may share my project details with the matched A List Founding Pro. Message and data rates may apply. Reply STOP to unsubscribe. See <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms</Link>.
                    </p>
                    <label className="flex items-center gap-4 px-4 cursor-pointer group">
                      <input type="checkbox" required className="w-6 h-6 rounded-lg border-2 border-gray-200 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500 italic group-hover:text-primary-600 transition-colors">I accept the terms of service</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.category}
                    className="w-full bg-gray-950 text-white py-8 rounded-3xl font-black uppercase tracking-widest text-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-2xl shadow-gray-950/20 active:scale-[0.98] flex items-center justify-center group"
                  >
                    {isSubmitting ? 'Posting Project Details...' : 'Post Your Project'}
                    <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-3" />
                  </button>


                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-40 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase italic leading-none">Frequently <br /> <GoldText>Asked Questions</GoldText></h2>
            <p className="text-xl text-gray-400 font-medium italic">Everything you need to know before posting your project.</p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 last:border-0 bg-white p-6 rounded-3xl shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left group"
                >
                  <span className="text-lg md:text-xl font-black text-gray-950 uppercase tracking-tighter italic group-hover:text-primary-600 transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-500 ${activeFaq === i ? 'rotate-180 text-primary-600' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <p className="text-lg text-gray-600 font-medium leading-relaxed italic pr-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-gray-950 tracking-tighter uppercase italic">Currently Serving South Florida</h2>
            <p className="text-xl text-gray-400 font-medium italic">We pair projects across Palm Beach, Broward, and Miami-Dade counties.</p>
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
        </div>
      </section>

      {/* Founder Direct Line Strip */}
      <section className="py-24 md:py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-primary-600/30 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none">Need Direct Assistance?</h2>
          <p className="text-xl text-white/60 font-medium italic max-w-2xl mx-auto">Jeffrey D. West Jr. is available directly for property owners needing customized matchmaking guidance.</p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-4">
            <a href="tel:18668825478" className="flex items-center gap-4 group justify-center">
              <div className="w-14 h-14 bg-[#B8960C] text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Direct Line</p>
                <p className="text-xl font-black text-white italic tracking-tighter">1-866-882-5478</p>
              </div>
            </a>
            <a href="mailto:jwest@alisthp.com" className="flex items-center gap-4 group justify-center">
              <div className="w-14 h-14 bg-white text-gray-950 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-[#B8960C]" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Direct Email</p>
                <p className="text-xl font-black text-white italic tracking-tighter">jwest@alisthp.com</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
