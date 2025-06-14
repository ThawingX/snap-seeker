# API 环境配置说明

本项目已实现统一的API环境管理系统，支持开发环境和生产环境的自动切换。

## 环境配置

### 开发环境
- **URL**: `http://35.209.49.134:8020`
- **触发条件**: `NODE_ENV === 'development'`
- **使用场景**: 本地开发时自动使用

### 生产环境
- **URL**: `https://api.snapsnap.site`
- **触发条件**: `NODE_ENV !== 'development'`
- **使用场景**: 部署后自动使用

## 文件结构

### 核心配置文件

1. **`lib/env.ts`** - 环境配置中心
   - 自动检测当前环境
   - 根据环境选择对应的API基础URL
   - 提供统一的环境变量访问

2. **`lib/api.ts`** - 统一API管理
   - 集中管理所有API端点
   - 提供通用的请求方法
   - 支持调试和环境信息查看

### 已更新的文件

- `lib/auth-api.ts` - 认证相关API
- `lib/google-auth.ts` - Google认证API
- `components/layout/Dashboard.tsx` - 热门标签API
- `components/seek-table.tsx` - 搜索和下载API
- `hooks/useSSEData.ts` - SSE数据流API

## 使用方法

### 1. 导入API端点

```typescript
import { API_ENDPOINTS } from '@/lib/api';

// 使用预定义的端点
const response = await fetch(API_ENDPOINTS.HOT_KEYS);
```

### 2. 使用API请求方法

```typescript
import { api } from '@/lib/api';

// GET 请求
const response = await api.get(API_ENDPOINTS.HOT_KEYS);

// POST 请求
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, userData);
```

### 3. 获取环境信息

```typescript
import { getApiInfo } from '@/lib/api';

const info = getApiInfo();
console.log('当前环境:', info.environment);
console.log('API基础URL:', info.baseUrl);
```

## API端点列表

### 认证相关
- `API_ENDPOINTS.AUTH.REGISTER` - 用户注册
- `API_ENDPOINTS.AUTH.LOGIN` - 用户登录
- `API_ENDPOINTS.AUTH.GOOGLE_LOGIN` - Google登录

### 聊天相关
- `API_ENDPOINTS.CHAT.BASE` - 聊天基础端点
- `API_ENDPOINTS.CHAT.DOWNLOAD(exportId)` - 下载聊天记录

### 其他
- `API_ENDPOINTS.HOT_KEYS` - 热门关键词

## 环境切换验证

### 开发环境验证
1. 确保 `NODE_ENV=development`
2. 启动开发服务器: `npm run dev`
3. 检查网络请求是否指向 `35.209.49.134:8020`

### 生产环境验证
1. 构建项目: `npm run build`
2. 启动生产服务器: `npm start`
3. 检查网络请求是否指向 `api.snapsnap.site`

## 调试技巧

### 查看当前环境配置
```typescript
import { ENV } from '@/lib/env';

console.log('开发环境:', ENV.IS_DEVELOPMENT);
console.log('API基础URL:', ENV.API_BASE_URL);
console.log('聊天API URL:', ENV.TARGET_CHAT_API_URL);
```

### 网络请求调试
- 打开浏览器开发者工具
- 查看 Network 标签页
- 验证请求URL是否正确指向对应环境

## 注意事项

1. **FormData请求**: 对于使用FormData的请求（如密码登录），需要直接使用fetch而不是api.post方法
2. **环境变量**: 确保在部署时正确设置 `NODE_ENV` 环境变量
3. **CORS配置**: 确保开发环境API服务器正确配置了CORS策略
4. **网络访问**: 确保开发环境API服务器 `35.209.49.134:8020` 可以正常访问

## 故障排除

### 常见问题

1. **API请求失败**
   - 检查网络连接
   - 验证API服务器状态
   - 确认环境配置是否正确

2. **环境切换不生效**
   - 检查 `NODE_ENV` 环境变量
   - 重启开发服务器
   - 清除浏览器缓存

3. **CORS错误**
   - 确认API服务器CORS配置
   - 检查请求头设置
   - 验证请求方法是否被允许