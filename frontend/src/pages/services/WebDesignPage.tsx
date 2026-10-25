import { Link } from "react-router-dom";
import { Reveal } from "../../components/Reveal";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useJsonLd } from "../../hooks/useJsonLd";

const FAQS = [
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

export default function WebDesignPage() {
  useDocumentMeta(
    "Web Design & Development Services in India — Javian Technologies",
    "Custom websites, e-commerce stores and web applications built for Indian businesses. Fast, accessible and optimised for search.",
    "https://javiantech.com/services/web-design-development",
  );
  useJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://javiantech.com/services/web-design-development",
        "name": "Web Design & Development Services in India — Javian Technologies",
        "description": "Custom websites, e-commerce stores and web applications built for Indian businesses.",
        "url": "https://javiantech.com/services/web-design-development",
        "isPartOf": { "@id": "https://javiantech.com/#website" },
      },
      {
        "@type": "Service",
        "name": "Web Design and Development",
        "provider": { "@id": "https://javiantech.com/#organization" },
        "areaServed": "IN",
        "description": "Custom websites, e-commerce storefronts, dashboards and modern web applications designed and engineered for businesses in India.",
        "serviceType": "Web Development",
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
        <p className="eyebrow mb-4">Service · 01</p>
        <h1 className="display text-[clamp(2rem,5vw,3.6rem)] leading-tight">
          Web Design &amp;{" "}
          <span className="grad-text">Development</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          Custom websites, e-commerce stores and web applications built for growing businesses in India. Every project is designed with performance, accessibility and search visibility in mind — from first wireframe to production deployment.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">What we build</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Marketing & corporate websites", "Polished, fast websites that communicate your brand clearly and convert visitors into inquiries."],
            ["E-commerce storefronts", "Online shops with smooth checkout, inventory management and payment gateway integration suited to Indian buyers."],
            ["Dashboards & portals", "Authenticated web apps for teams, partners or customers — custom-built to fit your workflow."],
            ["Performance & accessibility work", "Audit, improve and maintain an existing site for speed, Core Web Vitals and WCAG compliance."],
          ].map(([title, body]) => (
            <div key={title} className="panel p-6">
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Our approach</h2>
        <p className="mt-4 leading-relaxed text-muted">
          We don't use page builders or generic themes. Every site we deliver is engineered from first principles using React and TypeScript, giving you a codebase you own and a site that can evolve with your business. We obsess over load times — a fast site on Indian mobile networks is a business advantage, not a nice-to-have.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Design and development happen in the same team. That means fewer handoff problems, shorter feedback loops and a final product where the interaction and the code agree. From discovery workshops to deployment, you deal with one team and one point of contact throughout.
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Technology we work with</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {["React", "TypeScript", "Next.js / Vite", "Tailwind CSS", "Headless CMS", "Shopify", "PostgreSQL", "Vercel / AWS", "Figma"].map((t) => (
            <li key={t} className="rounded-full border border-line-strong bg-indigo/40 px-4 py-1.5 text-sm font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-14">
        <h2 className="display text-2xl">Related work</h2>
        <p className="mt-4 text-muted">
          Our web projects include{" "}
          <Link to="/work/cafe-linde" className="text-accent underline underline-offset-4 hover:text-cyan">
            Café Linde
          </Link>
          {" "}— a dark-themed restaurant site with table reservations;{" "}
          <Link to="/work/brew-bloom" className="text-accent underline underline-offset-4 hover:text-cyan">
            Brew &amp; Bloom
          </Link>
          {" "}— a coffee and plant shop with integrated ordering; and{" "}
          <Link to="/work/studio-x" className="text-accent underline underline-offset-4 hover:text-cyan">
            Studio X
          </Link>
          {" "}— a bold portfolio for a photography and film studio.
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
          <h2 className="display text-2xl">Start your web project</h2>
          <p className="mt-3 text-muted">
            Tell us about your business and what you want to build. We'll reply within one working day with thoughts on scope and next steps.
          </p>
          <Link
            to={{ pathname: "/", hash: "contact" }}
            className="btn btn-primary mt-6 inline-flex justify-center"
          >
            Get in touch <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </article>
  );
}
