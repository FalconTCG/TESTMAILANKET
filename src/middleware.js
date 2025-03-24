import { NextResponse } from 'next/server';

// Middleware function to handle redirects
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Redirect /dashboard to /dashboard-view
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard-view', request.url));
  }
  
  // For all other routes, continue normal processing
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    // Match exact dashboard path only
    '/dashboard'
  ],
}; 