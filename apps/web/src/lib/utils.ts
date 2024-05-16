import { clsx, type ClassValue } from "clsx"
import { FormatDistanceFnOptions, FormatDistanceToken } from "date-fns"
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

/**
 * used by nest adapter and middleware to format response
 **/
export function format<T>(obj: Record<string, unknown>): T {
  return Object.entries(obj).reduce(
    (result, [key, value]) => {
      const newResult = result

      if (value === null) {
        return newResult
      }

      if (isDate(value)) {
        newResult[key] = new Date(value)
      } else {
        newResult[key] = value
      }

      return newResult
    },
    {} as Record<string, unknown>
  ) as T
}

/**
 * check if date is valid
 **/
const isDate = (value: unknown): value is string =>
  typeof value === "string"
    ? new Date(value).toString() !== "Invalid Date" &&
      !Number.isNaN(Date.parse(value))
    : false

export const cookieName =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token"

/**
 * Get user initials, Bhaskar Khoraja -> BK
 **/
export function getShortName(name: string): string {
  let names = name.split(" ")
  let shortName = ""

  if (names.length === 1) {
    shortName = names[0].charAt(0).toUpperCase()
  } else {
    shortName =
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
  }

  return shortName
}

/**
 * Format distance option for time
 **/
const formatDistanceLocale = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
}

/**
 * Format distance function
 **/
export function formatDistance(
  token: FormatDistanceToken,
  count: number,
  options?: FormatDistanceFnOptions
) {
  options = options || {}

  const result = formatDistanceLocale[token].replace(
    "{{count}}",
    count.toString()
  )

  if (options.addSuffix) {
    if (options && options.comparison && options.comparison > 0) {
      return "in " + result
    } else {
      return result + " ago"
    }
  }

  return result
}
