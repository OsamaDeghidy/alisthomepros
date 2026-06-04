'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Phone, 
  Users, 
  CreditCard, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PAYMENTS_STORY, PAYMENTS_PROVIDER_NAME } from '@/config/site';

// Brand Highlight Component
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C] font-black">{children}</span>
);

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'FREE NETWORK ACCESS',
      description: 'Start building your presence inside the A-List ecosystem.',
      price: '$0',
      period: 'FREE FOREVER',
      features: [
        'Create your professional profile',
        'Explore opportunities in your area',
        'Connect with Property Owners, Home Pros, Specialists, and Crew Members',
        'Build your reputation and activity history',
        'Receive platform updates and announcements',
        'Access basic visibility within the network'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/register?tier=free',
      popular: false,
      badge: 'Free Tier',
      gradient: 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
      borderClass: 'border-gray-200 dark:border-gray-800',
      textClass: 'text-gray-900 dark:text-white',
      descClass: 'text-gray-600 dark:text-gray-400',
      btnClass: 'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600',
      checkColor: 'text-gray-500'
    },
    {
      id: 'homepro',
      name: 'HOMEPRO FOUNDING MEMBER',
      description: 'All the tools, visibility, and opportunities you need to grow your professional business and win more work.',
      price: '$200',
      slashedPrice: '$450',
      period: 'FOUNDING MEMBER FEE /MO',
      features: [
        'Appear in project searches and recommendations',
        'Receive project opportunities from Property Owners',
        'Submit interest on posted projects',
        'Build reviews and trust signals',
        'Access Project Hub communication tools',
        'Request Crew Members when needed',
        'Verification and profile credibility tools',
        'Business growth resources and platform support'
      ],
      buttonText: 'Secure Founding Status',
      buttonLink: 'https://pay.alisthomepros.com/b/cNidR991ta0tchxfHMfMA01',
      popular: true,
      badge: 'Most Popular - Founding Member',
      gradient: 'from-amber-50/50 via-white to-amber-50/10 dark:from-amber-950/20 dark:via-gray-900 dark:to-gray-950',
      borderClass: 'border-[#B8960C] dark:border-[#B8960C] ring-4 ring-amber-500/10',
      textClass: 'text-gray-900 dark:text-white',
      descClass: 'text-gray-600 dark:text-gray-400',
      btnClass: 'bg-gradient-to-r from-[#B8960C] to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-amber-700',
      checkColor: 'text-[#B8960C]'
    },
    {
      id: 'crew',
      name: 'CREW FOUNDING MEMBER',
      description: 'All the tools, visibility, and opportunities you need to grow your crew and get more work.',
      price: '$50',
      slashedPrice: '$100',
      period: 'FOUNDING MEMBER FEE /MO',
      features: [
        'Create a professional crew profile',
        'Appear in crew searches',
        'Receive work opportunities from Home Pros',
        'Build ratings and work history',
        'Track projects and activity',
        'Showcase skills, certifications, and experience',
        'Access opportunities across the ecosystem',
        'Increase visibility as your profile grows',
        'Build long term relationships with Home Pros and Property Owners'
      ],
      buttonText: 'Join as Crew Founder',
      buttonLink: '/register?tier=crew-founding',
      popular: false,
      badge: 'Limited Spots',
      gradient: 'from-blue-50/50 via-white to-blue-50/10 dark:from-blue-950/20 dark:via-gray-900 dark:to-gray-950',
      borderClass: 'border-blue-500 dark:border-blue-500/50 ring-4 ring-blue-500/10',
      textClass: 'text-gray-900 dark:text-white',
      descClass: 'text-gray-600 dark:text-gray-400',
      btnClass: 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700',
      checkColor: 'text-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black selection:bg-amber-100 selection:text-amber-900">
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-24 px-4 text-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-blue-500 rounded-full blur-[100px] opacity-10"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Star className="w-4 h-4" />
            Ecosystem Access
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase italic">
            Choose Your Place <br className="hidden md:block" />
            <span className="text-amber-400">In The Ecosystem.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto leading-relaxed">
            Simple, transparent, and built to scale your business. Join Florida's premier construction network today.
          </p>
          <div className="flex justify-center items-center gap-2 mt-8 text-sm text-white/40">
            <Shield className="h-5 w-5 text-amber-500" />
            <span>Secure payments powered by {PAYMENTS_PROVIDER_NAME}</span>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border ${plan.borderClass} p-8 md:p-10 shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden`}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {plan.badge}
              </div>

              {/* Card Header */}
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase mb-2">
                  {plan.name}
                </h3>
                <p className={`${plan.descClass} text-sm font-medium leading-relaxed min-h-[48px]`}>
                  {plan.description}
                </p>
              </div>

              {/* Price Details */}
              <div className="mb-8 flex items-baseline gap-2 bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                {plan.slashedPrice && (
                  <span className="text-gray-400 dark:text-gray-600 line-through text-2xl font-bold">
                    {plan.slashedPrice}
                  </span>
                )}
                <span className="text-5xl font-black text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-wider ml-1 self-center max-w-[120px] leading-tight">
                  {plan.period}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Check className={`w-5 h-5 ${plan.checkColor} shrink-0 mt-0.5`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <Link
                href={plan.buttonLink}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all ${plan.btnClass}`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Multipliers & Steps */}
      <section className="py-24 px-4 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Three Steps To The <br />
              <GoldText>Gold</GoldText> Standard.
            </h2>
            <p className="text-white/40 font-medium text-lg max-w-2xl mx-auto italic">
              Our ecosystem rewards high-standard professionals who verify credentials and build long-term trust in Florida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-xl font-black mb-3 uppercase tracking-tight">1. Create Profile</h4>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Join as a Pro, Crew, or Specialist. Detail your licensing, insurance, and past work history.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-xl font-black mb-3 uppercase tracking-tight">2. Get Verified</h4>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Our specialists review credentials, DBPR status, and insurance details to award the Verified badge.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h4 className="text-xl font-black mb-3 uppercase tracking-tight">3. Scale & Win</h4>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Appear in project matching, request crew assistance, and build reviews that earn Certified status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secure & Direct FAQ Details */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase mb-6">
            Ecosystem Integration Protection
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-8">
            {PAYMENTS_STORY}. A-List never charges transaction percentages or hides fee distributions. All funds are secured and transacted using state-of-the-art secure infrastructure.
          </p>
        </div>
      </section>
      
    </div>
  );
}