'use client';

import Link from 'next/link';
import {
  ArrowRight, TrendingUp, Globe, Users, Zap, Building2,
  HardHat, Hammer, Target, Share2, CheckCircle, Mail, Phone
} from 'lucide-react';
import { APP_GATEWAY_URL } from '@/config/site';

const INVESTOR_EMAIL = 'info@alisthomepros.com';
const INVESTOR_PHONE = '1-866-88-ALIST';

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">

      {/* Hero */}
      <section className="relative bg-gray-950 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-gray-950 to-gray-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-10 border border-white/10">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            Investor Relations
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
            A New Infrastructure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
              for the Construction Industry
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
            A-List Home Pros connects property owners, professionals, and workforce into one scalable network built for how real projects move.
          </p>
          <a
            href={`mailto:${INVESTOR_EMAIL}`}
            className="inline-flex items-center gap-3 bg-primary-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-700 transition-all shadow-2xl shadow-primary-900/50 group"
          >
            Request Investor Access
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900">
            The Problem
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none">
            A Fragmented Industry
          </h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg">
            <p>
              The construction and home services industry is one of the largest sectors in the country, yet it still operates through disconnected systems. Property Owners struggle to identify reliable professionals, contractors are forced into inconsistent lead cycles, and labor access remains fragmented despite high demand. What should be a structured process often turns into uncertainty on all sides.
            </p>
            <p>
              At the same time, there is no centralized system that aligns project demand, professional supply, workforce access, and coordination into one environment. The result is inefficiency, lost time, and missed opportunities across every level of the industry.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Solution */}
      <section className="py-28 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
            The Solution
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none">
            A-List Home Pros
          </h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg">
            <p>
              A-List Home Pros is built as a network-driven platform designed to bring structure to how home service projects are sourced, staffed, and completed. Instead of operating as a traditional lead marketplace, the platform connects property owners, professionals, crew members, and specialists inside one ecosystem where each role has a defined place.
            </p>
            <p>
              By aligning opportunity, labor, coordination, and payment flow, A-List creates a more efficient system for how projects move. The platform is designed to reduce friction, improve trust, and create a stronger foundation for both service providers and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Platform Ecosystem */}
      <section className="py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
              Platform Ecosystem
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
              Built Around Real Project Flow
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
              A-List is designed around how projects actually happen, not how platforms typically display them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Property Owners', desc: 'Access trusted professionals and move projects forward with confidence.', icon: Building2 },
              { title: 'Home Pros', desc: 'Get positioned for real opportunities inside a growing network.', icon: Hammer },
              { title: 'Crew Members', desc: 'Connect directly to consistent, active work.', icon: HardHat },
              { title: 'Specialists', desc: 'Coordinate and facilitate project movement.', icon: Target },
              { title: 'Referral Partners', desc: 'Earn by expanding the network.', icon: Share2 },
            ].map((role, i) => {
              const Icon = role.icon;
              return (
                <div key={i} className="p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white">{role.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Market Opportunity */}
      <section className="py-28 px-4 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
                Market Opportunity
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                A Market Ready for Change
              </h2>
              <p className="text-white/60 font-medium leading-relaxed text-lg mb-10">
                Construction and home services represent one of the largest and most consistent sectors in the economy, yet the industry still lacks a unified platform that brings all participants together. Demand continues to grow, but systems remain outdated and fragmented.
              </p>
              <p className="text-primary-300 font-black text-lg italic">
                This creates a clear opportunity for a network-driven platform to define the category.
              </p>
            </div>
            <div className="space-y-6">
              {[
                'Skilled labor shortages are increasing',
                'Home service demand continues to rise',
                'No dominant platform has unified the space',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-primary-400 shrink-0" />
                  <span className="font-bold text-white/80">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Business Model */}
      <section className="py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
              Business Model
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
              Revenue Built Into the Network
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              A-List Home Pros is designed with a multi-layered revenue model that grows alongside platform activity — scaling through participation, project movement, and network expansion rather than relying on a single revenue source.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Subscription Revenue', desc: 'Recurring monthly plans for Home Pros, Crew Members, and Specialists.' },
              { title: 'Project Transaction Flow', desc: 'Activity-based revenue generated through platform project movement.' },
              { title: 'Referral Network', desc: 'Commission-based participation growing the user base organically.' },
              { title: 'Premium Visibility', desc: 'Future premium placement and visibility options for professionals.' },
            ].map((stream, i) => (
              <div key={i} className="p-8 border border-gray-100 dark:border-gray-800 rounded-3xl hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white">{stream.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{stream.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Scalability */}
      <section className="py-28 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
            Scalability
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
            Designed for Expansion
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed mb-16">
            A-List Home Pros is built to scale through a focused, repeatable growth strategy that begins with strong market density and expands into new regions over time.
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {[
              { step: '01', label: 'Build Local Dominance First' },
              { step: '02', label: 'Activate Referral-Driven Growth' },
              { step: '03', label: 'Expand Into New Metro Areas' },
            ].map((item, i) => (
              <div key={i} className="flex-1 p-8 bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                <div className="text-4xl font-black text-primary-200 dark:text-primary-900 mb-4">{item.step}</div>
                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Why Now */}
      <section className="py-28 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-black uppercase tracking-widest mb-8 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900">
            Why Now
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none">
            Right Market.<br />Right Timing.
          </h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg mb-12">
            <p>
              The construction and home services industry is at a point where traditional systems are no longer meeting the needs of the people who rely on them. Professionals are growing increasingly frustrated with inconsistent lead quality, property owners are demanding more transparency and reliability, and skilled labor continues to face gaps in consistent opportunity despite strong demand.
            </p>
            <p>
              At the same time, there is a broader shift toward digital platforms that simplify how services are accessed and delivered. As technology adoption continues to grow across industries, the expectation for a more organized, efficient system within home services is becoming unavoidable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Aging workforce creating new gaps',
              'Increased demand for home services',
              'Growing openness to digital platforms',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="font-bold text-gray-900 dark:text-white text-sm leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Vision */}
      <section className="py-28 px-4 bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
            Vision
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none">
            Building a Category Leader
          </h2>
          <div className="space-y-6 text-white/60 font-medium leading-relaxed text-lg">
            <p>
              A-List Home Pros is being built with the intention of becoming a central platform for how home service projects are sourced, coordinated, and completed. The goal is to create a system where property owners, professionals, and workforce participants operate within a network that provides structure, visibility, and trust at every stage of the process.
            </p>
            <p>
              As the platform grows, its value increases through network effects. More users create more opportunity, more connections, and stronger participation across all roles. This positions A-List not just as a tool, but as an environment where business activity can consistently take place.
            </p>
            <p>
              Long term, the vision is to establish A-List Home Pros as a recognized name in the home services industry — a platform that people associate with reliability, access, and execution.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Investor Access */}
      <section className="py-28 px-4 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Globe className="w-16 h-16 text-primary-300 mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
            Investor Access
          </h2>
          <p className="text-primary-100 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            For early investment opportunities or strategic discussions, reach out to our team directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href={`mailto:${INVESTOR_EMAIL}`}
              className="inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-50 transition-all"
            >
              <Mail className="w-5 h-5" />
              {INVESTOR_EMAIL}
            </a>
            <a
              href="tel:18668825478"
              className="inline-flex items-center gap-3 border-2 border-white/40 text-white px-8 py-5 rounded-[2rem] font-black text-lg hover:border-white transition-all"
            >
              <Phone className="w-5 h-5" />
              {INVESTOR_PHONE}
            </a>
          </div>
          <a
            href={`mailto:${INVESTOR_EMAIL}?subject=Investor Access Request`}
            className="inline-flex items-center gap-3 bg-gray-950 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-black transition-all group"
          >
            Request Investor Access
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

    </div>
  );
}
