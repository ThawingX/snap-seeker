# GTM 埋点最佳实践指南

本文档提供了在 React/Next.js 应用中实现 Google Tag Manager 埋点的最佳实践方案。

## 架构设计

### 1. 统一的事件跟踪系统

我们采用了集中式的事件跟踪架构：

```
lib/analytics.ts (核心跟踪模块)
├── trackEvent() - 统一的事件发送函数
├── ANALYTICS_EVENTS - 事件名称常量
└── TypeScript 类型定义
```

**优势**:
- 统一管理所有事件名称，避免拼写错误
- 类型安全，IDE 自动补全
- 易于维护和扩展
- 便于代码审查

### 2. 事件命名规范

**格式**: `{action}_{object}` (小写字母 + 下划线)

**示例**:
- `google_login` - Google 登录
- `upgrade_click` - 升级点击
- `search_submit` - 搜索提交
- `file_download` - 文件下载

**原则**:
- 使用动词 + 名词的组合
- 保持简洁明了
- 避免使用特殊字符
- 与 GA4 事件命名保持一致

### 3. 事件参数标准化

**通用参数**:
```typescript
interface BaseEventParams {
  action: string;        // 操作类型: 'click', 'submit', 'view'
  page?: string;         // 页面标识: 'login', 'signup', 'dashboard'
  section?: string;      // 页面区域: 'header', 'sidebar', 'main'
  element_id?: string;   // 元素ID
  user_id?: string;      // 用户ID (已登录用户)
}
```

**特定事件参数**:
```typescript
// Google 登录事件
interface GoogleLoginParams extends BaseEventParams {
  method: 'google';      // 登录方式
  page: 'login' | 'signup';
}

// 搜索事件
interface SearchParams extends BaseEventParams {
  search_term: string;   // 搜索关键词
  results_count: number; // 结果数量
}
```

## 实现最佳实践

### 1. 组件级别的事件跟踪

**推荐做法**:
```typescript
// ✅ 好的实践
const handleGoogleLogin = async () => {
  // 在操作开始时立即触发事件
  trackEvent(ANALYTICS_EVENTS.GOOGLE_LOGIN, {
    action: 'click',
    method: 'google',
    page: 'login'
  });
  
  try {
    // 执行实际的登录逻辑
    await performLogin();
    
    // 可选：触发成功事件
    trackEvent(ANALYTICS_EVENTS.LOGIN_SUCCESS, {
      method: 'google',
      page: 'login'
    });
  } catch (error) {
    // 可选：触发失败事件
    trackEvent(ANALYTICS_EVENTS.LOGIN_ERROR, {
      method: 'google',
      error_type: error.type,
      page: 'login'
    });
  }
};
```

**避免的做法**:
```typescript
// ❌ 不好的实践
const handleClick = () => {
  // 直接使用 window.dataLayer，缺乏类型安全
  window.dataLayer.push({
    event: 'googleLogin', // 命名不一致
    // 缺少标准化参数
  });
};
```

### 2. 错误处理

```typescript
export const trackEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
  try {
    if (typeof window !== 'undefined') {
      // 确保 dataLayer 存在
      window.dataLayer = window.dataLayer || [];
      
      // 推送事件
      window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(), // 添加时间戳
        ...eventParams
      });
      
      // 开发环境下的调试信息
      if (process.env.NODE_ENV === 'development') {
        console.log('GTM Event:', eventName, eventParams);
      }
    }
  } catch (error) {
    // 静默处理错误，不影响用户体验
    console.error('Error tracking event:', error);
  }
};
```

### 3. 条件性事件跟踪

```typescript
// 只在生产环境或特定条件下跟踪
const shouldTrack = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
};

export const trackEvent = (eventName: string, eventParams?: any) => {
  if (!shouldTrack()) return;
  
  // 执行跟踪逻辑
};
```

### 4. 用户隐私保护

```typescript
// 检查用户同意状态
const hasUserConsent = () => {
  // 检查 cookie 同意状态
  return localStorage.getItem('analytics_consent') === 'true';
};

export const trackEvent = (eventName: string, eventParams?: any) => {
  if (!hasUserConsent()) {
    console.log('Analytics tracking skipped - no user consent');
    return;
  }
  
  // 执行跟踪逻辑
};
```

## 测试策略

### 1. 开发环境测试

```typescript
// 开发环境下的模拟 GTM
if (process.env.NODE_ENV === 'development') {
  window.dataLayer = window.dataLayer || [];
  
  // 监听所有 dataLayer 推送
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    console.group('🏷️ GTM Event');
    console.log('Event Data:', args[0]);
    console.groupEnd();
    return originalPush.apply(this, args);
  };
}
```

### 2. 单元测试

```typescript
// __tests__/analytics.test.ts
import { trackEvent, ANALYTICS_EVENTS } from '../lib/analytics';

// Mock window.dataLayer
Object.defineProperty(window, 'dataLayer', {
  value: [],
  writable: true
});

describe('Analytics', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('should track Google login event', () => {
    trackEvent(ANALYTICS_EVENTS.GOOGLE_LOGIN, {
      action: 'click',
      method: 'google',
      page: 'login'
    });

    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: 'google_login',
      action: 'click',
      method: 'google',
      page: 'login'
    });
  });
});
```

## 性能优化

### 1. 延迟加载

```typescript
// 延迟加载 analytics 模块
const trackEventLazy = async (eventName: string, eventParams?: any) => {
  const { trackEvent } = await import('../lib/analytics');
  trackEvent(eventName, eventParams);
};
```

### 2. 事件去重

```typescript
let lastEvent: { name: string; timestamp: number } | null = null;

export const trackEvent = (eventName: string, eventParams?: any) => {
  const now = Date.now();
  
  // 防止重复事件（500ms 内）
  if (lastEvent && 
      lastEvent.name === eventName && 
      now - lastEvent.timestamp < 500) {
    return;
  }
  
  lastEvent = { name: eventName, timestamp: now };
  
  // 执行跟踪逻辑
};
```

## 监控和调试

### 1. GTM 预览模式

在开发过程中，始终使用 GTM 的预览模式来验证事件是否正确触发。

### 2. 浏览器开发者工具

```javascript
// 在浏览器控制台中监控 dataLayer
console.log('Current dataLayer:', window.dataLayer);

// 监听新的 dataLayer 推送
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('New dataLayer push:', args[0]);
  return originalPush.apply(this, args);
};
```

### 3. 生产环境监控

考虑使用 Google Analytics 4 的调试视图或第三方工具来监控生产环境中的事件触发情况。

## 文档维护

1. **事件清单**: 维护 `gtmEvents.md` 文件，记录所有已实现的事件
2. **配置文档**: 保持 `GTM_SETUP.md` 文件的更新
3. **变更日志**: 记录事件的添加、修改和删除
4. **团队培训**: 确保团队成员了解埋点规范和最佳实践

## 总结

通过遵循这些最佳实践，你可以构建一个：
- **可维护的** 埋点系统
- **类型安全的** 事件跟踪
- **性能优化的** 实现方案
- **用户隐私友好的** 数据收集
- **易于测试和调试的** 代码结构

记住，好的埋点系统不仅要能收集数据，还要确保数据的准确性、一致性和可用性。