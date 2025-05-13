import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on the client-side
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkMobile();
      
      // Add event listener for resize
      window.addEventListener('resize', checkMobile);
      
      // Clean up
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  
  return isMobile;
}

/**
 * Checks if the current environment is development
 * @returns {boolean} True if in development environment, false otherwise
 */
export function isDevelopmentEnvironment(): boolean {
  // For client-side
  if (typeof window !== 'undefined') {
    // Check if a development flag exists in localStorage or any other client-side indicator
    // For example, you could set this flag during build time
    return process.env.NODE_ENV === 'development';
  }
  
  // For server-side
  return process.env.NODE_ENV === 'development';
}

/**
 * Normalizes SSE data from different sources to ensure consistent formatting
 * @param {string} line - A line of SSE data
 * @returns {string} - Normalized SSE data line
 */
export function normalizeSSEData(line: string): string {
  if (line.trim() === '') return line;
  
  if (line.startsWith('data:')) {
    // Extract JSON part
    const jsonPart = line.substring(5).trim();
    try {
      // Try direct parse
      JSON.parse(jsonPart);
      return line; // If valid JSON, return as is
    } catch (e) {
      // If parsing fails, try converting single quotes to double quotes
      try {
        const standardJson = jsonPart.replace(/'/g, '"');
        // Verify the converted JSON is valid
        JSON.parse(standardJson);
        return `data: ${standardJson}`;
      } catch (jsonErr) {
        // If still can't parse, return original
        console.error("JSON normalization failed:", jsonErr);
        return line;
      }
    }
  }
  return line; // Non-data lines return as is
}
