"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@web/src/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@web/src/components/ui/navigation-menu"
import { navConfig } from "@web/src/config/nav"
import { siteConfig } from "@web/src/config/site"
import { cn } from "@web/src/lib/utils"
import { ExternalLink } from "lucide-react"
import { Session } from "next-auth"

interface MainNavProps {
  user: Session["user"] | undefined
}

const MainNav: React.FC<MainNavProps> = ({ user }) => {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden sm:flex">
      <Link
        href={user ? "/user/family-member" : "/"}
        className="mr-6 flex items-center space-x-2"
      >
        <Icons.logofull className="h-8 w-fit" />
      </Link>

      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {user &&
        (pathname.startsWith("/user") || pathname.startsWith("/admin")) ? (
          <NavigationMenu>
            <NavigationMenuList>
              {navConfig.map((nav) => {
                if (
                  (nav.adminOnly && user.role !== "admin") ||
                  (nav.sellerOnly && user.type !== "seller") ||
                  (nav.buyerOnly && user.type !== "buyer")
                ) {
                  return
                }
                return (
                  <NavigationMenuItem key={nav.title}>
                    <NavigationMenuTrigger>{nav.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {nav.items.map((navItem) => (
                          <ListItem
                            key={navItem.name}
                            icon={navItem.icon}
                            title={navItem.name}
                            href={navItem.href}
                          >
                            {navItem.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <>
            {user && (
              <Link
                href="/user/family-member"
                className={cn(
                  "text-foreground/60 hover:text-foreground/80 hidden items-center gap-2 transition-colors sm:flex"
                )}
              >
                <p>Get Started</p>
                <ExternalLink className="size-4" />
              </Link>
            )}
            <Link
              href={siteConfig.links.github}
              className={cn(
                "text-foreground/60 hover:text-foreground/80 hidden transition-colors sm:block"
              )}
            >
              GitHub
            </Link>
            <Link
              href="/terms"
              className={cn(
                "text-foreground/60 hover:text-foreground/80 hidden transition-colors sm:block"
              )}
            >
              Terms and Condition
            </Link>
            <Link
              href="/privacy"
              className={cn(
                "text-foreground/60 hover:text-foreground/80 hidden transition-colors sm:block"
              )}
            >
              Privacy Policy
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
export default MainNav

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: JSX.Element }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3 text-sm font-medium leading-none">
            {icon} {title}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
