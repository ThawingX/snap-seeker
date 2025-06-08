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
      // If parsing fails, try multiple normalization strategies
      try {
        let normalizedJson = jsonPart;
        
        // Strategy 1: Convert single quotes to double quotes
        normalizedJson = normalizedJson.replace(/'/g, '"');
        
        // Strategy 2: Fix common JSON formatting issues
        // Handle unquoted property names
        normalizedJson = normalizedJson.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
        
        // Strategy 3: Handle trailing commas
        normalizedJson = normalizedJson.replace(/,\s*([}\]])/g, '$1');
        
        // Strategy 4: Ensure proper array/object structure
        normalizedJson = normalizedJson.replace(/([^\s,{\[])\s*([{\[])/g, '$1,$2');
        
        // Verify the converted JSON is valid
        JSON.parse(normalizedJson);
        return `data: ${normalizedJson}`;
      } catch (jsonErr) {
        // If still can't parse, try a more aggressive approach
        try {
          // Remove any problematic characters and try to reconstruct
          let cleanJson = jsonPart
            .replace(/'/g, '"')
            .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
            .replace(/,\s*([}\]])/g, '$1')
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ');
          
          JSON.parse(cleanJson);
          return `data: ${cleanJson}`;
        } catch (finalErr) {
          // If all strategies fail, log detailed error and return original
          console.error("JSON normalization failed:", finalErr, "Original data:", jsonPart.substring(0, 200) + '...');
          return line;
        }
      }
    }
  }
  return line; // Non-data lines return as is
}
