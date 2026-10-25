/** Single source of truth for per-route head metadata and JSON-LD. */

export interface FaqItem {
  q: string;
  a: string;
}

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  /** FAQ items used by service page components and FAQPage JSON-LD. */
  faqs?: FaqItem[];
}

// ─── FAQ content ────────────────────────────────────────────────────────────

export const WEB_FAQS: FaqItem[] = [
  {
    q: "How long does a website project take?",
    a: "Most marketing and corporate websites take 4–8 weeks from kickoff to launch. E-commerce and custom web applications with complex integrations typically run 8–16 weeks. We define milestones at the start so you always know what's coming.",
  },
  {
    q: "Do you build on platforms like WordPress or Shopify?",
    a: "We build on the platform that best fits your needs. For content-heavy sites we often use a headless CMS; for storefronts, Shopify or a custom React e-commerce stack. For performance-critical applications, we build entirely custom with React and TypeScript.",
  },
  {
    q: "Will my website rank on Google?",
    a: "We build sites with SEO fundamentals baked in: semantic HTML, fast loading times, structured data and clean canonicals. For ongoing content SEO, we advise on strategy — active content and link-building are things you drive.",
  },
  {
    q: "Can I update the site myself after launch?",
    a: "Yes. If your site has a CMS, you can update content, add pages and manage products without touching code. We include a handover session to walk you through everything.",
  },
  {
    q: "What does web design and development cost in India?",
    a: "A polished marketing website starts from around ₹80,000 for a focused build with a small number of pages. E-commerce and web applications are priced on scope. We provide a fixed-price quote after a short discovery call.",
  },
];

export const SOFTWARE_FAQS: FaqItem[] = [
  {
    q: "What is custom software development?",
    a: "Custom software is built specifically for your business — it matches your exact processes rather than forcing you to adapt to a generic tool. Unlike off-the-shelf products, it can be extended, integrated with your other systems and owned entirely by you.",
  },
  {
    q: "When does a business need custom software instead of existing tools?",
    a: "When your operations have outgrown spreadsheets and generic SaaS products, when you pay for features you never use, or when you need your tools to talk to each other without manual data entry. Custom software is the right answer when the gap between what you need and what exists is costing you time or revenue.",
  },
  {
    q: "How long does a custom software project take?",
    a: "A focused internal tool — such as a reporting dashboard or an approval workflow — typically ships in 6–12 weeks. Larger systems like ERP modules or multi-module business platforms take 3–9 months depending on scope. We define a phased roadmap at the start so value is delivered in increments rather than one big release.",
  },
  {
    q: "Do you build ERP, CRM and HRM systems?",
    a: "Yes. We build custom ERP modules, CRM pipelines, HRM and leave management systems, POS integrations and operations dashboards. These are built to fit your business rules — not the other way around.",
  },
  {
    q: "What happens after launch?",
    a: "We offer ongoing support, bug fixes and feature development after launch. Most clients work with us on a retainer or quarterly development sprints. We document the system thoroughly so your internal team can maintain it too if that's the plan.",
  },
];

export const AI_FAQS: FaqItem[] = [
  {
    q: "What is AI automation for business?",
    a: "AI automation uses language models, intelligent document processing and workflow orchestration to handle tasks that previously required human time: classifying emails, extracting data from documents, answering routine questions, routing approvals and generating first drafts. It doesn't replace your team — it removes the repetitive work so they can focus on decisions that require judgment.",
  },
  {
    q: "What kinds of tasks can AI actually automate reliably?",
    a: "Document data extraction and classification, inbox triage and routing, knowledge-base question answering, contract and report summarisation, and automated follow-up drafting. Tasks that are rule-based or pattern-heavy with a defined correct answer automate well. Tasks requiring creativity, ethical judgment or novel context still need a human in the loop.",
  },
  {
    q: "Do you build on GPT, Claude or your own models?",
    a: "We use the model best suited to your task — typically OpenAI GPT-4o or Anthropic Claude for general language tasks, plus embedding models for semantic search and retrieval-augmented generation (RAG). We don't run proprietary models, but we do build the systems that connect them to your data and workflows.",
  },
  {
    q: "How do you ensure the AI doesn't make mistakes that affect our business?",
    a: "Every automation we build includes a human review layer for decisions above a defined confidence threshold. We instrument outputs with logging and monitoring, set up feedback loops so the system improves over time, and design clear escalation paths so edge cases never fall through the cracks.",
  },
  {
    q: "Can AI automation be integrated into our existing software?",
    a: "Yes — in fact that's the most common project type. We build integrations that sit between your existing CRM, ERP or inbox and an AI layer, enriching or acting on data as it flows through. You keep your existing systems; the AI adds a processing step that was previously done manually.",
  },
];

// ─── Route metadata ──────────────────────────────────────────────────────────

