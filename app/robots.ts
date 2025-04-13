import { MetadataRoute } from 'next';
import seoConfig from '@/lib/seo/seo-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about/',
          '/features/',
          '/competitor-analysis/',
          '/product-validation/'
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/*.json$',
          '/*.xml$'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 2,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
      }
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
} 