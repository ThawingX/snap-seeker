import React from "react";
import seoConfig from "@/lib/seo/seo-config";
import { headers } from "next/headers";

interface CanonicalLinkProps {
  path?: string;
}

/**
 * Component for adding canonical and alternate links to pages
 * @param path The path relative to the site URL (e.g., "/about")
 */
export default function CanonicalLink({ path = "" }: CanonicalLinkProps) {
  const headersList = headers();
  const currentPath = headersList.get("x-pathname") || path;
  const canonicalUrl = `${seoConfig.siteUrl}${currentPath}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" href={canonicalUrl} hrefLang="x-default" />
      <link rel="alternate" href={canonicalUrl} hrefLang="en" />
      <link rel="alternate" href={canonicalUrl} hrefLang="zh" />
    </>
  );
}