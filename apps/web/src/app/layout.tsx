import type { Metadata, Viewport } from "next"

import "@web/src/styles/globals.css"
import "@web/src/styles/themes.css"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { TailwindIndicator } from "@web/src/components/tailwind-indicator"
import ThemeProvider from "@web/src/components/theme/theme-provider"
import ThemeSwitcher from "@web/src/components/theme/theme-switcher"
import ThemeWrapper from "@web/src/components/theme/theme-wrapper"
import { Toaster } from "@web/src/components/ui/sonner"
import { siteConfig } from "@web/src/config/site"
import { fontSans } from "@web/src/lib/font"
import { cn } from "@web/src/lib/utils"
import NextTopLoader from "nextjs-toploader"
import { extractRouterConfig } from "uploadthing/server"

import { ourFileRouter } from "../lib/uploadthing/core"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Trusted babysitters",
    "Family care services",
    "Childcare solutions",
    "Professional caregivers",
    "Reliable nanny services",
    "Experienced childminders",
    "In-home care providers",
    "Quality babysitting services",
    "Personalized caregiver matching",
    "Safe and secure childcare options",
  ],
  authors: [
    {
      name: "Bhaskar Khoraja",
      url: new URL(siteConfig.url),
    },
  ],
  creator: "Bhaskar Khoraja",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@bhaskarkhoraja",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader showSpinner={false} />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeSwitcher />
          <ThemeWrapper>
            <div vaul-drawer-wrapper="">
              <div className="bg-background relative flex min-h-screen flex-col">
                {children}
              </div>
            </div>
          </ThemeWrapper>
          <TailwindIndicator />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
