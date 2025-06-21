'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackFirstVisit, trackRepeatVisit } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    // 检查是否为首次访问
    const isFirstVisit = !localStorage.getItem('snap_seeker_visited');
    
    if (isFirstVisit) {
      // 标记为已访问
      localStorage.setItem('snap_seeker_visited', 'true');
      localStorage.setItem('snap_seeker_first_visit_time', new Date().toISOString());
      
      // 触发首次访问埋点
      trackFirstVisit({
        page: pathname,
        referrer: document.referrer || 'direct',
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      });
    } else {
      // 触发重复访问埋点
      const firstVisitTime = localStorage.getItem('snap_seeker_first_visit_time');
      trackRepeatVisit({
        page: pathname,
        referrer: document.referrer || 'direct',
        first_visit_time: firstVisitTime || undefined,
        days_since_first_visit: firstVisitTime 
          ? Math.floor((Date.now() - new Date(firstVisitTime).getTime()) / (1000 * 60 * 60 * 24))
          : undefined
      });
    }

    // 触发页面浏览埋点
    trackPageView({
      page: pathname,
      title: document.title,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent
    });
  }, [pathname]);

  return <>{children}</>;
};