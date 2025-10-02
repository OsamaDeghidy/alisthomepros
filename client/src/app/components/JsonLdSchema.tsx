'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface JsonLdSchemaProps {
  type: 'organization' | 'localBusiness' | 'faq' | 'product';
  data?: any;
}

export default function JsonLdSchema({ type, data }: JsonLdSchemaProps) {
  const pathname = usePathname();
  const baseUrl = 'https://alisthomepros.com';
  const currentUrl = `${baseUrl}${pathname}`;

  // مخطط المنظمة الافتراضي
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A-List Home Professionals',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.svg`,
    sameAs: [
      'https://facebook.com/alisthomepros',
      'https://twitter.com/alisthomepros',
      'https://instagram.com/alisthomepros',
      'https://linkedin.com/company/alisthomepros'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-123-4567',
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  };

  // مخطط الأعمال المحلية
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'A-List Home Professionals',
    url: currentUrl,
    logo: `${baseUrl}/images/logo.svg`,
    description: 'Connect with skilled home improvement professionals. From contractors to consultants, find the right expertise for your home projects.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main Street',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      postalCode: '33101',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.7617',
      longitude: '-80.1918'
    },
    telephone: '+1-800-123-4567',
    openingHours: 'Mo,Tu,We,Th,Fr 09:00-17:00',
    priceRange: '$$'
  };

  // مخطط الأسئلة الشائعة
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data?.faqs?.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })) || [
      {
        '@type': 'Question',
        name: 'How does A-List Home Professionals work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our platform connects homeowners with verified home improvement professionals. Post your project, receive quotes, and hire the best professional for your needs.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are all professionals on your platform verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we verify licenses, insurance, and conduct background checks on all professionals before they can join our platform.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to use A-List Home Professionals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our platform is free for homeowners to use. Professionals pay a small fee to be listed and to bid on projects.'
        }
      }
    ]
  };

  // مخطط المنتج
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data?.name || 'Professional Home Services',
    description: data?.description || 'Quality home improvement services by verified professionals',
    image: data?.image || `${baseUrl}/images/services-default.jpg`,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: data?.lowPrice || '50',
      highPrice: data?.highPrice || '10000',
      priceCurrency: 'USD',
      offerCount: data?.offerCount || '100+'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data?.rating || '4.8',
      reviewCount: data?.reviewCount || '250'
    }
  };

  // اختيار المخطط المناسب بناءً على النوع
  const getSchemaByType = () => {
    switch (type) {
      case 'organization':
        return organizationSchema;
      case 'localBusiness':
        return localBusinessSchema;
      case 'faq':
        return faqSchema;
      case 'product':
        return productSchema;
      default:
        return organizationSchema;
    }
  };

  const schema = getSchemaByType();

  return (
    <Script
      id={`jsonld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}