import seoConfig from '@/lib/seo/seo-config';

interface CanonicalLinkProps {
  path?: string;
}

export default function CanonicalLink({ path = '' }: CanonicalLinkProps) {
  const canonicalUrl = `${seoConfig.siteUrl}${path}`;
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {/* Add alternate links for the different name variations */}
      <link rel="alternate" href={canonicalUrl} hrefLang="en" />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />
    </>
  );
} 