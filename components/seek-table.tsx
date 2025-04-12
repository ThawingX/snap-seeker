"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconTable, IconBrain, IconChartBar, IconBulb } from "@tabler/icons-react";
import { useRef } from "react";

interface CompetitorData {
  id: string;
  name: string;
  slogan: string;
  relevance: string;
  traffic: string;
  targetUser: string[];
  plainPoints: string[];
  keyFeatures: string[];
  potentialWeaknesses: string[];
  revenueModel: string;
}

// Step component for Chain of Thought section
const Step = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <motion.div 
    className="flex mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: number * 0.2 }}
  >
    <div className="flex-shrink-0 mr-4">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500 text-white font-bold">
        {number}
      </div>
    </div>
    <div className="flex-grow">
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p className="text-neutral-300 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function SeekTable({ query }: { query: string }) {
  // Add refs for scrolling to specific sections
  const searchLogicRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a specific section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Define floating dock items
  const dockItems = [
    {
      title: "Search Logic",
      icon: <IconBrain className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#search-logic",
      onClick: () => scrollToSection(searchLogicRef)
    },
    {
      title: "Data Table",
      icon: <IconTable className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#table",
      onClick: () => scrollToSection(tableRef)
    },
    {
      title: "Insights",
      icon: <IconBulb className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />,
      href: "#insights",
      onClick: () => scrollToSection(insightsRef)
    }
  ];

  // In a real app, this would come from an API call based on the query
  const competitorData: CompetitorData[] = [
    {
      id: "1",
      name: "Competitor A",
      slogan: "Simplify Your Workflow",
      relevance: "High (85%)",
      traffic: "1.2M monthly visits",
      targetUser: ["Small businesses", "Freelancers", "Remote teams"],
      plainPoints: ["Time management", "Collaboration barriers", "Task organization"],
      keyFeatures: ["Team collaboration", "Task automation", "Integration with 50+ tools"],
      potentialWeaknesses: ["Limited custom reporting", "Higher pricing tiers", "Learning curve for new users"],
      revenueModel: "Freemium + SaaS subscription"
    },
    {
      id: "2",
      name: "Competitor B",
      slogan: "Enterprise Solutions for Complex Problems",
      relevance: "Medium (65%)",
      traffic: "850K monthly visits",
      targetUser: ["Enterprise companies", "IT departments", "Large organizations"],
      plainPoints: ["Data security", "Scalability", "Cross-department communication"],
      keyFeatures: ["Advanced security", "Enterprise-grade API", "Customizable workflows"],
      potentialWeaknesses: ["Complex UI", "Expensive pricing", "Slow customer support"],
      revenueModel: "Enterprise licensing + Professional services"
    },
    {
      id: "3",
      name: "Competitor C",
      slogan: "Affordable Solutions for Growing Teams",
      relevance: "High (78%)",
      traffic: "2.1M monthly visits",
      targetUser: ["Startups", "Mid-sized businesses", "Marketing teams"],
      plainPoints: ["Budget constraints", "Scaling pains", "Onboarding process"],
      keyFeatures: ["User-friendly interface", "Affordable pricing tiers", "Quick setup"],
      potentialWeaknesses: ["Limited advanced features", "Fewer integrations", "Occasional performance issues"],
      revenueModel: "SaaS subscription + Marketplace commissions"
    }
  ];

  // Chain of Thought (COT) steps
  const searchSteps = [
    {
      title: "Query Analysis",
      description: "Analyzing the search query to identify main topics, keywords, and intent. Breaking down complex queries into manageable components for deeper understanding."
    },
    {
      title: "Domain Identification",
      description: "Identifying relevant industry domains and business sectors related to the query. Mapping query elements to specific market segments for targeted research."
    },
    {
      title: "Competitor Discovery",
      description: "Finding key market players and competitors in the identified domains. Utilizing multiple data sources to ensure comprehensive market coverage."
    },
    {
      title: "Data Collection",
      description: "Gathering detailed information about each competitor including product offerings, market positioning, target audience, and business models."
    },
    {
      title: "Feature Analysis",
      description: "Analyzing key features, strengths, and weaknesses of each competitor to identify patterns and differentiating factors in the market."
    },
    {
      title: "Market Positioning",
      description: "Evaluating how each competitor positions themselves in the market, including messaging, pricing strategies, and target customer segments."
    },
    {
      title: "Trend Identification",
      description: "Recognizing emerging patterns and trends across competitors to highlight market direction and potential opportunities or threats."
    },
    {
      title: "Insight Synthesis",
      description: "Combining all collected data to generate actionable insights and recommendations based on competitive analysis findings."
    },
  ];

  return (
    <div className="flex flex-col p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/history" className="text-cyan-500 hover:text-cyan-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to history
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Competitor Analysis</h1>
        <p className="text-neutral-400">Results for: {query}</p>
      </div>

      {/* Floating Dock for navigation */}
      <FloatingDock 
        items={dockItems.map(item => ({
          title: item.title,
          icon: item.icon,
          href: item.href
        }))}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 shadow-lg"
        mobileClassName="fixed bottom-8 right-8 z-50 shadow-lg"
      />

      {/* Chain of Thought Section */}
      <motion.div 
        ref={searchLogicRef}
        id="search-logic"
        className="bg-neutral-900 rounded-xl p-6 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-white">Search Processing Logic</h2>
        <div className="mb-4 border-l-2 border-cyan-500 pl-4">
          <p className="text-neutral-300 italic">
            "Analyzing competitors in the market to identify strengths, weaknesses, and opportunities for {query}..."
          </p>
        </div>
        <div className="space-y-0">
          {searchSteps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div 
        ref={tableRef}
        id="table"
        className="overflow-x-auto bg-neutral-900 rounded-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-800 text-neutral-200">
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Slogan</th>
              <th className="p-4 text-left">Relevance</th>
              <th className="p-4 text-left">Traffic</th>
              <th className="p-4 text-left">Target User</th>
              <th className="p-4 text-left">Plain Points</th>
              <th className="p-4 text-left">Key Features</th>
              <th className="p-4 text-left">Potential Weaknesses</th>
              <th className="p-4 text-left">Revenue Model</th>
            </tr>
          </thead>
          <tbody>
            {competitorData.map((competitor) => (
              <tr key={competitor.id} className="border-b border-neutral-700 hover:bg-neutral-800/50 transition-colors">
                <td className="p-4 font-medium text-cyan-400">{competitor.name}</td>
                <td className="p-4 italic text-sm">{competitor.slogan}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-16 bg-neutral-700 rounded-full h-2 mr-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full" 
                        style={{ width: competitor.relevance.match(/\d+/)?.[0] + '%' }}
                      ></div>
                    </div>
                    <span>{competitor.relevance}</span>
                  </div>
                </td>
                <td className="p-4">{competitor.traffic}</td>
                <td className="p-4">
                  <ul className="list-disc list-inside">
                    {competitor.targetUser.map((user, idx) => (
                      <li key={idx} className="text-sm py-1">{user}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <ul className="list-disc list-inside">
                    {competitor.plainPoints.map((point, idx) => (
                      <li key={idx} className="text-sm py-1">{point}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <ul className="list-disc list-inside">
                    {competitor.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="text-sm py-1">{feature}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <ul className="list-disc list-inside">
                    {competitor.potentialWeaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm py-1">{weakness}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">{competitor.revenueModel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      
      {/* Bottom Recommendation Section */}
      <motion.div 
        ref={insightsRef}
        id="insights"
        className="mt-10 p-6 bg-gradient-to-r from-cyan-900/30 to-neutral-900 rounded-xl border border-cyan-800/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-3 text-white">Key Insights</h3>
        <p className="text-neutral-300 mb-4">
          Based on the competitive analysis for "{query}", there are clear patterns in how competitors address market needs.
          The most successful products focus on ease of use, scalability, and integration capabilities while balancing pricing with value proposition.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm">User Experience</span>
          <span className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm">Pricing Strategy</span>
          <span className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm">Feature Development</span>
          <span className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm">Target Demographics</span>
          <span className="px-3 py-1 bg-cyan-900/40 text-cyan-300 rounded-full text-sm">Market Positioning</span>
        </div>
      </motion.div>
    </div>
  );
} 