import * as React from "react"
import Link from "next/link"
import { Icons } from "@web/src/components/icons"
import { siteConfig } from "@web/src/config/site"
import { cn } from "@web/src/lib/utils"
import { Copyright } from "lucide-react"

const SiteFooter = ({ className }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logoshort className="size-8" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link
              href={new URL(siteConfig.links.twitter)}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Bhaskar Khoraja
            </Link>
            . Hosted on{" "}
            <Link
              href={new URL("https://vercel.com")}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
            . Component by{" "}
            <Link
              href={new URL("https://ui.shadcn.com/")}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shadcn
            </Link>
            . The source code is available on{" "}
            <Link
              href={new URL(siteConfig.links.github)}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
            <span className="flex items-center">
              Copyright&nbsp;
              <Copyright className="h-4 w-fit" />
              &nbsp;{new Date().getFullYear()} Bhaskar Khoraja. All rights
              reserved.{" "}
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
