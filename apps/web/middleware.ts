import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/landing', '/auth/signin', '/auth/register', '/about', '/feed', '/discover', '/marketplace']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'))

  // If user is authenticated and trying to access auth pages, redirect to feed
  if (token && (pathname === '/auth/signin' || pathname === '/auth/register' || pathname === '/' || pathname === '/landing')) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to landing
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}