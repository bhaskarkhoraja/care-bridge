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
