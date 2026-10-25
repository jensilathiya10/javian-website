import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";

const FAQS = [
  {
    q: "What does Javian Technologies build?",
    a: "We build custom business software, websites, mobile applications and AI automation systems. Our work covers the full spectrum: from marketing websites and e-commerce storefronts through to ERP modules, internal tools, SaaS platforms and LLM-powered workflow automation.",
  },
  {
    q: "Do you work with clients across India?",
    a: "Yes — we work with clients across India and remotely. We currently focus on Indian businesses but can take on international projects too. Every project starts with a discovery call regardless of where you are.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused marketing website typically takes 4–8 weeks. A custom business application or ERP module runs 8–20 weeks depending on scope. We define milestones and deliverables upfront so you always know what is happening and when.",
  },
  {
    q: "Do you offer fixed-price projects?",
    a: "Yes. After a short discovery phase we scope the work and provide a fixed-price quote. For ongoing or evolving products we also offer monthly retainers and quarterly sprint arrangements.",
  },
  {
    q: "How do we start a project with Javian?",
    a: "Fill in the contact form on this page or email us at admin@javiantech.com. We'll schedule a short discovery call, understand your requirements and send you a proposal within a few days.",
  },
];

export function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-6 md:py-9">
      <div className="pointer-events-none h-px hairline" aria-hidden />
      <div className="container-x">
        <SectionHead label="FAQ" title={<>Common questions <span className="grad-text">answered.</span></>}>
          Things people ask before starting a project with us.
        </SectionHead>
        <Reveal>
          <dl className="mx-auto max-w-3xl divide-y divide-line">
            {FAQS.map((item, i) => (
              <div key={i}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                    className="flex w-full items-start justify-between gap-4 py-5 text-left text-base font-semibold text-ink hover:text-accent transition-colors"
                  >
                    <span>{item.q}</span>
                    <span className="mt-0.5 shrink-0 text-cyan transition-transform duration-300" style={{ transform: open === i ? "rotate(45deg)" : "none" }} aria-hidden>+</span>
                  </button>
                </dt>
                {open === i && (
                  <dd className="pb-5 text-base leading-relaxed text-muted">
                    {item.a}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
