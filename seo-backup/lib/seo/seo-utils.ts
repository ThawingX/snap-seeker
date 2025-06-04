import { Metadata } from "next";
import seoConfig from "./seo-config";

/**
 * Generate a SEO description with keywords
 * @param description Base description
 * @param keywords Additional keywords to include
 * @returns SEO optimized description
 */
export function generateSeoDescription(
  description: string,
  keywords: { zh: string; en: string }[] = []
): string {
  // If no keywords provided, return the original description
  if (keywords.length === 0) return description;

  // Extract English keywords and join them
  const keywordText = keywords.map((k) => k.en).join(", ");

  // Combine the description with keywords
  return `${description} Keywords: ${keywordText}`;
}

/**
 * Generate a SEO title with keywords
 * @param title Base title
 * @param keywords Additional keywords to include
 * @returns SEO optimized title
 */
export function generateSeoTitle(
  title: string,
  keywords: { zh: string; en: string }[] = []
): string {
  // If no keywords provided, return the original title
  if (keywords.length === 0) return title;

  // Extract English keywords and join them (limit to first 2)
  const keywordText = keywords
    .slice(0, 2)
    .map((k) => k.en)
    .join(" | ");

  // Combine the title with keywords
  return `${title} | ${keywordText}`;
}

/**
 * Generate Open Graph image URL
 * @param title Title for the OG image
 * @param description Description for the OG image
 * @returns URL for the Open Graph image
 */
export function generateOgImageUrl(
  title?: string,
  description?: string
): string {
  const baseUrl = `${seoConfig.siteUrl}/api/og`;
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (description) params.append("description", description);

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate structured data for a product
 * @returns Product structured data object
 */
export function generateProductStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SnapSeeker",
    description:
      "A product search and competitor analysis tool for product managers, independent developers, and entrepreneurs.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * Generate structured data for the website
 * @returns Website structured data object
 */
export function generateSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SnapSeeker",
    url: seoConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate metadata for Next.js pages
 * @param title Page title
 * @param description Page description
 * @param keywords Additional keywords to include
 * @param canonicalPath Path for canonical URL (relative to site URL)
 * @returns Next.js Metadata object
 */
export function generateMetadata({
  title = seoConfig.defaultTitle,
  description = seoConfig.defaultDescription,
  keywords = [],
  canonicalPath = "",
}: {
  title?: string;
  description?: string;
  keywords?: { zh: string; en: string }[];
  canonicalPath?: string;
}): Metadata {
  // Generate SEO-optimized title and description
  const seoTitle = generateSeoTitle(title, keywords);
  const seoDescription = generateSeoDescription(description, keywords);

  // Generate Open Graph image URL
  const ogImageUrl = generateOgImageUrl(title, description);

  // Combine all keywords
  const allKeywords = [
    ...keywords,
    ...seoConfig.coreKeywords.keywords.slice(0, 3),
    ...seoConfig.productKeywords.keywords.slice(0, 2),
  ];

  // Generate canonical URL
  const canonicalUrl = `${seoConfig.siteUrl}${canonicalPath}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: allKeywords.map((k) => [k.en, k.zh]).flat(),
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: "SnapSeeker",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "SnapSeeker",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}