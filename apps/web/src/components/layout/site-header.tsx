import Link from "next/link"
import MainNav from "@web/src/components/layout/main-nav"
import MobileNav from "@web/src/components/layout/mobile-nav"
import ModeToggle from "@web/src/components/theme/mode-toggle"
import { buttonVariants } from "@web/src/components/ui/button"
import { UserAccountNav } from "@web/src/components/user-account-nav"
import { getCurrentUser } from "@web/src/lib/session"
import { cn } from "@web/src/lib/utils"

const SiteHeader = async () => {
  const user = await getCurrentUser()

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <MainNav />
        <MobileNav />
        {user ? (
          <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
          />
        ) : (
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center gap-4">
              <ModeToggle type="button" />
              <div
                aria-description="login signup container"
                className="space-x-2"
              >
                <Link
                  href="/auth/login"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "px-4"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  Signup
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default SiteHeader
