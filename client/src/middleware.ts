import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE;

  // Only apply logic if in gateway mode
  if (siteMode !== 'gateway') {
    return NextResponse.next();
  }

  // Define gateway routes mapping
  const gatewayRoutes: Record<string, string> = {
    '/': '/guest',
    '/about': '/guest/about',
    '/inside-a-list': '/guest/inside-a-list',
    '/pricing': '/guest/pricing',
    '/media': '/guest/media',
    '/press': '/guest/press',
    '/articles': '/guest/articles',
    '/help': '/guest/help',
    '/investors': '/guest/investors',
    '/investor-contact': '/guest/investor-contact',
    '/community': '/guest/community',
    '/safety': '/guest/safety',
    '/contact': '/guest/contact',
  };

  // Case-insensitive mapping for static pages
  const normalizedPath = pathname.toLowerCase();
  
  if (gatewayRoutes[normalizedPath]) {
    const url = request.nextUrl.clone();
    url.pathname = gatewayRoutes[normalizedPath];
    return NextResponse.rewrite(url);
  }

  // Special handling for Profile links to show a Guest View
  if (normalizedPath === '/profile' || normalizedPath === '/Profile') {
     const url = request.nextUrl.clone();
     url.pathname = '/guest/profile'; // I will create this page
     return NextResponse.rewrite(url);
  }

  // Prevent accessing platform pages in gateway mode unless explicitly allowed
  // Legal pages and other standalone pages that should always be accessible directly
  const platformExclusions = [
    '/client', '/professional', '/api', '/_next', '/images', '/favicon.ico',
    '/terms', '/privacy',
  ];
  const isExcluded = platformExclusions.some(prefix => pathname.startsWith(prefix));

  // Also exclude common file extensions
  const isFile = pathname.includes('.');

  if (!isExcluded && !isFile && !pathname.startsWith('/guest')) {
    // For other platform pages, redirect to home or show gateway version
    const url = request.nextUrl.clone();
    url.pathname = '/guest';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
