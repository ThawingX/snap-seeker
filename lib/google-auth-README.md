# Google Authentication 集成指南

本文档介绍如何在项目中使用Google认证功能，包括获取Google ID Token并通过服务端API进行认证。

## 功能特性

- ✅ Google Identity Services集成
- ✅ 自动获取Google ID Token
- ✅ 服务端API认证
- ✅ 支持邀请码机制
- ✅ React组件封装
- ✅ TypeScript类型支持
- ✅ 错误处理和加载状态
- ✅ 自定义事件系统

## 环境配置

### 1. 设置Google Client ID

在 `.env.local` 文件中添加：

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Google Cloud Console配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建或选择项目
3. 启用 Google Identity Services API
4. 创建OAuth 2.0客户端ID
5. 添加授权的JavaScript源和重定向URI

## API接口

### 核心函数

#### `initializeGoogleAuth(): Promise<void>`

初始化Google认证服务。必须在使用其他功能前调用。

```typescript
import { initializeGoogleAuth } from './lib/google-auth';

try {
  await initializeGoogleAuth();
  console.log('Google Auth initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google Auth:', error);
}
```

#### `signInWithGoogle(invitationCode?: string | null): Promise<LoginResponse>`

触发Google登录弹窗并完成服务端认证。

```typescript
import { signInWithGoogle } from './lib/google-auth';

try {
  const result = await signInWithGoogle('INVITE123'); // 可选邀请码
  console.log('Login successful:', result);
  // result.token - 服务端返回的认证token
  // result.user - 用户信息
  // result.message - 可选的消息
} catch (error) {
  console.error('Login failed:', error);
}
```

#### `authenticateWithServer(googleIdToken: string, invitationCode?: string | null): Promise<LoginResponse>`

直接调用服务端API进行认证。

```typescript
import { authenticateWithServer } from './lib/google-auth';

try {
  const result = await authenticateWithServer(googleIdToken, 'INVITE123');
  console.log('Authentication successful:', result);
} catch (error) {
  console.error('Authentication failed:', error);
}
```

#### `renderGoogleSignInButton(element: HTMLElement, invitationCode?: string | null, options?: ButtonOptions): void`

在指定元素中渲染Google登录按钮。

```typescript
import { renderGoogleSignInButton } from './lib/google-auth';

const buttonElement = document.getElementById('google-signin-button');
renderGoogleSignInButton(buttonElement, null, {
  theme: 'outline',
  size: 'large',
  type: 'standard',
  text: 'signin_with'
});
```

#### `isGoogleAuthAvailable(): boolean`

检查Google认证是否可用。

```typescript
import { isGoogleAuthAvailable } from './lib/google-auth';

if (isGoogleAuthAvailable()) {
  // 可以使用Google认证功能
} else {
  // Google认证不可用
}
```

### 类型定义

```typescript
export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface LoginRequest {
  google_id_token: string;
  invitation_code: string | null;
}

export interface LoginResponse {
  token: string;
  user: GoogleUser;
  message?: string;
}

export interface GoogleAuthResponse {
  credential: string;
  user: GoogleUser;
}
```

## React组件使用

### 基础使用

```tsx
import React from 'react';
import { GoogleAuthExample } from './lib/google-auth-example';

function LoginPage() {
  const handleLoginSuccess = (result) => {
    console.log('Login successful:', result);
    // 保存token和用户信息
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    // 重定向到主页面
    window.location.href = '/dashboard';
  };

  const handleLoginError = (error) => {
    console.error('Login failed:', error);
    alert(`登录失败: ${error}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录到您的账户
          </h2>
        </div>
        <GoogleAuthExample
          invitationCode={null}
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      </div>
    </div>
  );
}

export default LoginPage;
```

### 带邀请码的使用

```tsx
import React, { useState } from 'react';
import { GoogleAuthExample } from './lib/google-auth-example';

