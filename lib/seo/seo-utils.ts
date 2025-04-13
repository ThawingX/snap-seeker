import { Metadata } from 'next';
import seoConfig, { SeoKeywordCategory } from './seo-config';

/**
 * Generates a description with the given keywords mixed in naturally
 */
export function generateSeoDescription(
  baseDescription: string = seoConfig.defaultDescription,
  keywordCategories: SeoKeywordCategory[] = []
): string {
  let description = baseDescription;
  
  // Don't make the description too long if there are many keywords
  return description;
}

/**
 * Helper to get keywords as string from category
 */
export function getKeywordsAsString(categories: SeoKeywordCategory[], language: 'zh' | 'en' = 'en'): string {
  return categories
    .flatMap(category => category.keywords.map(kw => kw[language]))
    .join(', ');
}

/**
 * Generates a title with the given keywords
 */
export function generateSeoTitle(
  baseTitle: string = seoConfig.defaultTitle,
  additionalKeywords: string[] = []
): string {
  if (additionalKeywords.length === 0) {
    return baseTitle;
  }
  
  // Don't make the title too long
  const keywordString = additionalKeywords.slice(0, 2).join(', ');
  return `${baseTitle} | ${keywordString}`;
}

/**
 * Generate OG image URL using our dynamic OG image API
 */
export function generateOgImage(title: string, description: string): string {
  const params = new URLSearchParams({
    title: title.substring(0, 100), // Limit length for OG image
    description: description.substring(0, 200), // Limit length for OG image
  });
  
  return `${seoConfig.siteUrl}/api/og?${params.toString()}`;
}

/**
 * Creates Next.js metadata for a page
 */
export function generateMetadata(
  pageTitle?: string,
  pageDescription?: string,
  keywordCategories?: SeoKeywordCategory[],
  path: string = '',
  images?: string[],
  locale: 'zh' | 'en' = 'en'
): Metadata {
  const title = pageTitle || seoConfig.defaultTitle;
  const description = pageDescription || seoConfig.defaultDescription;
  
  // Combine relevant keywords for this page
  const allCategories = keywordCategories || [
    seoConfig.coreKeywords,
    seoConfig.productKeywords
  ];
  
  const keywords = getKeywordsAsString(allCategories, locale);
  const canonicalUrl = `${seoConfig.siteUrl}${path}`;
  
  // Generate dynamic OG image URL
  const ogImageUrl = images?.[0] || generateOgImage(title, description);
  
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': canonicalUrl,
        'x-default': canonicalUrl
      }
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'SnapSeeker',
      locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': 200,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    other: {
      'google-site-verification': 'add-your-verification-code-here',
    }
  };
}

/**
 * Generates JSON-LD structured data for the website
 */
export function generateSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SnapSeeker',
    alternateName: ['Snap Seeker', 'Seeker', 'Product Seek', 'SnapSnap'],
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    keywords: 'product search, seeker, snap seeker, snapsnap, competitor analysis, product validation, idea validation',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generates JSON-LD structured data for the SaaS product
 */
export function generateProductStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SnapSeeker',
    alternateName: ['Snap Seeker', 'Seeker', 'Product Seek', 'SnapSnap Seeker'],
    applicationCategory: 'BusinessApplication',
    description: seoConfig.defaultDescription,
    keywords: 'product search, seeker, snap seeker, snapsnap, competitor analysis, product validation, idea validation',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'All',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
  };
}

/**
 * Generates JSON-LD structured data for an article or blog post
 */
export function generateArticleStructuredData(
  title: string,
  description: string,
  datePublished: string,
  dateModified: string,
  imageUrl: string,
  authorName: string = 'SnapSeeker Team',
  path: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SnapSeeker',
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}${path}`,
    },
  };
} 