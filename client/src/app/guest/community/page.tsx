'use client';

import { 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  Heart,
  Scale
} from 'lucide-react';
import Link from 'next/link';

export default function GuestCommunityPage() {
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
             Community <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Guidelines</span>
           </h1>
           <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed italic">
             Our standards for maintaining an elite, respectful, and high-performance environment.
           </p>
        </div>
      </section>

      {/* Guidelines Content */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-20">
           
           <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center flex-shrink-0">
                 <Heart className="w-10 h-10 text-primary-600" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-gray-950 uppercase pr-4 tracking-tighter italic">Professional Respect</h2>
                 <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                   Every interaction within the A-List ecosystem must be rooted in mutual respect. This applies to communication between property owners, crews, and specialists. Zero tolerance for harassment or unprofessional conduct.
                 </p>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center flex-shrink-0">
                 <Scale className="w-10 h-10 text-[#B8960C]" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-gray-950 uppercase pr-4 tracking-tighter italic">Integrity & Accountability</h2>
                 <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                   Professionals must represent their skills and experience accurately. Falsifying credentials or historical performance is grounds for immediate permanent exclusion from the network.
                 </p>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center flex-shrink-0">
                 <ShieldCheck className="w-10 h-10 text-primary-400" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-3xl font-black text-gray-950 uppercase pr-4 tracking-tighter italic">Security Standards</h2>
                 <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                   Maintain the security of your account and the ecosystem. Sharing credentials or attempting to circumvent platform payment systems is strictly prohibited to protect all parties.
                 </p>
              </div>
           </div>

        </div>
      </section>

      {/* Enforcement CTA */}
      <section className="px-4">
         <div className="max-w-5xl mx-auto bg-gray-50 border border-gray-100 rounded-[4rem] p-16 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-10 border border-gray-100">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-4xl font-black text-gray-950 mb-6 tracking-tighter uppercase italic pr-4">Reporting Violations</h2>
            <p className="text-gray-500 text-xl font-medium italic mb-10 max-w-2xl mx-auto">
              If you witness behavior that violates these guidelines, report it immediately through the app or contact our security force.
            </p>
            <Link href="mailto:support@alisthomepros.com" className="inline-flex items-center gap-4 text-2xl font-black text-primary-600 hover:text-gray-950 transition-colors underline underline-offset-8 decoration-primary-600/30 italic">
               Contact Support Force
            </Link>
         </div>
      </section>
    </div>
  );
}
