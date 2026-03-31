'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/lib/store';
import GuestHeader from '@/components/layout/GuestHeader';
import GuestFooter from '@/components/layout/GuestFooter';
import { SITE_MODE } from '@/config/site';

const inter = Inter({ subsets: ['latin'] });

// استيراد ديناميكي للمكونات الثقيلة
const StickyCallToAction = dynamic(() => import('@/components/ui/StickyCallToAction'), {
  ssr: false,
});

const ProjectIntakeForm = dynamic(() => import('@/components/forms/ProjectIntakeForm'), {
  ssr: false,
});

// مكون لتتبع محاولات الخروج من الموقع
const ExitIntent = () => {
  const [showExitForm, setShowExitForm] = useState(false);
  const pathname = usePathname();

  // تجاهل صفحات معينة مثل صفحة تسجيل الدخول أو صفحة نشر المشروع
  const excludedPaths = ['/login', '/register', '/post-project'];
  const shouldShowExitIntent = pathname ? !excludedPaths.some(path => pathname.startsWith(path)) : true;

  useEffect(() => {
    if (!shouldShowExitIntent) return;

    // التحقق مما إذا كان المستخدم قد رأى النموذج بالفعل
    const hasSeenExitForm = localStorage.getItem('hasSeenExitForm');
    if (hasSeenExitForm) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // إظهار النموذج فقط عندما يحاول المستخدم مغادرة النافذة من الأعلى
      if (e.clientY <= 0) {
        setShowExitForm(true);
        // تسجيل أن المستخدم قد رأى النموذج (لمدة يوم واحد)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        localStorage.setItem('hasSeenExitForm', expiryDate.toString());
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pathname, shouldShowExitIntent]);

  if (!showExitForm) return null;

  return <ProjectIntakeForm onClose={() => setShowExitForm(false)} />;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // تحديد الصفحات التي يجب أن يظهر فيها مكون StickyCallToAction
  const showStickyCallToAction = pathname ? ['/how-it-works', '/'].includes(pathname) : false;

  // تحديد ما إذا كانت الصفحة الحالية ضمن "واجهة الزوار البسيطة"
  // If SITE_MODE is 'gateway', we use the Guest layout for the root and specified paths.
  // Explicit /guest paths always use the guest layout.
  const guestPaths = ['/', '/about', '/contact', '/gallery', '/referral'];
  const isGuestPage = pathname?.startsWith('/guest') || 
                     (SITE_MODE === 'gateway' && guestPaths.includes(pathname || ''));

  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {isGuestPage ? (
              <>
                <GuestHeader />
                <main className="min-h-screen">{children}</main>
                <GuestFooter />
              </>
            ) : (
              <>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                {showStickyCallToAction && <StickyCallToAction />}
                <ExitIntent />
              </>
            )}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
