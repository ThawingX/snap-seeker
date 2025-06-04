# SEO 备份目录

此目录包含了SnapSeeker项目中与SEO相关的所有文件的备份。这些文件已从主项目代码中抽离出来，以保持主项目代码的清爽。

## 目录结构

```
seo-backup/
├── app/                  # 应用页面相关SEO内容
│   ├── metadata.ts       # 全局元数据
│   ├── robots.ts         # 机器人爬虫设置
│   ├── sitemap.ts        # 站点地图
│   └── seo/              # SEO专用页面
│       ├── about/
│       ├── competitor-analysis/
│       ├── features/
│       ├── product-validation/
│       └── layout.tsx
├── components/           # SEO相关组件
│   ├── CanonicalLink.tsx
│   ├── SeoFooter.tsx
│   ├── SeoNavigation.tsx
│   └── StructuredData.tsx
├── lib/                  # SEO工具和配置
│   ├── seo-config.ts     # SEO配置
│   └── seo-utils.ts      # SEO工具函数
└── README.md             # 说明文档
```

## 使用说明

这些文件仅作为备份和参考，不应直接在主项目中使用。如需恢复SEO功能，请参考这些文件进行集成。