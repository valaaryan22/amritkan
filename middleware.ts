import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Get auth token from cookies or check if it exists
  const authToken = request.cookies.get('authToken')?.value
  
  // If trying to access protected route without token, redirect to login
  if (!isPublicRoute && !authToken) {
    // Check localStorage via client-side (this is a limitation of middleware)
    // We'll handle this on the client side with a component
    return NextResponse.next()
  }
  
  // If authenticated and trying to access login, redirect to home
  if (isPublicRoute && authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
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
}
