import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { format } from "@web/src/lib/utils"
import { AdapterSession, AdapterUser } from "next-auth/adapters"
import { withAuth } from "next-auth/middleware"

import { webEnv } from "./lib/env"

export default withAuth(
  async function middleware(req) {
    // get cookies session token
    const sessionToken = cookies().get("next-auth.session-token")?.value

    // stores session and user object
    let session = null
    let user = null

    try {
      /* if sessionToken is not available throw error */
      if (!sessionToken) throw Error

      /* if its available check if its valid or not */
      const response = await fetch(
        `${webEnv.SERVER_URL}/auth/session/${sessionToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-secret": webEnv.NEXTAUTH_SECRET,
          },
        }
      ).then((response) => {
        if (!response.ok) {
          throw Error
        }
        return response.json()
      })

      if (!response) {
        throw Error
      }
      session = format<AdapterSession>(response.session)
      user = format<AdapterUser>(response.user)
    } catch {
      // do nothing if fails it means the user is not logged in
    }

    // check if its auth page
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    if (isAuthPage) {
      if (session) {
        return NextResponse.redirect(new URL("/user", req.url))
      }

      return null
    }

    // check if token is available if not redirect to login page
    if (!session || !user) {
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
      if (user.role != "admin") {
        return NextResponse.redirect(new URL(`/user`, req.url))
      }
    }

    // check if profile is completed
    const isCompleteProfilePage = req.nextUrl.pathname === "/complete-profile"
    if (!user.completed_profile && !isCompleteProfilePage) {
      return NextResponse.redirect(new URL("/complete-profile", req.url))
    }

    // check if profile is completed but still in complete-profile page
    if (isCompleteProfilePage && user.completed_profile) {
      return NextResponse.redirect(new URL(`/user`, req.url))
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
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/auth/:path*",
    "/complete-profile",
  ],
}
