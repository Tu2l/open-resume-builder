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
  return ''; 
}

/**
 * Extracts a JSON object from a string, which may contain markdown code fences.
 */
export const extractJsonFromResponse = (text: string): any => {
    try {
        const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonBlockRegex);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
    } catch (e) {
        console.error("Failed to parse JSON from code block:", e);
    }

    try {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            return JSON.parse(text.substring(firstBrace, lastBrace + 1));
        }
    } catch (e) {
        console.error("Failed to parse JSON from substring:", e);
    }

    throw new Error("Could not find or parse a valid JSON object in the AI's response.");
};
