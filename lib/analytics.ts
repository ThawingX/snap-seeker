// Google Tag Manager Event Tracking
export const trackEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  try {
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      
      // Push the event to dataLayer with timestamp
      window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...eventParams
      });
      
      // Development environment logging
      if (process.env.NODE_ENV === 'development') {
        console.log('GTM Event:', eventName, eventParams);
      }
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Common event names
export const ANALYTICS_EVENTS = {
  // Existing events
  UPGRADE_CLICK: 'upgrade_click',
  CREATE_ACCOUNT_CLICK: 'create_account_click',
  GOOGLE_LOGIN: 'google_login',
  
  // Auth events
  LOGIN_START: 'login_start',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT_START: 'logout_start',
  LOGOUT_SUCCESS: 'logout_success',
  LOGOUT_FAILED: 'logout_failed',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',
  
  // Search events
  SEARCH_START: 'search_start',
  SEARCH_SUBMIT: 'search_submit',
  SEARCH_FAILED: 'search_failed',
  SEARCH_UNAUTHENTICATED: 'search_unauthenticated',
  TAG_CLICK: 'tag_click',
  
  // History events
  HISTORY_CLEAR_START: 'history_clear_start',
  HISTORY_CLEAR_SUCCESS: 'history_clear_success',
  HISTORY_CLEAR_FAILED: 'history_clear_failed',
  
  // Print events
  PRINT_START: 'print_start',
  PRINT_SUCCESS: 'print_success',
  PRINT_FAILED: 'print_failed',
  
  // Theme events
  THEME_TOGGLE: 'theme_toggle',
  
  // Modal events
  MODAL_OPEN: 'modal_open',
  MODAL_CLOSE: 'modal_close',
  
  // Export events
  EXPORT_START: 'export_start',
  EXPORT_SUCCESS: 'export_success',
  EXPORT_FAILED: 'export_failed',
  
  // Page and user events
  PAGE_VIEW: 'page_view',
  AUTH_ACTIVATE: 'auth_activate',
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  FIRST_VISIT: 'first_visit',
  REPEAT_VISIT: 'repeat_visit',
  RETURN_VISIT: 'return_visit',
  PRICING_CLICK: 'pricing_click',
  COMPETITOR_PROMPT_ANALYSIS_TRYIT: 'competitor_prompt_analysis_tryit',
  PMF_ANALYSIS_TRYIT: 'pmf_analysis_tryit',
  MARKETING_CONTEXT_TRYIT: 'marketing_context_tryit',
} as const;

// TypeScript interfaces for event parameters
export interface BaseEventParams {
  action?: string;        // 操作类型: 'click', 'submit', 'view'
  page?: string;         // 页面标识: 'login', 'signup', 'dashboard'
  section?: string;      // 页面区域: 'header', 'sidebar', 'main'
  element_id?: string;   // 元素ID
  user_id?: string;      // 用户ID (已登录用户)
}

export interface PageViewParams extends BaseEventParams {
  page_title?: string;   // 页面标题
  page_url?: string;     // 页面URL
  referrer?: string;     // 来源页面
}

export interface AuthActivateParams extends BaseEventParams {
  activation_method?: string;  // 激活方式: 'email', 'sms'
  user_type?: string;         // 用户类型: 'new', 'existing'
}

export interface SignupParams extends BaseEventParams {
  signup_method?: string;     // 注册方式: 'email', 'google', 'github'
  user_type?: string;         // 用户类型
}

export interface VisitParams extends BaseEventParams {
  visit_count?: number;       // 访问次数
  session_id?: string;        // 会话ID
  time_since_last_visit?: number; // 距离上次访问时间(分钟)
  referrer?: string;          // 来源页面
  first_visit_time?: string;  // 首次访问时间
  days_since_first_visit?: number; // 距离首次访问天数
}

export interface TryItParams extends BaseEventParams {
  feature_name?: string;      // 功能名称
  button_position?: string;   // 按钮位置
  user_status?: string;       // 用户状态: 'logged_in', 'guest'
}

export interface SearchParams extends BaseEventParams {
  search_term?: string;       // 搜索关键词
  search_length?: number;     // 搜索词长度
  search_id?: string;         // 搜索ID
  user_authenticated?: boolean; // 用户是否已认证
}

export interface AuthParams extends BaseEventParams {
  method?: string;            // 认证方式: 'email', 'google'
  user_email?: string;        // 用户邮箱
  error_message?: string;     // 错误信息
  has_invitation_code?: boolean; // 是否有邀请码
}

// Convenience functions for specific events
export const trackPageView = (params?: PageViewParams) => {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    action: 'view',
    ...params
  });
};

export const trackAuthActivate = (params?: AuthActivateParams) => {
  trackEvent(ANALYTICS_EVENTS.AUTH_ACTIVATE, {
    action: 'activate',
    ...params
  });
};

export const trackSignupStart = (params?: SignupParams) => {
  trackEvent(ANALYTICS_EVENTS.SIGNUP_START, {
    action: 'start',
    ...params
  });
};

export const trackSignupComplete = (params?: SignupParams) => {
  trackEvent(ANALYTICS_EVENTS.SIGNUP_COMPLETE, {
    action: 'complete',
    ...params
  });
};

export const trackFirstVisit = (params?: VisitParams) => {
  trackEvent(ANALYTICS_EVENTS.FIRST_VISIT, {
    action: 'visit',
    visit_type: 'first',
    ...params
  });
};

export const trackRepeatVisit = (params?: VisitParams) => {
  trackEvent(ANALYTICS_EVENTS.REPEAT_VISIT, {
    action: 'visit',
    visit_type: 'repeat',
    ...params
  });
};

export const trackReturnVisit = (params?: VisitParams) => {
  trackEvent(ANALYTICS_EVENTS.RETURN_VISIT, {
    action: 'visit',
    visit_type: 'return',
    ...params
  });
};

export const trackPricingClick = (params?: BaseEventParams) => {
  trackEvent(ANALYTICS_EVENTS.PRICING_CLICK, {
    action: 'click',
    section: 'pricing',
    ...params
  });
};

export const trackCompetitorPromptAnalysisTryIt = (params?: TryItParams) => {
  trackEvent(ANALYTICS_EVENTS.COMPETITOR_PROMPT_ANALYSIS_TRYIT, {
    action: 'click',
    feature_name: 'competitor_prompt_analysis',
    ...params
  });
};

export const trackPMFAnalysisTryIt = (params?: TryItParams) => {
  trackEvent(ANALYTICS_EVENTS.PMF_ANALYSIS_TRYIT, {
    action: 'click',
    feature_name: 'pmf_analysis',
    ...params
  });
};

export const trackMarketingContextTryIt = (params?: TryItParams) => {
  trackEvent(ANALYTICS_EVENTS.MARKETING_CONTEXT_TRYIT, {
    action: 'click',
    feature_name: 'marketing_context',
    ...params
  });
};

// Add TypeScript type for window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}