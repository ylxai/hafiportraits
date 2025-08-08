/**
 * Next.js Middleware for Authentication
 * Protects admin routes and handles authentication
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Edge Runtime compatible validation
// import { validateSession } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/admin'];

// Routes that should redirect to admin if already authenticated
const authRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get('admin_session')?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/admin/login'
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route
  if (isProtectedRoute) {
    if (!sessionId) {
      // No session, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For Edge Runtime compatibility, we'll validate session via API call
    try {
      // Make internal API call to validate session (Edge Runtime compatible)
      // Simple environment-based URL handling
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? request.url  // Production: use HTTPS
        : request.url.replace('https://', 'http://');  // Development: force HTTP
      const validateUrl = new URL('/api/auth/me', baseUrl);
      
      console.log('Middleware validation URL:', validateUrl.toString());
      
      const validateResponse = await fetch(validateUrl.toString(), {
        headers: {
          'Cookie': `admin_session=${sessionId}`,
        },
      });

      if (!validateResponse.ok) {
        // Invalid session, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.set('admin_session', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0,
          path: '/'
        });
        return response;
      }

      const responseData = await validateResponse.json();
      
      // Check if response has the expected structure
      if (!responseData.success || !responseData.user) {
        throw new Error('Invalid response structure');
      }
      
      const user = responseData.user;
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id.toString());
      requestHeaders.set('x-user-username', user.username);
      requestHeaders.set('x-user-role', user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware session validation error:', error);
      // On error, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If accessing auth route while already authenticated
  if (isAuthRoute && sessionId) {
    try {
      // Make internal API call to validate session (Edge Runtime compatible)
      // Simple environment-based URL handling
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? request.url  // Production: use HTTPS
        : request.url.replace('https://', 'http://');  // Development: force HTTP
      const validateUrl = new URL('/api/auth/me', baseUrl);
      
      const validateResponse = await fetch(validateUrl.toString(), {
        headers: {
          'Cookie': `admin_session=${sessionId}`,
        },
      });

      if (validateResponse.ok) {
        // Already authenticated, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch (error) {
      // Continue to login page if validation fails
      console.error('Auth route validation error:', error);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes to avoid infinite loops)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};