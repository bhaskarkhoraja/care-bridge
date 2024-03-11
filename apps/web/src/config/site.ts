import { webEnv } from "@web/src/lib/env.mjs"

export const siteConfig = {
  name: "Care Bridge",
  url: webEnv.WEB_URL,
  ogImage: `${webEnv.WEB_URL}/og.jpg`,
  description:
    "A place where hire trusted Baby Sitters for your children and Family Care services",
  links: {
    twitter: "https://twitter.com/bhaskarkhoraja",
    github: "https://github.com/bhaskarkhoraja/care-bridge",
  },
}

export type SiteConfig = typeof siteConfig
