import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export const middleware = withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access protected routes
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Protect all routes except:
// - / (landing page)
// - /auth/* (auth pages)
// - /api/auth/* (NextAuth API)
export const config = {
  matcher: [
    "/feed",
    "/discover",
    "/marketplace",
    "/profile/:path*",
    "/items/:path*",
    "/messages/:path*",
    "/settings/:path*",
    "/payment/:path*",
    "/api/posts/feed",
    "/api/marketplace",
  ],
}
