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

Mon May 19 2025:
- [x]logo优化
- [x]slogan优化
- [x] MVP和PMF

Sat May 24 2025:
- [x] 弹幕+trendings 

Wed June 4 2025:
- [x] 删除无用代码
- [x] 调整项目结构，抽离可配置
- [x] seo删除，备份原来的seo代码，准备重新处理seo文件，原来的过于冗余并且不精准
- [x] id从后端获取
- [x] 优化step
- [x] 其中某个step的内容解析失败不应该导致所有请求停止
- [x] 图表
- [x] 登录页面样式重叠
- [x] 加载热门标签得弹窗放到一个角落
- [x] seek-table加载时，和成果样式不一致
  
  
Thu June 5 2025:
- [x] 历史卡片点击时，每次都会重新获取数据，需要适配一下原来的id匹配机制 
  - 并不是每次都会重新获取数据，而是上一次如果没有完整成功（没有收到done），那就不会存储原来的数据，导致进入是一个新的内容
- [x] 历史数据存储，并不是done才会存，失败了也要存
- [x] 结果页面直接跳转history，导致seek-table卸载时清理了持久化数据
- [x] 图表点击放大
- [x] figure1 figure2 改名
- [x] 需求卡片
- [x] 功能清单 markdown
- [x] 导出
- [x] trae.rules

Mon June 9 2025:
- [x] google tag manager
- [x] login 功能
- [x] 隐私政策
- [x] google login
  
Sat June 14 2025：
- [x] 历史列表
- [x] 历史详情
- [x] credits
- [x] 登录修复
- [x] 新增浅色模式
- [x] 整体样式修改
- [x] 删除firstname lastname
- [x] 删除忘记密码操作
- [x] landing
- [x] logo整改
- [x] dev环境区分，统一管理接口
- [x] 注册表单中login  signup区分不明显
- [x] logout
- [x] 隐藏clear history
- [x] 点击搜索后，如果没有登录需要跳转登录页面，登录完成后需要保证源数据可以使用
- [x] 每个模块新增导print按钮
- [x] 登录表单 remember me 按钮
- [x] RRO功能添加tooltip，说明需要购买高级扩展
- [x] 添加跳转landing定价的页面
- [x] 添加竞品Prompt拆解菜单栏预埋
- [x] 添加PMF分析功能预埋
- [x] 添加产品营销定制上下文功能预埋
- [x] 搜索按钮可点击效果更明显
- [x] Credits刷新按钮

2025/06/16：
- [x] google 登录
- [x] google登录账号未激活，需要激活账号
- [x] 结果界面刷新，没有发请求
- [x] 功能列表会被覆盖
- [x] 新搜索不能把query放到url

2025/06/17：
-[x] google登录一些错误消息不能显示

2025/06/21：
- [x] 埋点
- [x] 移动端检查
- [x] searchBar 点击不了
- [] ph upvote
- [x] clear history相关删除 

2025/06/22：
-[] prd id
-[] print 按钮颜色
-[] google 登录