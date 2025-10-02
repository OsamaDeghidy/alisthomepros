import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, Shield, UserPlus, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroProps {
  stats?: {
    total_professionals: number;
    total_projects: number;
    customer_satisfaction: number;
    total_earnings: number;
    active_professionals: number;
    completed_projects: number;
  };
}

export default function Hero({ stats: apiStats }: HeroProps) {
  const popularServices = [
    'Kitchen Remodeling',
    'Bathroom Renovation', 
    'Electrical Work',
    'Plumbing',
    'Roofing',
    'HVAC Services',
    'Landscaping',
    'Painting'
  ];

  const serviceCategories = [
    'All Services',
    'Kitchen Remodeling',
    'Bathroom Renovation',
    'Electrical Work',
    'Plumbing',
    'Roofing',
    'HVAC Services',
    'Landscaping',
    'Painting',
    'Flooring',
    'Carpentry'
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Post Your Project',
      desc: 'Tell us what you need in minutes'
    },
    {
      icon: MessageSquare,
      title: 'Get Vetted Florida Pros',
      desc: 'Get matched with verified experts fast'
    },
    {
      icon: ShieldCheck,
      title: 'Pay with Escrow Protection',
      desc: 'Funds held securely until work is done'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  };

  const stats = [
    { 
      value: apiStats ? formatNumber(apiStats.total_professionals) : '50K+', 
      label: 'Trusted Professionals' 
    },
    { 
      value: apiStats ? `${apiStats.customer_satisfaction}%` : '98%', 
      label: 'Customer Satisfaction' 
    },
    { 
      value: apiStats ? formatNumber(apiStats.completed_projects || apiStats.total_projects) : '1M+', 
      label: 'Projects Completed' 
    },
    { 
      value: '100%', 
      label: 'Secure Payment Protection' 
    },
  ];

  // Local trusted logos from public/
  const trustLogos = [
    { name: 'Florida Contractors Association', src: '/images/trust/florida-contractors.svg', width: 240, height: 56 },
    { name: 'Better Business Bureau', src: '/images/trust/bbb.svg', width: 200, height: 56 },
    { name: 'HomeAdvisor', src: '/images/trust/homeadvisor.svg', width: 220, height: 56 },
    { name: 'Angie\'s List', src: '/images/trust/angies-list.svg', width: 192, height: 56 },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.1),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,206,0,0.08),transparent_60%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent-200/20 rounded-full blur-2xl animate-float-delay"></div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="text-center space-y-12">
          {/* Headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Verified & Trusted Professionals
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-dark-900 leading-tight">
              Post Your Project — Get Vetted Florida Pros with Escrow Protection
              <span className="block text-gradient-primary">Hire confidently with licensed, insured, background-checked experts</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-dark-600 leading-relaxed max-w-4xl mx-auto">
              Share your project in minutes and get matched with verified Florida professionals. Your funds are protected in escrow and released only when milestones are approved.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link href="/post-project" className="inline-flex items-center bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <UserPlus className="h-5 w-5 mr-2" />
                Post a Project
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link href="/how-it-works" className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-gray-300 text-dark-700 hover:bg-gray-50 transition">
                Learn How It Works
              </Link>
            </div>
          </div>

          {/* 3-step Mini Explainer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-left flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-primary-50 p-2">
                  <s.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-dark-900">{s.title}</div>
                  <div className="text-sm text-dark-600">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-upwork-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Service Type */}
                <div className="relative">
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    What service do you need?
                  </label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none">
                      {serviceCategories.map((service, index) => (
                        <option key={index} value={service.toLowerCase().replace(/\s+/g, '-')}> 
                          {service}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Where do you need it?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your zip code or city"
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Link href="/professionals" className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-6">
            <p className="text-sm text-dark-600 font-medium">Popular Services:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularServices.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-white/80 backdrop-blur-sm text-dark-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust Bar */}
          <div className="pt-8">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-dark-500 font-medium">Trusted by Florida homeowners and professionals</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-90">
                {/* Use trust logos from site config */}
                {trustLogos.map((logo) => (
                  <Image key={logo.name} src={logo.src} alt={`${logo.name} logo`} width={logo.width} height={logo.height} className="h-16 w-auto object-contain" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}