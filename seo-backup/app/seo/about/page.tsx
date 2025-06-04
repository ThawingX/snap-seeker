import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";
import StructuredData from "@/components/seo/StructuredData";
import SeoNavigation from "@/components/seo/SeoNavigation";
import SeoFooter from "@/components/seo/SeoFooter";

// Generate metadata for About page
export const metadata: Metadata = generateMetadata({
  title: "About SnapSeeker - Product Search & Competitor Analysis Tool",
  description: "Learn about SnapSeeker, a powerful product search and competitor analysis tool designed for product managers, independent developers, and entrepreneurs.",
  keywords: [
    ...seoConfig.productKeywords.keywords.slice(0, 3),
    ...seoConfig.targetUserKeywords.keywords.slice(0, 3),
  ],
  canonicalPath: "/seo/about",
});

/**
 * About page component
 */
export default function AboutPage() {
  // Structured data for the About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About SnapSeeker",
    description: "Learn about SnapSeeker, a powerful product search and competitor analysis tool.",
    url: `${seoConfig.siteUrl}/seo/about`,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "SnapSeeker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <SeoNavigation />

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About SnapSeeker</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            SnapSeeker is a product search and competitor analysis tool designed for
            product managers, independent developers, and entrepreneurs who want to
            validate their ideas and understand the competitive landscape.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Our mission is to help creators avoid reinventing the wheel by
                providing a powerful tool to discover similar products, validate
                ideas, and analyze market opportunities before investing significant
                time and resources.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Serve</h2>
              <p className="text-gray-600">
                SnapSeeker is built for product managers seeking competitive
                intelligence, independent developers validating product ideas, and
                entrepreneurs researching market opportunities in the early stages of
                their journey.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Search</h3>
              <p className="text-gray-600">
                Quickly find similar products and solutions that match your idea or
                concept, helping you understand what already exists in the market.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Competitor Analysis</h3>
              <p className="text-gray-600">
                Analyze competing products to identify gaps in the market and
                opportunities for differentiation that can give your product a
                competitive edge.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Idea Validation</h3>
              <p className="text-gray-600">
                Validate your product ideas early in the development process to save
                time and resources by ensuring there's a market need for your
                solution.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose SnapSeeker</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Save Time:</strong> Quickly discover similar products instead
                of spending weeks on manual research.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Reduce Risk:</strong> Validate your ideas before investing
                significant resources in development.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Find Opportunities:</strong> Identify gaps in the market and
                opportunities for differentiation.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Make Informed Decisions:</strong> Base your product decisions
                on data rather than assumptions.
              </span>
            </li>
          </ul>
        </section>
      </main>

      <SeoFooter />
    </>
  );
}