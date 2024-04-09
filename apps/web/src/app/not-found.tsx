import Link from "next/link"
import { getServerSession } from "next-auth"

import { buttonVariants } from "../components/ui/button"
import { authOptions } from "../lib/auth"

export default async function NotFound() {
  const session = await getServerSession(authOptions)
  const path = session?.user ? "/user" : "/"

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-black md:text-7xl">404</h1>
      <p className="text-sm md:text-lg">Page not found</p>
      <Link
        href={path}
        className={`mt-6 ${buttonVariants({ variant: "default", size: "sm" })}`}
      >
        Return Home
      </Link>
    </main>
  )
}
