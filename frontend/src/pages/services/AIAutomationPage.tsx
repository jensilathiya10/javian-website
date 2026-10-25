import { Link } from "react-router-dom";
import { Reveal } from "../../components/Reveal";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

const FAQS = [
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

export default function AIAutomationPage() {
  useDocumentMeta(
    "AI Automation & Intelligent Workflow Services — Javian Technologies",
    "Practical AI automation for Indian businesses: document processing, knowledge-base assistants, workflow automation and LLM integrations that reduce repetitive work.",
    "https://javiantech.com/services/ai-automation",
  );
  useJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://javiantech.com/services/ai-automation",
        "name": "AI Automation & Intelligent Workflow Services — Javian Technologies",
        "description": "Practical AI automation for Indian businesses: document processing, knowledge-base assistants and LLM integrations.",
        "url": "https://javiantech.com/services/ai-automation",
        "isPartOf": { "@id": "https://javiantech.com/#website" },
      },
      {
        "@type": "Service",
        "name": "AI Automation and Intelligent Workflow",
        "provider": { "@id": "https://javiantech.com/#organization" },
        "areaServed": "IN",
        "description": "AI assistants, document processing, workflow automation and LLM integrations that reduce repetitive work for businesses in India.",
        "serviceType": "AI Automation",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
      },
    ],
  });

  return (
    <article className="container-x max-w-4xl py-20 md:py-28">
      <Reveal>
        <p className="eyebrow mb-4">Service · 04</p>
        <h1 className="display text-[clamp(2rem,5vw,3.6rem)] leading-tight">
          AI Automation for{" "}
          <span className="grad-text">Real Business Workflows</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Practical AI integrations that connect language models and intelligent processing to the systems your business already uses. We don't sell AI hype — we identify the repetitive, rule-heavy tasks in your operation and automate them with production-ready pipelines.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">What we automate</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Knowledge-base assistants", "AI assistants trained on your documentation, policies and FAQs — answer employee or customer questions accurately without your team drafting every reply."],
            ["Document processing", "Extract structured data from invoices, contracts, forms and PDFs automatically. Reduce manual data entry and accelerate approval workflows."],
            ["Workflow automation", "Connect your existing CRM, ERP or inbox to an AI layer that classifies, routes, summarises and acts on information as it arrives."],
            ["LLM integrations", "Add generative AI capabilities to existing applications: draft generation, classification, entity extraction and semantic search built into tools your team already uses."],
          ].map(([title, body]) => (
            <div key={title} className="panel p-6">
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">How an AI project works</h2>
        <p className="mt-4 leading-relaxed text-muted">
          AI projects start with a workflow audit: we map your current manual processes, identify which are high-frequency and rule-heavy, and estimate the value of automating each. This grounds the project in real business impact, not technology for its own sake.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We then design an automation pipeline that includes not just the AI model but also the data plumbing, the review and escalation logic, and the monitoring layer that tells you when the system is working well and when it isn't. Every production automation includes a human-in-the-loop threshold — decisions with low confidence are flagged for review rather than acted on automatically.
        </p>
        <ol className="mt-8 space-y-4">
          {[
            ["Data", "Understand your data sources: documents, databases, inboxes and APIs that feed the workflow."],
            ["AI", "Select and configure the right model — language model, embeddings, retrieval — for your specific task."],
            ["Decision", "Define the rules and confidence thresholds that determine what the system handles and what it escalates."],
            ["Action", "Connect outputs to downstream systems: updated records, drafted messages, triggered notifications."],
          ].map(([step, desc], i) => (
            <li key={step} className="flex gap-4">
              <span className="eyebrow !text-cyan shrink-0 w-6">0{i + 1}</span>
              <div>
                <span className="font-bold text-ink">{step}</span>
                <p className="mt-0.5 text-sm text-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Technology we work with</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {["OpenAI GPT-4o", "Anthropic Claude", "RAG pipelines", "LangChain / LlamaIndex", "Vector databases", "Python", "FastAPI", "PostgreSQL", "Semantic search", "Webhook integrations"].map((t) => (
            <li key={t} className="rounded-full border border-line-strong bg-indigo/40 px-4 py-1.5 text-sm font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Frequently asked questions</h2>
        <dl className="mt-6 space-y-6">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="panel p-6">
              <dt className="font-bold text-ink">{q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-16">
        <div className="panel p-8 text-center">
          <h2 className="display text-2xl">Ready to automate a workflow?</h2>
          <p className="mt-3 text-muted">
            Tell us which part of your operation costs the most manual time. We'll identify whether AI automation is the right solution and outline what that would look like.
          </p>
          <Link
            to={{ pathname: "/", hash: "contact" }}
            className="btn btn-primary mt-6 inline-flex justify-center"
          >
            Discuss your workflow <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
