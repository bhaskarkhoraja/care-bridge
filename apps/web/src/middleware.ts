import { NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import { getSession } from "next-auth/react"

export default withAuth(
  async function middleware(req) {
    // get Sessions
    const session = await getSession({
      req: {
        ...req,
        headers: {
          ...Object.fromEntries(req.headers),
        },
      },
    })

    // check if its auth page
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    if (isAuthPage) {
      if (session) {
        return NextResponse.redirect(new URL("/user", req.url))
      }

      return null
    }

    // check if token is available if not redirect to login page
    if (!session) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    // check if its admin page if yes check if the user is admin
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin")
    if (isAdminPage) {
      if (session.user.role != "admin") {
        return NextResponse.redirect(new URL(`/user`, req.url))
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/auth/:path*"],
}
