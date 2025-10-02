'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

export default function SEOHead({
  title = 'A-List Home Professionals',
  description = 'Connect with skilled home improvement professionals. From contractors to consultants, find the right expertise for your home projects.',
  keywords = 'home improvement, contractors, home professionals, renovation, repair, construction',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: SEOHeadProps) {
  const pathname = usePathname();
  const baseUrl = 'https://alisthomepros.com';
  const currentUrl = `${baseUrl}${pathname}`;
  const fullTitle = title.includes('A-List Home Professionals') ? title : `${title} | A-List Home Professionals`;

  return (
    <Head>
      {/* العناوين الأساسية */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* روابط الموقع */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:site_name" content="A-List Home Professionals" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:site" content="@alisthomepros" />
      
      {/* معلومات إضافية */}
      <meta name="author" content="A-List Home Professionals" />
      <meta name="robots" content="index, follow" />
    </Head>
  );
}