function SignUpPage() {
  const [invitationCode, setInvitationCode] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            注册新账户
          </h2>
        </div>
        
        {/* 邀请码输入 */}
        <div>
          <label htmlFor="invitation-code" className="block text-sm font-medium text-gray-700">
            邀请码
          </label>
          <input
            id="invitation-code"
            type="text"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入邀请码"
          />
        </div>
        
        <GoogleAuthExample
          invitationCode={invitationCode || null}
          onLoginSuccess={(result) => {
            console.log('Registration successful:', result);
            // 处理注册成功
          }}
          onLoginError={(error) => {
            console.error('Registration failed:', error);
            // 处理注册失败
          }}
        />
      </div>
    </div>
  );
}

export default SignUpPage;
```

## 自定义事件

组件会触发以下自定义事件：

### `googleSignInSuccess`

登录成功时触发。

```typescript
window.addEventListener('googleSignInSuccess', (event: CustomEvent) => {
  const { token, user, message } = event.detail;
  console.log('Login successful:', { token, user, message });
});
```

### `googleSignInError`

登录失败时触发。

```typescript
window.addEventListener('googleSignInError', (event: CustomEvent) => {
  const { error } = event.detail;
  console.error('Login failed:', error);
});
```

## 服务端API规范

### 登录接口

**端点**: `POST /auth/login/google`

**请求体**:
```json
{
  "google_id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "invitation_code": "INVITE123" // 可选，新用户需要，老用户传null
}
```

**成功响应** (200):
```json
{
  "token": "your_jwt_token_here",
  "user": {
    "id": "google_user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "message": "Login successful"
}
```

**错误响应** (400/401/500):
```json
{
  "error": "Invalid invitation code",
  "message": "The provided invitation code is invalid or expired"
}
```

## 错误处理

### 常见错误类型

1. **初始化失败**
   - Google Client ID未配置
   - Google Identity Services加载失败

2. **登录失败**
   - 用户取消登录
   - 网络连接问题
   - 服务端认证失败

3. **API错误**
   - 无效的邀请码
   - 服务端内部错误
   - 认证token无效

### 错误处理示例

```typescript
try {
  const result = await signInWithGoogle(invitationCode);
  // 处理成功
} catch (error) {
  if (error.message.includes('invitation code')) {
    // 邀请码相关错误
    alert('邀请码无效或已过期');
  } else if (error.message.includes('Network')) {
    // 网络错误
    alert('网络连接失败，请检查网络设置');
  } else {
    // 其他错误
    alert(`登录失败: ${error.message}`);
  }
}
```

## 安全注意事项

1. **Client ID保护**: 虽然Client ID是公开的，但应该限制授权域名
2. **Token验证**: 服务端必须验证Google ID Token的有效性
3. **HTTPS**: 生产环境必须使用HTTPS
4. **CSP策略**: 配置适当的内容安全策略
5. **Token存储**: 避免在localStorage中长期存储敏感token

## 调试和测试

### 开发环境调试

```typescript
// 启用调试模式
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('googleSignInSuccess', (event) => {
    console.log('Debug - Login Success:', event.detail);
  });
  
  window.addEventListener('googleSignInError', (event) => {
    console.log('Debug - Login Error:', event.detail);
  });
}
```

### 测试用例

```typescript
// 测试初始化
test('Google Auth initialization', async () => {
  await expect(initializeGoogleAuth()).resolves.not.toThrow();
});

// 测试可用性检查
test('Google Auth availability', () => {
  expect(typeof isGoogleAuthAvailable).toBe('function');
});
```

## 常见问题

### Q: 为什么Google登录按钮不显示？
A: 检查以下几点：
1. Google Client ID是否正确配置
2. 是否调用了`initializeGoogleAuth()`
3. 域名是否在Google Console中授权
4. 网络是否能访问Google服务

### Q: 如何处理用户取消登录？
A: 用户取消登录时，Promise会被reject，可以在catch块中处理。

### Q: 如何自定义按钮样式？
A: 使用`renderGoogleSignInButton`的options参数，或者监听自定义事件实现完全自定义的UI。

### Q: 如何在服务端验证Google ID Token？
A: 使用Google的验证库或API验证token的签名和有效性。

## 更新日志

### v1.0.0
- 初始版本发布
- 支持Google Identity Services
- 集成服务端API认证
- 支持邀请码机制
- 提供React组件封装