import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(): string {
// Determine the base URL dynamically based on the current location
if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin;
    if (baseUrl.endsWith('tu2l.com')) { // HACK to handle TLD; TODO update 
        return baseUrl + '/open-resume-builder/';
    }
    return baseUrl;
}
  return ''; 
}

/**
 * Retrieves application information from environment variables or defaults.
 * @returns Application information from environment variables or defaults
 */
export function getAppInfo() {
    return {
        name: process.env.APP_NAME || 'Open Resume Builder',
        version: process.env.APP_VERSION || '09.2025.3', // always update before release
        versionName: process.env.APP_VERSION_NAME || 'Beta',
    };
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
