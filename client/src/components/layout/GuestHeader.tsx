'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Smartphone, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BrandLogo } from '../ui/BrandLogo';
import { APP_GATEWAY_URL } from '@/config/site';

export default function GuestHeader() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Inside A-List', href: '/inside-a-list' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const isActive = (path: string) => pathname === path;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl py-3 shadow-md border-b border-primary-100/20 dark:border-primary-900/10' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center transform transition-transform hover:scale-105">
            <BrandLogo 
              width={200}
              height={100}
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-black uppercase tracking-widest transition-all hover:text-primary-500 relative py-2 group ${
                  isActive(item.href) ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-900 dark:text-gray-100 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              aria-label="Toggle theme"
            >
              {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </button>

            <Link
              href={APP_GATEWAY_URL}
              target="_blank"
              className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 group"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Open App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              {mounted && (theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />)}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-t border-gold-100/10 py-8 px-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block text-xl font-black uppercase tracking-tighter ${
                isActive(item.href) ? 'text-primary-500' : 'text-gray-900 dark:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
             <Link
               href={APP_GATEWAY_URL}
               target="_blank"
               className="flex items-center justify-center bg-primary-600 text-white px-8 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-500/20"
             >
               <Smartphone className="w-5 h-5 mr-3" />
               Get the App
               <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
          </div>
        </div>
      )}
    </header>
  );
}
