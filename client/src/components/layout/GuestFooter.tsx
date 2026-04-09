import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Heart, ShieldCheck } from 'lucide-react';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
          {/* Brand */}
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
               <Image 
                 src="/logo.png" 
                 alt="A-List Home Pros" 
                 width={180}
                 height={90}
                 className="h-12 w-auto mx-auto md:mx-0 object-contain"
               />
            </Link>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md mx-auto md:mx-0">
               The elite bridge for South Florida home services. Connecting homeowners with verified specialists and professional crews.
            </p>
            <div className="flex justify-center md:justify-start gap-10 opacity-80">
               <div className="flex items-center gap-2 text-success-600">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest border border-success-600 px-2 py-1 rounded">Secured</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest border border-primary-600 text-primary-600 px-2 py-1 rounded italic flex items-center">Florida Hub</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Platform</h4>
            <div className="flex flex-col space-y-4 text-sm font-bold text-gray-500">
               <Link href="/about" className="hover:text-primary-500 transition-colors">About the Network</Link>
               <Link href="/gallery" className="hover:text-primary-500 transition-colors">Project Gallery</Link>
               <Link href="/referral" className="hover:text-primary-500 transition-colors">Network Hub</Link>
               <Link href="/contact" className="hover:text-primary-500 transition-colors">Direct Contact</Link>
            </div>
          </div>

          {/* App Bridge */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Gateway</h4>
            <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="inline-flex items-center justify-center bg-primary-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl w-full"
            >
               <Smartphone className="w-4 h-4 mr-2" />
               Open App
            </Link>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
             <Heart className="w-3 h-3 text-primary-500" />
             &copy; {currentYear} A-List Home Professionals. All rights reserved.
          </div>
          <div className="flex gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/safety" className="hover:text-gray-900 transition-colors">Safety Standard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
