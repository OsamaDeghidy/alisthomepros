'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function StickyCallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Delay showing the button for 2 seconds after page load
    const timer = setTimeout(() => {
      // التحقق من عدم إغلاق المستخدم للزر سابقاً
      const dismissed = localStorage.getItem('cta_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Store dismissal state for one day
    localStorage.setItem('cta_dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('cta_dismissed');
    }, 24 * 60 * 60 * 1000); // 24 ساعة
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 shadow-lg flex justify-between items-center">
      <div className="flex-1 text-center sm:text-right">
        <span className="font-bold text-lg">Ready to start your next project?</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/post-project" 
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-bold transition-colors duration-300"
        >
          Post a Project
        </Link>
        
        <button 
          onClick={handleDismiss} 
          className="text-white hover:text-blue-200 transition-colors duration-300"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}