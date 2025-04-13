"use client";
import React from 'react';
import Script from 'next/script';

interface StructuredDataProps {
  data: any;
}

/**
 * Component to add structured data to pages
 * This uses client-side rendering via next/script
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
} 