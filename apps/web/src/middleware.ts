import { withAuth } from "next-auth/middleware"

// Visitors without a session (e.g. browsing the public preview) are sent to
// the sign-in page when they hit a page that needs an account (its backing
// APIs return 401 anyway). Public preview pages (/, /feed, /discover,
// /marketplace, /communities, /about, /items/:id, /profile/:userId) stay open.
// NOTE: must live in src/ because the app uses the src/ directory layout.
export default withAuth({
  pages: { signIn: "/auth/signin" },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: [
    "/create/:path*",
    "/messages/:path*",
    "/wallet/:path*",
    "/settings/:path*",
    "/library/:path*",
    "/vault/:path*",
    "/analytics/:path*",
    "/notifications/:path*",
    "/ad-studio/:path*",
    "/profile", // own profile only; /profile/:userId stays public
    "/profile/settings/:path*",
    "/profile/gallery/:path*",
  ],
}
