import { Link } from "react-router-dom";
import { Reveal } from "../../components/Reveal";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

const FAQS = [
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

export default function CustomSoftwarePage() {
  useDocumentMeta(
    "Custom Software Development in India — Javian Technologies",
    "Purpose-built business software, ERP modules, internal tools and workflow automation for Indian companies. One team, fixed-price delivery.",
    "https://javiantech.com/services/custom-software-development",
  );
  useJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://javiantech.com/services/custom-software-development",
        "name": "Custom Software Development in India — Javian Technologies",
        "description": "Purpose-built business software, ERP modules, internal tools and workflow automation for Indian companies.",
        "url": "https://javiantech.com/services/custom-software-development",
        "isPartOf": { "@id": "https://javiantech.com/#website" },
      },
      {
        "@type": "Service",
        "name": "Custom Software Development",
        "provider": { "@id": "https://javiantech.com/#organization" },
        "areaServed": "IN",
        "description": "Purpose-built business applications, ERP modules, internal tools and workflow automation designed for businesses in India.",
        "serviceType": "Custom Software Development",
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
        <p className="eyebrow mb-4">Service · 03</p>
        <h1 className="display text-[clamp(2rem,5vw,3.6rem)] leading-tight">
          Custom Software{" "}
          <span className="grad-text">Development</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Purpose-built business software for Indian companies that have outgrown spreadsheets and generic SaaS tools. From internal workflow tools to full ERP and CRM systems — engineered to fit your processes, not the other way around.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">What we build</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Internal tools & admin systems", "Dashboards, approval flows, reporting tools and admin panels that make your team faster and reduce manual effort."],
            ["ERP & operations software", "Finance, purchasing, inventory and operations modules connected to one shared data model so every team sees the same numbers."],
            ["CRM & sales tools", "Custom pipelines for leads, accounts, follow-ups and conversion tracking — built around how your sales team actually works."],
            ["Migration from spreadsheets", "Replace fragile Excel and Sheets workflows with a proper database-backed application with audit trails, permissions and integrations."],
          ].map(([title, body]) => (
            <div key={title} className="panel p-6">
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">How we work</h2>
        <p className="mt-4 leading-relaxed text-muted">
          Custom software projects start with a discovery phase where we map your current processes, identify the bottlenecks and agree on what the first version needs to do. We don't build everything at once — we ship a focused first release, validate it with real users and iterate from there.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          We use a modern stack — Python and FastAPI on the backend, React and TypeScript on the frontend, PostgreSQL for structured data — chosen for reliability and long-term maintainability over novelty. Code is reviewed, tested and documented. The system you receive is one your internal team can understand and extend.
        </p>
        <ol className="mt-8 space-y-4">
          {[
            ["Discover", "Map your workflows, users and pain points. Agree on scope and success criteria."],
            ["Define", "Produce a detailed specification: data model, user roles, API contracts and a prioritised backlog."],
            ["Build & review", "Iterative development with fortnightly demos and a staging environment you can test throughout."],
            ["Launch", "Production deployment with a handover session for your team and a post-launch support window."],
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
        <h2 className="display text-2xl">Technology we use</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "MySQL", "Docker", "AWS", "CI/CD pipelines", "REST & GraphQL APIs"].map((t) => (
            <li key={t} className="rounded-full border border-line-strong bg-indigo/40 px-4 py-1.5 text-sm font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Related work</h2>
        <p className="mt-4 text-muted">
          Our e-commerce and delivery platform for{" "}
          <Link to="/work/three-tyres-grocery" className="text-accent underline underline-offset-4 hover:text-cyan">
            Three Tyres Grocery
          </Link>
          {" "}demonstrates how we build data-driven web applications with catalogue management and ordering workflows — the same principles applied in larger custom software engagements.
        </p>
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
          <h2 className="display text-2xl">Tell us about your project</h2>
          <p className="mt-3 text-muted">
            Describe the problem you're trying to solve. We'll come back to you within one working day with an honest assessment and a suggested next step.
          </p>
          <Link
            to={{ pathname: "/", hash: "contact" }}
            className="btn btn-primary mt-6 inline-flex justify-center"
          >
            Start a conversation <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
