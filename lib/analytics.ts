// Google Tag Manager Event Tracking
export const trackEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  try {
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      
      // Push the event to dataLayer
      window.dataLayer.push({
        event: eventName,
        ...eventParams
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Common event names
export const ANALYTICS_EVENTS = {
  UPGRADE_CLICK: 'upgrade_click',
  CREATE_ACCOUNT_CLICK: 'create_account_click',
  GOOGLE_LOGIN: 'google_login',
} as const;

// Add TypeScript type for window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}