'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserCheck, ShieldCheck, Star, MapPin, Award, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { APP_GATEWAY_URL } from '@/config/site';

function ProfileContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams?.get('id');

  return (
    <div className="bg-[#fcfdff] min-h-screen pb-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-8">
         <Link href="/gallery" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Professionals
         </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4">
         {/* Profile Card Header */}
         <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl p-8 md:p-16 flex flex-col items-center text-center relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-primary-50/50 to-transparent"></div>
            
            <div className="relative mb-8">
               <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-gray-100">
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                     <UserCheck className="w-24 h-24" />
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-4 rounded-3xl shadow-xl border-4 border-white">
                  <ShieldCheck className="w-8 h-8" />
               </div>
            </div>

            <div className="relative z-10 max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  Verified A-List Professional
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
                  {profileId === '69b2bc5bf970502ff8720e42' ? 'Jeffrey West' : 'A-List Specialist'}
               </h1>
               <div className="flex items-center justify-center gap-6 mb-8 text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                     <MapPin className="w-4 h-4 text-primary-500" />
                     West Palm Beach, FL
                  </div>
                  <div className="flex items-center gap-1">
                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                     4.9/5 Rating
                  </div>
               </div>
               <p className="text-xl text-gray-600 leading-relaxed italic mb-10">
                  "Specializing in high-end residential painting and network building. My goal is to ensure every community in Florida has access to elite home care."
               </p>
            </div>

            {/* CTA Box */}
            <div className="w-full max-w-md bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
               <h3 className="text-2xl font-black text-gray-900 mb-4">Work with This Pro</h3>
               <p className="text-gray-500 text-sm mb-8 font-medium">All communication, bookings, and payments are handled securely through the A-List Home Pros app.</p>
               
               <Link 
                  href={APP_GATEWAY_URL}
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-3 bg-gray-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black transition-all hover:scale-105 shadow-xl shadow-gray-200"
               >
                  <Smartphone className="w-6 h-6" />
                  Open in App
                  <ArrowRight className="w-6 h-6" />
               </Link>
            </div>
         </div>

         {/* Badges / Stats Section */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
               { icon: Award, title: 'Network Founder', value: 'Elite Member' },
               { icon: starIconCode, title: 'Completed Jobs', value: 'Over 500+' },
               { icon: ShieldCheck, title: 'Verification', value: 'Background Checked' }
            ].map((stat, i) => (
               <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
                     {typeof stat.icon === 'string' ? <Star className="w-6 h-6" /> : <stat.icon className="w-6 h-6" />}
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

export default function GuestProfilePage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#fcfdff] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
       </div>
    }>
       <ProfileContent />
    </Suspense>
  );
}

const starIconCode = (props: any) => <Star {...props} />;
