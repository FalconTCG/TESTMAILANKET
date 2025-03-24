import { NextResponse } from 'next/server';

// Middleware function to handle redirects
export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  
  // Redirect all dashboard paths to dashboard-view
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    // Preserve any query parameters
    const targetUrl = new URL('/dashboard-view' + search, request.url);
    return NextResponse.redirect(targetUrl);
  }
  
  // For all other routes, continue normal processing
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    // Match dashboard and all of its sub-routes
    '/dashboard',
    '/dashboard/:path*'
  ],
}; 