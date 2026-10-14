export const NAV = [
  { id: "services", label: "Services" },
  { id: "solutions", label: "Solutions" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "founders", label: "Founders" },
  { id: "contact", label: "Contact" },
] as const;

export type ServiceVisualKey = "web" | "mobile" | "software" | "ai" | "saas" | "design";

export interface Service {
  id: string;
  num: string;
  title: string;
  blurb: string;
  visual: ServiceVisualKey;
  includes: string[];
  formValue: string;
  span: string;
}

export const SERVICES: Service[] = [
  {
    id: "web",
    num: "01",
    title: "Web Development",
    blurb: "Corporate websites, e-commerce, dashboards and modern web applications.",
    visual: "web",
    includes: ["Marketing and corporate sites", "E-commerce storefronts", "Dashboards and portals", "Performance and accessibility work"],
    formValue: "web",
    span: "lg:col-span-7",
  },
  {
    id: "mobile",
    num: "02",
    title: "Mobile Applications",
    blurb: "Apps and responsive experiences designed around real user needs.",
    visual: "mobile",
    includes: ["iOS and Android apps", "Cross-platform builds", "Responsive web apps", "API and backend integration"],
    formValue: "mobile",
    span: "lg:col-span-5",
  },
  {
    id: "business-software",
    num: "03",
    title: "Custom Business Software",
    blurb: "Purpose-built applications that streamline workflows and solve operational problems.",
    visual: "software",
    includes: ["Internal tools and admin systems", "ERP, CRM, HRM and POS modules", "Reporting and dashboards", "Migration from spreadsheets"],
    formValue: "business-software",
    span: "lg:col-span-5",
  },
  {
    id: "ai-automation",
    num: "04",
    title: "AI & Intelligent Automation",
    blurb: "Assistants, document processing and workflow automation that reduce repetitive work.",
    visual: "ai",
    includes: ["Knowledge-base assistants", "Document processing", "Workflow automation", "LLM integrations in existing apps"],
    formValue: "ai-automation",
    span: "lg:col-span-7",
  },
  {
    id: "saas",
    num: "05",
    title: "SaaS Product Engineering",
    blurb: "Scalable platforms, subscription products and customer portals.",
    visual: "saas",
    includes: ["Multi-tenant architecture", "Billing and subscriptions", "Customer portals", "Cloud deployment and monitoring"],
    formValue: "saas",
    span: "lg:col-span-7",
  },
  {
    id: "design",
    num: "06",
    title: "UI/UX & Product Design",
    blurb: "Discovery, interface design, prototyping and architecture, through to implementation.",
    visual: "design",
    includes: ["Discovery workshops", "Interface and prototype design", "Technical architecture", "Design-to-code delivery"],
    formValue: "design",
    span: "lg:col-span-5",
  },
];

export interface Module {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
}

// Illustrative modules: capabilities we can build, not released products.
export const MODULES: Module[] = [
  { id: "erp", label: "ERP", text: "Finance, purchasing and operations on one shared data model.", x: 50, y: 12 },
  { id: "crm", label: "CRM", text: "Leads, accounts and follow-ups in one clear pipeline.", x: 84, y: 31 },
  { id: "hrm", label: "HRM", text: "People records, leave and onboarding workflows.", x: 84, y: 69 },
  { id: "pos", label: "POS", text: "Fast checkout connected to live stock.", x: 50, y: 88 },
  { id: "inventory", label: "Inventory", text: "Stock, suppliers and movements you can trust.", x: 16, y: 69 },
  { id: "custom", label: "Custom", text: "Purpose-built tools for processes that are unique to your business.", x: 16, y: 31 },
];

export const BUSINESS_VALUE = [
  ["Operational efficiency", "Shared modules replace re-keying and copy-paste steps."],
  ["Clearer information", "One source of truth that every team can read."],
  ["Less repetitive work", "Approvals and hand-offs that run themselves."],
];

export const AI_CAPABILITIES = [
  "AI assistants",
  "Intelligent search",
  "Document processing",
  "Workflow automation",
  "LLM integrations",
  "Custom AI-powered applications",
];

export const AI_FLOW = [
  ["Data", "Documents, records, emails and events"],
  ["AI", "Language models, embeddings, retrieval"],
  ["Decision", "Rules and review for what happens next"],
  ["Action", "Updated records, drafts, notifications"],
];

export const PROCESS = [
  ["01", "Discover", "Understand the business, users, requirements and goals."],
  ["02", "Define", "Clarify the scope, architecture, priorities and delivery plan."],
  ["03", "Design", "Shape the experience, interface and technical direction."],
  ["04", "Build", "Implement the frontend, backend, database and integrations."],
  ["05", "Validate", "Test functionality, performance, security and usability."],
  ["06", "Launch & Improve", "Deploy, monitor and iterate based on real feedback."],
];

export const PRINCIPLES = [
  ["Thoughtful engineering", "Tested, reviewed code built to be changed."],
  ["Reliable architecture", "Sensible foundations that hold up under load."],
  ["Product-focused design", "Interfaces shaped by what people need to do."],
  ["Business understanding", "We start from your outcome, not a technology."],
  ["Scalable software", "Structure that grows with usage and teams."],
  ["Long-term improvement", "We stay involved after launch."],
];

export const TECH = [
  "React", "TypeScript", "Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB", "MySQL", "AWS", "Docker", "CI/CD", "LLM integrations", "RAG", "Semantic search",
];

export const BUDGETS = ["Under $5k", "$5k–15k", "$15k–50k", "$50k+", "Not sure"];

export const CONTACT_EMAIL = "admin@javiantech.com";

export const CONTACT_PHONE = { display: "+91 95749 36650", tel: "+919574936650" };
