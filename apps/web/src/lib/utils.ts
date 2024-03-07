import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/* cn function for organizing class */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
