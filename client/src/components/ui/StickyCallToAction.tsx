'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

interface StickyCallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  position?: 'bottom' | 'top';
  showAfterScroll?: number; // pixels scrolled before showing
  dismissible?: boolean;
}

const StickyCallToAction = ({
  title = 'Need help with your project?',
  description = 'We’ll help you find the best professionals for your project',
  buttonText = 'Post a Project',
  buttonLink = '/post-project',
  position = 'bottom',
  showAfterScroll = 300,
  dismissible = true,
}: StickyCallToActionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this CTA before
    const hasDismissedCTA = localStorage.getItem('dismissedCTA');
    if (hasDismissedCTA) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > showAfterScroll) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dismissedCTA', 'true');
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed ${
        position === 'bottom' ? 'bottom-0' : 'top-0'
      } left-0 right-0 bg-white shadow-upwork border-t border-gray-200 transform transition-transform duration-300 z-50 ${
        isVisible ? 'translate-y-0' : position === 'bottom' ? 'translate-y-full' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0 text-center sm:text-right">
          <h3 className="font-heading font-bold text-lg text-dark-900">{title}</h3>
          <p className="text-sm text-dark-600">{description}</p>
        </div>
        <div className="flex items-center">
          <Link 
            href={buttonLink}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {buttonText}
          </Link>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyCallToAction;