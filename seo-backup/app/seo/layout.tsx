import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";

// Generate default metadata for SEO pages
export const metadata: Metadata = generateMetadata({
  title: "SnapSeeker SEO Pages",
  description: "SEO-optimized pages for SnapSeeker product search and competitor analysis tool.",
  keywords: [
    ...seoConfig.coreKeywords.keywords.slice(0, 5),
    ...seoConfig.productKeywords.keywords.slice(0, 3),
  ],
  canonicalPath: "/seo",
});

/**
 * Layout component for SEO pages
 */
export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}