export const ROUTE_META: RouteMeta[] = [
  {
    path: "/",
    title: "Custom Software, Web Design & AI Automation | Javian",
    description: "Javian builds custom business software, websites and AI automation for growing companies in India. See our work and start a project.",
    canonical: "https://javiantech.com/",
  },
  {
    path: "/services/web-design-development",
    title: "Web Design & Development Services in India — Javian Technologies",
    description: "Custom websites, e-commerce stores and web applications built for Indian businesses. Fast, accessible and optimised for search.",
    canonical: "https://javiantech.com/services/web-design-development",
    faqs: WEB_FAQS,
  },
  {
    path: "/services/custom-software-development",
    title: "Custom Software Development in India — Javian Technologies",
    description: "Purpose-built business software, ERP modules, internal tools and workflow automation for Indian companies. One team, fixed-price delivery.",
    canonical: "https://javiantech.com/services/custom-software-development",
    faqs: SOFTWARE_FAQS,
  },
  {
    path: "/services/ai-automation",
    title: "AI Automation & Intelligent Workflow Services — Javian Technologies",
    description: "Practical AI automation for Indian businesses: document processing, knowledge-base assistants, workflow automation and LLM integrations that reduce repetitive work.",
    canonical: "https://javiantech.com/services/ai-automation",
    faqs: AI_FAQS,
  },
  {
    path: "/work/cafe-linde",
    title: "Café Linde — Restaurant Website Case Study | Javian Technologies",
    description: "An elegant dark-themed restaurant website with online table reservations, built with React and scroll-driven animations.",
    canonical: "https://javiantech.com/work/cafe-linde",
  },
  {
    path: "/work/studio-x",
    title: "Studio X — Photography Portfolio Website | Javian Technologies",
    description: "A bold portfolio website for a photography and cinematic film studio in Surat, India, built for high-impact visual presentation.",
    canonical: "https://javiantech.com/work/studio-x",
  },
  {
    path: "/work/brew-bloom",
    title: "Brew & Bloom — Coffee Shop E-commerce Website | Javian Technologies",
    description: "An editorial website for a coffee and plant shop with integrated online ordering, built with React and an earthy editorial design.",
    canonical: "https://javiantech.com/work/brew-bloom",
  },
  {
    path: "/work/three-tyres-grocery",
    title: "Three Tyres Grocery — Online Delivery Platform | Javian Technologies",
    description: "An online grocery delivery platform for the Indian community in Berlin, with WhatsApp ordering, a searchable catalogue and delivery slots.",
    canonical: "https://javiantech.com/work/three-tyres-grocery",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy — Javian Technologies",
    description: "How Javian Technologies handles personal information submitted through this website, written for visitors and businesses in India.",
    canonical: "https://javiantech.com/privacy-policy",
    noindex: true,
  },
  {
    path: "/security",
    title: "Security — Javian Technologies",
    description: "Javian Technologies security practices and responsible disclosure policy.",
    canonical: "https://javiantech.com/security",
    noindex: true,
  },
];

export function getRouteMeta(path: string): RouteMeta | undefined {
  return ROUTE_META.find((r) => r.path === path);
}

// ─── JSON-LD builders (used by page components and prerender) ────────────────

export function buildWebPageJsonLd(canonical: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonical,
    "name": title,
    "description": description,
    "url": canonical,
    "isPartOf": { "@id": "https://javiantech.com/#website" },
  };
}

export function buildServicePageJsonLd(
  meta: RouteMeta,
  serviceName: string,
  serviceDescription: string,
  serviceType: string,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd(meta.canonical, meta.title, meta.description),
      {
        "@type": "Service",
        "name": serviceName,
        "provider": { "@id": "https://javiantech.com/#organization" },
        "areaServed": "IN",
        "description": serviceDescription,
        "serviceType": serviceType,
      },
      {
        "@type": "FAQPage",
        "mainEntity": (meta.faqs ?? []).map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
      },
    ],
  };
}

/** Returns the page-level JSON-LD object for any route (used by prerender). */
export function buildRouteJsonLd(path: string): object | null {
  const meta = getRouteMeta(path);
  if (!meta) return null;

  if (path === "/services/web-design-development") {
    return buildServicePageJsonLd(
      meta,
      "Web Design and Development",
      "Custom websites, e-commerce storefronts, dashboards and modern web applications designed and engineered for businesses in India.",
      "Web Development",
    );
  }
  if (path === "/services/custom-software-development") {
    return buildServicePageJsonLd(
      meta,
      "Custom Software Development",
      "Purpose-built business applications, ERP modules, internal tools and workflow automation designed for businesses in India.",
      "Custom Software Development",
    );
  }
  if (path === "/services/ai-automation") {
    return buildServicePageJsonLd(
      meta,
      "AI Automation and Intelligent Workflow",
      "AI assistants, document processing, workflow automation and LLM integrations that reduce repetitive work for businesses in India.",
      "AI Automation",
    );
  }

  // Work pages and other routes get a WebPage schema
  if (path !== "/" && !meta.noindex) {
    return buildWebPageJsonLd(meta.canonical, meta.title, meta.description);
  }

  return null;
}
