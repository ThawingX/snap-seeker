import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";
import StructuredData from "@/components/seo/StructuredData";
import SeoNavigation from "@/components/seo/SeoNavigation";
import SeoFooter from "@/components/seo/SeoFooter";

// Generate metadata for Features page
export const metadata: Metadata = generateMetadata({
  title: "SnapSeeker Features - Product Search & Competitor Analysis Tool",
  description: "Explore the features of SnapSeeker, including product search, competitor analysis, and idea validation tools for product managers and developers.",
  keywords: [
    ...seoConfig.coreKeywords.keywords.slice(0, 3),
    ...seoConfig.productKeywords.keywords.slice(0, 2),
    { zh: "产品搜索功能", en: "Product Search Features" },
    { zh: "竞品分析功能", en: "Competitor Analysis Features" },
    { zh: "创意验证功能", en: "Idea Validation Features" },
  ],
  canonicalPath: "/seo/features",
});

/**
 * Features page component
 */
export default function FeaturesPage() {
  // Structured data for the Features page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SnapSeeker Features",
    description: "Explore the features of SnapSeeker, including product search, competitor analysis, and idea validation tools.",
    url: `${seoConfig.siteUrl}/seo/features`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Product Search",
          description: "Find similar products and solutions that match your idea or concept.",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Competitor Analysis",
          description: "Analyze competing products to identify gaps in the market and opportunities for differentiation.",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Idea Validation",
          description: "Validate your product ideas early in the development process.",
        },
      ],
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <SeoNavigation />

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">SnapSeeker Features</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            SnapSeeker offers a comprehensive set of tools designed to help product
            managers, independent developers, and entrepreneurs validate ideas,
            analyze competitors, and make data-driven decisions.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Core Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Product Search</h3>
                <p className="text-gray-600 mb-6">
                  Quickly find similar products and solutions that match your idea or
                  concept, helping you understand what already exists in the market.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Keyword-based product discovery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Similar product recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Category and tag filtering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Save and organize search results</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Competitor Analysis</h3>
                <p className="text-gray-600 mb-6">
                  Analyze competing products to identify gaps in the market and
                  opportunities for differentiation that can give your product a
                  competitive edge.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Feature comparison matrix</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Pricing strategy insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Target audience analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Market positioning visualization</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Idea Validation</h3>
                <p className="text-gray-600 mb-6">
                  Validate your product ideas early in the development process to save
                  time and resources by ensuring there's a market need for your
                  solution.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Market gap identification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Differentiation opportunity analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Idea uniqueness scoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Validation checklist and framework</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Additional Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Trend Analysis</h3>
              <p className="text-gray-600">
                Stay ahead of the curve by tracking emerging trends in your product
                category and identifying opportunities for innovation.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Market Insights</h3>
              <p className="text-gray-600">
                Access valuable market data and insights to understand the competitive
                landscape and make informed decisions.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaboration Tools</h3>
              <p className="text-gray-600">
                Share your findings with team members and collaborate on product
                strategy and development.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Export & Reporting</h3>
              <p className="text-gray-600">
                Generate comprehensive reports and export data for presentations,
                stakeholder meetings, or further analysis.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Our Features Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">For Product Managers</h3>
              <p className="text-gray-600 mb-4">
                Our features help product managers conduct thorough market research,
                analyze competitors, and make data-driven decisions about product
                strategy and roadmap.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">For Independent Developers</h3>
              <p className="text-gray-600 mb-4">
                Independent developers can quickly validate ideas, avoid reinventing
                the wheel, and identify unique opportunities to differentiate their
                products in the market.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">For Entrepreneurs</h3>
              <p className="text-gray-600 mb-4">
                Entrepreneurs can reduce risk by validating ideas early, understanding
                the competitive landscape, and identifying market gaps before
                investing significant resources.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">For Teams</h3>
              <p className="text-gray-600 mb-4">
                Teams can collaborate effectively with shared insights, align on
                product strategy based on data, and make informed decisions about
                feature prioritization.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SeoFooter />
    </>
  );
}