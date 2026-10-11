import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { CONTACT_EMAIL } from "../lib/content";

export default function Privacy() {
  useDocumentMeta("Privacy policy — Javian Technologies");
  return (
    <article className="container-x max-w-3xl pt-28 pb-24 md:pt-36">
      <p className="eyebrow !text-accent">Legal</p>
      <h1 className="display mt-4 text-5xl md:text-6xl">Privacy policy</h1>
      <p className="mt-6 border border-line-strong p-4 text-sm text-muted">
        Draft for review: confirm the wording, the legal entity name and the contact details with your legal adviser
        before launch.
      </p>
      <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink">
        <section>
          <h2>What we collect</h2>
          <p>
            When you submit the project inquiry form we collect the details you enter: your name, email address,
            optional company, optional phone number, service of interest, optional budget range and your project description.
          </p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>
            We use this information only to read and respond to your inquiry.
          </p>
        </section>
        <section>
          <h2>Storage and access</h2>
          <p>Inquiries are delivered to our email inbox through Formspree, a hosted form service that processes the submission on our behalf. They are not published anywhere. We do not run our own database of inquiries.</p>
        </section>
        <section>
          <h2>Cookies and tracking</h2>
          <p>This website does not currently use advertising cookies or third-party analytics.</p>
        </section>
        <section>
          <h2>Your requests</h2>
          <p>
            To ask what we hold about you or to have it deleted,{" "}
            {CONTACT_EMAIL ? (
              <>
                email <a className="text-ink underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </>
            ) : (
              "contact us through the inquiry form (a dedicated privacy email address will be published here)."
            )}
          </p>
        </section>
      </div>
    </article>
  );
}
