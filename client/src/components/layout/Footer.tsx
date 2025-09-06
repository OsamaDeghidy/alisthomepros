import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const footerSections = {
    'For Clients': [
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
              <Image
                src="/logo.png"
                alt="A-List Home Pros"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Connecting homeowners with trusted professionals for quality home improvement projects. Your trusted partner for all home services.
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
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
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
          <div className="text-gray-400 text-sm">
            © 2024 A-List Home Professionals Inc. All Rights Reserved
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