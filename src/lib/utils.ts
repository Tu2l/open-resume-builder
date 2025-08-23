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
  return 'http://localhost:9002'; 
}