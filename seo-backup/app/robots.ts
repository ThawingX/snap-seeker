import { MetadataRoute } from "next";
import seoConfig from "@/lib/seo/seo-config";

/**
 * Generate robots.txt configuration
 * @returns Robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}