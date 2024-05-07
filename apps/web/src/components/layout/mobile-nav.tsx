"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Icons } from "@web/src/components/icons"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@web/src/components/ui/accordion"
import { Button } from "@web/src/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@web/src/components/ui/sheet"
import { navConfig } from "@web/src/config/nav"
import { siteConfig } from "@web/src/config/site"
import { cn } from "@web/src/lib/utils"
import { ExternalLink } from "lucide-react"
import { Session } from "next-auth"

interface MobileNavProps {
  user: Session["user"] | undefined
}

const MobileNav: React.FC<MobileNavProps> = ({ user }) => {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 sm:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href={user ? "/user/family-member" : "/"}
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logofull className="mr-2 h-8 w-auto" />
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pr-4">
          {user &&
          (pathname.startsWith("/user") || pathname.startsWith("/admin")) ? (
            <Accordion type="single" collapsible className="w-full">
              {navConfig.map((nav) => {
                if (
                  (nav.adminOnly && user.role !== "admin") ||
                  (nav.sellerOnly && user.type !== "seller") ||
                  (nav.buyerOnly && user.type !== "buyer")
                ) {
                  return
                }

                return (
                  <AccordionItem value={nav.title} key={nav.title}>
                    <AccordionTrigger className="hover:no-underline">
                      {nav.title}
                    </AccordionTrigger>
                    <AccordionContent className="ms-4 flex flex-col">
                      {nav.items.map((navItem) => (
                        <Link
                          href={navItem.href}
                          key={navItem.name}
                          className="hover:bg-accent hover:text-accent-foreground rounded-md p-3"
                        >
                          <div className="flex items-center gap-3">
                            {navItem.icon} {navItem.name}
                          </div>
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <>
              {user && (
                <Link
                  href="/user/family-member"
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground flex items-center gap-4 rounded-md p-2 transition-colors sm:hidden"
                  )}
                >
                  <p>Get Started</p>
                  <ExternalLink className="size-4" />
                </Link>
              )}
              <Link
                href={siteConfig.links.github}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground block rounded-md p-2 transition-colors sm:hidden"
                )}
              >
                GitHub
              </Link>
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export default MobileNav
