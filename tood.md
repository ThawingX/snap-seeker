Sat Apr 12 2025:
- [x] 静态history
- [x] 静态搜索
- [x] 静态竟品表格
- [x] login&signup
- [x] 加固代码：抽离组件，删除无用组件，添加中文注释
- [x] 新增vercel部署脚本
- [x] 修复登录页面useSearchParams的Suspense问题

Sun Apr 13 2025:
- [x] vercel脚本修复，需要添加路由，否则next不会认为是客户端的路由组件
- [x] 移动端适配
- [x] 修复移动端直接通过url访问history页面的问题
- [x] 移除移动端历史页面的返回按钮，避免与底部导航重复

Wed May 13 2025:
- [x] 严格模式关闭和周遭修复
- [x] vercel超时10s，修复，配置fluid compute
- [x] sse中断标识 {setp:done}
- [x] 接入google analytics / vercel  analysis
- [x] 区分开发环境和生产环境的接口调用，并且解决跨域