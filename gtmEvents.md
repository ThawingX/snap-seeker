# GTM 自定义事件列表

## 已实现的事件

### 1. Google 登录 (google_login)
- **事件名称**: `google_login`
- **触发时机**: 用户点击 Google 登录/注册按钮
- **事件参数**:
  - `action`: 'click'
  - `method`: 'google'
  - `page`: 'login' 或 'signup'
- **实现位置**: 
  - `components/login-form.tsx`
  - `components/signup-form.tsx`

### 2. 升级点击 (upgrade_click)
- **事件名称**: `upgrade_click`
- **触发时机**: 用户点击升级按钮
- **事件参数**:
  - `content_type`: 内容类型
  - `content_id`: 内容ID
- **实现位置**: `components/premium/LockedContent.tsx`

### 3. 创建账户点击 (create_account_click)
- **事件名称**: `create_account_click`
- **触发时机**: 用户点击创建账户按钮
- **实现位置**: 待实现

## 待实现的事件

- [ ] 搜索提交事件
- [ ] 文件下载事件
- [ ] 页面浏览事件
- [ ] 用户注册完成事件
- [ ] 支付相关事件

## 配置说明

详细的 GTM 配置步骤请参考 `GTM_SETUP.md` 文件。