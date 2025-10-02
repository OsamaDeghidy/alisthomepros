// Centralized site-wide constants for contact and trust information
// Values can be overridden via environment variables at build/runtime

export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1 (800) 555-7890';
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@alisthomepros.com';

export const BUSINESS_HOURS_WEEKDAYS = process.env.NEXT_PUBLIC_BUSINESS_HOURS_WEEKDAYS || 'Monday - Friday: 8AM - 6PM EST';
export const BUSINESS_HOURS_WEEKEND = process.env.NEXT_PUBLIC_BUSINESS_HOURS_WEEKEND || 'Saturday: 10AM - 4PM EST';

// Unified payment information across the site
export const PAYMENTS_PROVIDER_NAME = process.env.NEXT_PUBLIC_PAYMENTS_PROVIDER_NAME || 'SecurePay Escrow Services';
export const PAYMENTS_STORY = `All payments are securely processed via our escrow wallet powered by ${PAYMENTS_PROVIDER_NAME}. We accept all major credit/debit cards and ACH bank transfers for your convenience and security.`;

// Trust elements for the homepage
export const TRUST_LOGOS = [
  { name: 'Florida Contractors Association', image: '/images/trust/fca-logo.svg' },
  { name: 'Better Business Bureau', image: '/images/trust/bbb-logo.svg' },
  { name: 'HomeAdvisor', image: '/images/trust/homeadvisor-logo.svg' },
  { name: 'Angie\'s List', image: '/images/trust/angies-logo.svg' }
];