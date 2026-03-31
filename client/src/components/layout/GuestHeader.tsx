'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Smartphone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Network Hub', href: '/referral' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl py-3 shadow-sm border-b border-gray-100' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center transform transition-transform hover:scale-105">
            <Image 
              src="/logo.png" 
              alt="A-List Home Pros" 
              width={160}
              height={80}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-black uppercase tracking-widest transition-all hover:text-gold-500 relative py-2 group ${
                  isActive(item.href) ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            
            <Link
              href={APP_GATEWAY_URL}
              target="_blank"
              className="inline-flex items-center justify-center bg-gray-950 text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-gold-500 hover:text-gray-950 transition-all hover:scale-105 active:scale-95 group"
            >
              <Smartphone className="w-4 h-4 mr-2 text-gold-400 group-hover:text-gray-950" />
              Open App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-900 bg-gray-50 rounded-xl"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 py-8 px-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block text-xl font-black uppercase tracking-tighter ${
                isActive(item.href) ? 'text-gold-500' : 'text-gray-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
             <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="flex items-center justify-center bg-gray-950 text-white px-8 py-5 rounded-2xl text-lg font-black uppercase tracking-widest"
             >
               <Smartphone className="w-5 h-5 mr-3 text-gold-400" />
               Get the App
               <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
          </div>
        </div>
      )}
    </header>
  );
}
