import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";

// Generate metadata for the home page
export const metadata: Metadata = generateMetadata({
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  keywords: [
    ...seoConfig.coreKeywords.keywords.slice(0, 5),
    ...seoConfig.productKeywords.keywords.slice(0, 3),
    ...seoConfig.targetUserKeywords.keywords.slice(0, 3),
  ],
  canonicalPath: "/",
});