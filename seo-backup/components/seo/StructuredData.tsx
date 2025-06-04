import React from "react";
import Script from "next/script";

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component for adding structured data to pages
 * @param data The structured data object or array of objects
 */
export default function StructuredData({ data }: StructuredDataProps) {
  // Convert the data to a JSON string
  const jsonLd = JSON.stringify(data);

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}