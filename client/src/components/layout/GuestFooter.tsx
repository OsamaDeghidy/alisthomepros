import Link from 'next/link';
import { Smartphone, Heart, ShieldCheck, Globe, ArrowRight, Zap, Target } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { APP_GATEWAY_URL } from '@/config/site';

// Gold Component for branding
const GoldText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[#B8960C]">{children}</span>
);

export default function GuestFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800 pt-32 pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* 2. Brand Column (Col 1-4) */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <BrandLogo
                width={280}
                height={140}
                className="h-16 w-auto"
              />
            </Link>
            <div className="space-y-6">
               <p className="text-xl font-black italic tracking-tight text-white uppercase italic">
                 South Florida's <GoldText>Private Network</GoldText>
               </p>
               <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm italic">
                 The high-performance ecosystem for construction and home service elite. We don't just connect; we position for success.
               </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#B8960C]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secured</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-primary-400">
                <Target className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Florida Hub</span>
              </div>
            </div>
          </div>

          {/* 3. Company Column (Col 5-6) */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500">Company</h4>
            <div className="flex flex-col space-y-5 text-base font-bold text-gray-400">
              <Link href="/about" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">About</Link>
              <Link href="/inside-a-list" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">How It Works</Link>
              <Link href="/contact" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Contact</Link>
              <Link href="#" className="text-gray-600 cursor-not-allowed uppercase tracking-wider italic">Careers</Link>
            </div>
          </div>

          {/* 4. Resources Column (Col 7-8) */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500">Resources</h4>
            <div className="flex flex-col space-y-5 text-base font-bold text-gray-400">
              <Link href="/media" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Media</Link>
              <Link href="/press" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Press & News</Link>
              <Link href="/articles" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Articles</Link>
              <Link href="/help" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Help Center</Link>
            </div>
          </div>

          {/* 5. Investors Column (Col 9-10) */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500">Investors</h4>
            <div className="flex flex-col space-y-5 text-base font-bold text-gray-400">
              <Link href="/investors" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Why Invest</Link>
              <Link href="/investors#overview" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Overview</Link>
              <Link href="/investors#early-access" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Early Access</Link>
              <Link href="/investor-contact" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Investor Contact</Link>
            </div>
          </div>

          {/* 6. Legal Column (Col 11-12) */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary-500">Legal</h4>
            <div className="flex flex-col space-y-5 text-base font-bold text-gray-400">
              <Link href="/terms" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Terms</Link>
              <Link href="/privacy" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Privacy</Link>
              <Link href="/community" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Community</Link>
              <Link href="/safety" className="hover:text-[#B8960C] transition-colors uppercase tracking-wider italic">Safety</Link>
            </div>
          </div>
        </div>

        {/* 7. Footer Bottom Strip */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 text-sm font-black text-gray-500 uppercase tracking-widest italic">
            <GoldText>&copy; {currentYear}</GoldText>
            <span>A-List Home Professionals. All rights reserved.</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-lg font-black text-white italic uppercase tracking-tight">
              Join the <GoldText>A-List Network</GoldText> Today
            </p>
            <Link
              href={APP_GATEWAY_URL}
              target="_blank"
              className="group inline-flex items-center justify-center bg-white text-gray-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              <Smartphone className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              Open App
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
