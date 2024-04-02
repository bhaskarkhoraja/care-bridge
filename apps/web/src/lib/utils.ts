import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { webEnv } from "./env"

/* cn function for organizing class */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * return absolute url
 **/
export function absoluteUrl(path: string) {
  return `${webEnv.NEXT_PUBLIC_WEB_URL}${path}`
}
