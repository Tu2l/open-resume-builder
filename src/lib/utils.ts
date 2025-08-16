import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
  // Determine the base URL dynamically based on the current location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side rendering or non-browser environments
  return 'http://localhost:9002'; // Adjust as necessary for your environment
}