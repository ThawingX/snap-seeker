export type SeoKeywordCategory = {
  keywords: {
    zh: string;
    en: string;
  }[];
};

export type SeoConfig = {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  coreKeywords: SeoKeywordCategory;
  targetUserKeywords: SeoKeywordCategory;
  longTailKeywords: SeoKeywordCategory;
  productKeywords: SeoKeywordCategory;
  painPointKeywords: SeoKeywordCategory;
};

const seoConfig: SeoConfig = {
  siteUrl: "https://seeker.snapsnap.site",
  defaultTitle: "SnapSeeker - Snap Seeker | Seeker & Product Search Tool by SnapSnap",
  defaultDescription: "SnapSeeker (Snap Seeker) is a product search and competitor analysis tool designed for product managers, independent developers, and entrepreneurs. Find similar products, validate ideas, and analyze market opportunities with this powerful seeker tool by SnapSnap.",
  
  // Core Keywords
  coreKeywords: {
    keywords: [
      { zh: "竞品分析工具", en: "Competitor Analysis Tool" },
      { zh: "同类产品查询", en: "Similar Product Search" },
      { zh: "创意验证工具", en: "Idea Validation Tool" },
      { zh: "市场调研工具 (初期)", en: "Early Stage Market Research Tool" },
      { zh: "产品想法验证", en: "Product Idea Validation" },
      { zh: "创新点发现", en: "Innovation Discovery" },
      { zh: "竞品数据分析", en: "Competitor Data Analysis" },
      { zh: "市场机会分析", en: "Market Opportunity Analysis" },
      { zh: "产品可行性分析", en: "Product Feasibility Analysis" },
      { zh: "早期项目评估", en: "Early Project Evaluation" },
    ],
  },
  
  // Target User Keywords
  targetUserKeywords: {
    keywords: [
      { zh: "产品经理 竞品分析", en: "Product Manager Competitor Analysis" },
      { zh: "产品经理 市场调研", en: "Product Manager Market Research" },
      { zh: "独立开发者 竞品分析", en: "Independent Developer Competitor Analysis" },
      { zh: "独立开发者 创意验证", en: "Independent Developer Idea Validation" },
      { zh: "创业人士 市场调研", en: "Entrepreneur Market Research" },
      { zh: "创业人士 项目评估", en: "Entrepreneur Project Evaluation" },
      { zh: "产品经理 工具", en: "Product Manager Tools" },
      { zh: "开发者 工具", en: "Developer Tools" },
      { zh: "创业者 工具", en: "Entrepreneur Tools" },
    ],
  },
  
  // Long Tail Keywords
  longTailKeywords: {
    keywords: [
      { zh: "如何查看我的想法是否有同类产品", en: "How to check if my idea has similar products" },
      { zh: "验证产品创意是否已存在的方法", en: "Methods to verify if a product idea already exists" },
      { zh: "初期市场调研怎么做", en: "How to conduct early-stage market research" },
      { zh: "寻找竞争对手的产品", en: "Finding competitor products" },
      { zh: "分析同类产品的市场数据", en: "Analyzing market data of similar products" },
      { zh: "产品经理用什么工具做竞品分析", en: "What tools do product managers use for competitor analysis" },
      { zh: "独立开发者如何快速验证产品想法", en: "How can independent developers quickly validate product ideas" },
      { zh: "创业初期如何评估市场机会", en: "How to evaluate market opportunities in the early stages of a startup" },
      { zh: "有没有工具可以查询类似的产品", en: "Are there tools to search for similar products" },
      { zh: "产品想法的早期验证流程", en: "Early validation process for product ideas" },
      { zh: "Snapseeker 竞品分析", en: "Snapseeker Competitor Analysis" },
      { zh: "Snapseeker 同类产品查询", en: "Snapseeker Similar Product Search" },
      { zh: "Snapseeker 创意验证", en: "Snapseeker Idea Validation" },
    ],
  },
  
  // Product Name Keywords
  productKeywords: {
    keywords: [
      { zh: "Snapseeker", en: "Snapseeker" },
      { zh: "Snapseeker 工具", en: "Snapseeker Tool" },
      { zh: "Snapseeker 竞品分析", en: "Snapseeker Competitor Analysis" },
      { zh: "Snapseeker 市场调研", en: "Snapseeker Market Research" },
      { zh: "Snapseeker 产品验证", en: "Snapseeker Product Validation" },
      { zh: "Seeker", en: "Seeker" },
      { zh: "Product Seek", en: "Product Seek" },
      { zh: "Snap Seeker", en: "Snap Seeker" },
      { zh: "SnapSnap", en: "SnapSnap" },
      { zh: "产品搜索工具", en: "Product Search Tool" },
    ],
  },
  
  // Pain Point Keywords
  painPointKeywords: {
    keywords: [
      { zh: "避免重复造轮子", en: "Avoid reinventing the wheel" },
      { zh: "防止创意撞车", en: "Prevent idea collision" },
      { zh: "了解市场竞争格局", en: "Understand the market competitive landscape" },
      { zh: "降低创业风险", en: "Reduce startup risk" },
      { zh: "提高产品成功率", en: "Improve product success rate" },
      { zh: "寻找差异化竞争优势", en: "Find competitive differentiation advantages" },
    ],
  },
};

export default seoConfig;