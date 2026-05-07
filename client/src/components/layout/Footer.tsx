import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

export default function Footer() {
  const footerSections = {
    'For Clients': [
      { name: 'Start Your Project', href: '/start-your-project' },
      { name: 'Post a Project', href: '/post-project' },
      { name: 'Browse Professionals', href: '/professionals' },
      { name: 'How It Works', href: '/how-it-works' },
    ],
    'For Professionals': [
      { name: 'Find Work', href: '/find-work' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'How It Works', href: '/how-it-works' },
    ],
    'Resources': [
      { name: 'Help & Support', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Blog', href: '/blog' },
      
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Safety Standard', href: '/safety' },
      { name: 'Services', href: '/services' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Instagram', href: '#', icon: Instagram },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <BrandLogo
                width={210}
                height={70}
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Connecting property owners with trusted professionals for quality home improvement projects. Your trusted partner for all home services.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4 text-sm">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

       

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2">
            <p className="text-[10px] text-gray-500 italic leading-relaxed max-w-4xl">
              A-List Home Pros is a networking and marketplace platform. We do not perform contracting work, hold member or client funds, or guarantee the work, conduct, or outcomes of any member. License verification reflects status reported by the Florida DBPR as of the verification date and may change. Members are independent businesses, not employees or agents of A-List Home Pros. Nothing on this website constitutes legal, financial, or tax advice. Investment opportunities are limited to qualified investors per applicable securities exemptions.
            </p>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} A-List Home Professionals Inc. All Rights Reserved
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/safety"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Safety Standard
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/help"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}