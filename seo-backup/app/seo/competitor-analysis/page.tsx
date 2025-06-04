import { Metadata } from "next";
import { generateMetadata } from "@/lib/seo/seo-utils";
import seoConfig from "@/lib/seo/seo-config";
import StructuredData from "@/components/seo/StructuredData";
import SeoNavigation from "@/components/seo/SeoNavigation";
import SeoFooter from "@/components/seo/SeoFooter";

// Generate metadata for Competitor Analysis page
export const metadata: Metadata = generateMetadata({
  title: "Competitor Analysis Tool - SnapSeeker",
  description: "Use SnapSeeker's competitor analysis tool to identify similar products, analyze market gaps, and find your competitive advantage.",
  keywords: [
    ...seoConfig.coreKeywords.keywords.filter(k => 
      k.en.toLowerCase().includes("competitor") || 
      k.en.toLowerCase().includes("analysis")
    ),
    { zh: "竞品分析工具使用指南", en: "Competitor Analysis Tool Guide" },
    { zh: "如何分析竞争对手产品", en: "How to Analyze Competitor Products" },
    { zh: "市场竞争分析方法", en: "Market Competition Analysis Methods" },
  ],
  canonicalPath: "/seo/competitor-analysis",
});

/**
 * Competitor Analysis page component
 */
export default function CompetitorAnalysisPage() {
  // Structured data for the Competitor Analysis page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Competitor Analysis Tool - SnapSeeker",
    description: "Use SnapSeeker's competitor analysis tool to identify similar products, analyze market gaps, and find your competitive advantage.",
    url: `${seoConfig.siteUrl}/seo/competitor-analysis`,
    mainEntity: {
      "@type": "HowTo",
      name: "How to Analyze Competitors with SnapSeeker",
      description: "A step-by-step guide to analyzing competitors using SnapSeeker's tools.",
      step: [
        {
          "@type": "HowToStep",
          name: "Search for Similar Products",
          text: "Use SnapSeeker's search functionality to find products similar to your idea.",
          position: 1,
        },
        {
          "@type": "HowToStep",
          name: "Compare Features",
          text: "Analyze the features of competing products to identify gaps and opportunities.",
          position: 2,
        },
        {
          "@type": "HowToStep",
          name: "Identify Market Positioning",
          text: "Understand how competitors position themselves in the market.",
          position: 3,
        },
        {
          "@type": "HowToStep",
          name: "Find Your Competitive Advantage",
          text: "Determine how your product can differentiate itself from competitors.",
          position: 4,
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Competitor Analysis Tool</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl">
            SnapSeeker's competitor analysis tool helps product managers, independent
            developers, and entrepreneurs identify similar products, analyze market
            gaps, and find their competitive advantage.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Competitor Analysis Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Avoid Reinventing the Wheel</h3>
              <p className="text-gray-600">
                Understanding what already exists in the market helps you avoid
                building something that's already been created, allowing you to focus
                on innovation and differentiation instead.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Identify Market Gaps</h3>
              <p className="text-gray-600">
                By analyzing competing products, you can identify unmet needs and gaps
                in the market that your product can address, creating opportunities
                for success.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Reduce Risk</h3>
              <p className="text-gray-600">
                Understanding the competitive landscape reduces the risk of launching a
                product that doesn't have a clear place in the market or fails to
                differentiate itself from existing solutions.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Inform Product Strategy</h3>
              <p className="text-gray-600">
                Insights from competitor analysis can inform your product strategy,
                feature prioritization, pricing, and positioning, helping you make
                data-driven decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Use SnapSeeker for Competitor Analysis</h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Step-by-Step Guide</h3>
            </div>

            <div className="p-6">
              <ol className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Search for Similar Products</h4>
                    <p className="text-gray-600 mb-3">
                      Use SnapSeeker's search functionality to find products similar to
                      your idea. Enter keywords related to your product concept and
                      explore the results.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        Pro Tip: Try different combinations of keywords to ensure you
                        discover all relevant competitors.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Compare Features</h4>
                    <p className="text-gray-600 mb-3">
                      Analyze the features of competing products to identify what's
                      standard in the market, what's missing, and where there might be
                      opportunities for innovation.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        Pro Tip: Create a feature comparison matrix to visualize the
                        strengths and weaknesses of each competitor.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Identify Market Positioning</h4>
                    <p className="text-gray-600 mb-3">
                      Understand how competitors position themselves in the market.
                      Look at their messaging, target audience, pricing strategy, and
                      unique selling propositions.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        Pro Tip: Create a positioning map to visualize where
                        competitors stand in relation to each other and identify open
                        spaces in the market.
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Find Your Competitive Advantage</h4>
                    <p className="text-gray-600 mb-3">
                      Based on your analysis, determine how your product can
                      differentiate itself from competitors. This could be through
                      unique features, better user experience, different pricing, or
                      targeting an underserved segment of the market.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 italic">
                        Pro Tip: Focus on solving a specific pain point better than
                        anyone else rather than trying to compete on all fronts.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Benefits</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Savings</h3>
              <p className="text-gray-600">
                SnapSeeker's competitor analysis tools save you hours of manual
                research by quickly identifying relevant competitors and organizing the
                information you need.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Make decisions based on actual market data rather than assumptions,
                increasing your chances of building a successful product that meets
                real market needs.
              </p>
            </div>

            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Competitive Edge</h3>
              <p className="text-gray-600">
                Identify opportunities for differentiation that give your product a
                competitive edge in the market, helping you stand out from the crowd.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Analyze Your Competitors?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Start using SnapSeeker's competitor analysis tools today to gain valuable
            insights into your market and make informed decisions about your product
            strategy.
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Try SnapSeeker Now
            </a>
          </div>
        </section>
      </main>

      <SeoFooter />
    </>
  );
}