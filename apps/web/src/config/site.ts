import { webEnv } from "@web/src/lib/env.mjs"

export const siteConfig = {
  name: "Care Bridge",
  url: webEnv.NEXT_PUBLIC_WEB_URL,
  ogImage: `${webEnv.NEXT_PUBLIC_WEB_URL}/og.jpg`,
  description:
    "A place where hire trusted Baby Sitters for your children and Family Care services",
  links: {
    twitter: "https://twitter.com/bhaskarkhoraja",
    github: "https://github.com/bhaskarkhoraja/care-bridge",
  },
} as const

export type SiteConfig = typeof siteConfig
