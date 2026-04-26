'use client';

import { 
  ArrowLeft, 
  ShieldAlert, 
  Lock, 
  CheckCircle, 
  Eye,
  Hammer
} from 'lucide-react';
import Link from 'next/link';

export default function GuestSafetyPage() {
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
             Safety <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 pr-10">Standards</span>
           </h1>
           <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed italic">
             Our unwavering commitment to physical, financial, and digital safety for everyone in the ecosystem.
           </p>
        </div>
      </section>

      {/* Safety Pillars */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           
           <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md">
                 <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 mb-6 uppercase tracking-tighter italic pr-4">Physical Safety</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                Mandatory background checks and site safety protocols for all A-List Certified professionals. We prioritize the physical security of property owners and crews above all else.
              </p>
           </div>

           <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md">
                 <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 mb-6 uppercase tracking-tighter italic pr-4">Financial Protection</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                Secure milestone-based payments and funds protection. We ensure that capital is only released when project requirements are met and verified.
              </p>
           </div>

           <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md">
                 <Eye className="w-8 h-8 text-[#B8960C]" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 mb-6 uppercase tracking-tighter italic pr-4">Digital Verification</h3>
              <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                Real-time validation of licenses, insurance, and professional standing. Our infrastructure prevents fraud before it enters the network.
              </p>
           </div>

        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 px-4">
         <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full text-[10px] font-black mb-10 tracking-widest uppercase italic">
               <CheckCircle className="w-4 h-4 text-primary-600" />
               A-List Certified
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-950 mb-8 tracking-tighter uppercase italic leading-[0.9] pr-4">
              “Trust is not a given. <br/>It is an infrastructure.”
            </h2>
            <p className="text-xl text-gray-500 font-medium italic">
              - Jeffrey West, Founder of A-List Home Professionals
            </p>
         </div>
      </section>
    </div>
  );
}
