# Google Tag Manager 设置指南

本文档说明如何在 Google Tag Manager (GTM) 中配置自定义事件，以跟踪应用中的用户行为。

## 当前已实现的事件

### 1. Google 登录事件 (google_login)

**事件名称**: `google_login`

**触发时机**: 用户点击 Google 登录/注册按钮时

**事件参数**:
- `action`: 'click'
- `method`: 'google'
- `page`: 'login' 或 'signup'

**代码位置**:
- 登录页面: `components/login-form.tsx`
- 注册页面: `components/signup-form.tsx`

## GTM 配置步骤

### 步骤 1: 创建触发器 (Trigger)

1. 在 GTM 工作区中，点击「触发器」→「新建」
2. 选择触发器类型：「自定义事件」
3. 配置触发器：
   - **事件名称**: `google_login`
   - **触发条件**: 选择「部分自定义事件」
   - **条件**: `Event` 等于 `google_login`
4. 保存触发器，命名为「Google Login Click」

### 步骤 2: 创建变量 (Variables)

为了更好地跟踪事件参数，建议创建以下自定义变量：

1. **Action 变量**:
   - 变量类型：「数据层变量」
   - 数据层变量名称：`action`
   - 变量名称：`DLV - Action`

2. **Method 变量**:
   - 变量类型：「数据层变量」
   - 数据层变量名称：`method`
   - 变量名称：`DLV - Method`

3. **Page 变量**:
   - 变量类型：「数据层变量」
   - 数据层变量名称：`page`
   - 变量名称：`DLV - Page`

### 步骤 3: 创建标签 (Tags)

#### Google Analytics 4 标签

1. 创建新标签，选择「Google Analytics: GA4 事件」
2. 配置标签：
   - **配置标签**: 选择你的 GA4 配置标签
   - **事件名称**: `google_login`
   - **事件参数**:
     - `login_method`: `{{DLV - Method}}`
     - `page_location`: `{{DLV - Page}}`
     - `action_type`: `{{DLV - Action}}`
3. **触发条件**: 选择之前创建的「Google Login Click」触发器
4. 保存标签，命名为「GA4 - Google Login Event」

#### Facebook Pixel 标签 (可选)

1. 创建新标签，选择「自定义 HTML」
2. HTML 代码：
```html
<script>
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', {
      content_category: 'authentication',
      content_name: 'google_login',
      value: 1,
      currency: 'USD'
    });
  }
</script>
```
3. **触发条件**: 选择「Google Login Click」触发器
4. 保存标签，命名为「FB - Google Login Event」

### 步骤 4: 测试配置

1. 在 GTM 中点击「预览」
2. 访问你的网站登录页面
3. 点击 Google 登录按钮
4. 在 GTM 预览模式中验证：
   - 事件 `google_login` 被触发
   - 相关变量值正确传递
   - 标签正常执行

### 步骤 5: 发布更改

测试无误后，在 GTM 中点击「提交」发布更改。

## 数据层结构

当用户点击 Google 登录按钮时，以下数据会被推送到 dataLayer：

```javascript
window.dataLayer.push({
  event: 'google_login',
  action: 'click',
  method: 'google',
  page: 'login' // 或 'signup'
});
```

## 扩展事件

如需添加更多自定义事件，请参考以下步骤：

1. 在 `lib/analytics.ts` 中添加新的事件名称到 `ANALYTICS_EVENTS` 对象
2. 在相应的组件中调用 `trackEvent()` 函数
3. 在 GTM 中创建对应的触发器和标签

## 注意事项

- 确保 GTM 容器代码已正确安装在网站的 `<head>` 和 `<body>` 标签中
- 事件名称应使用小写字母和下划线，避免使用特殊字符
- 定期检查 GTM 预览模式，确保事件正常触发
- 建议在生产环境发布前，先在测试环境验证所有配置