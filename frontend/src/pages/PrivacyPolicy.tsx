import { Link } from "react-router-dom";
import { LegalLayout, LegalSectionBlock as S, Ph, Tag } from "../components/LegalLayout";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { CONTACT_EMAIL } from "../lib/content";
import { LEGAL } from "../lib/legal";

const SECTIONS = [
  { id: "scope", title: "Introduction and scope" },
  { id: "legal-status", title: "Indian law and its status" },
  { id: "collect", title: "Information we collect" },
  { id: "purposes", title: "Why we use it" },
  { id: "form-provider", title: "How the contact form is processed" },
  { id: "cookies", title: "Cookies and tracking" },
  { id: "sharing", title: "Service providers and sharing" },
  { id: "retention", title: "Retention and deletion" },
  { id: "safeguards", title: "Security safeguards" },
  { id: "rights", title: "Your rights and grievances" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Effective date and contact" },
] as const;

export default function PrivacyPolicy() {
  // noindex until the [PLACEHOLDER: …] values in src/lib/legal.ts are replaced with real content.
  useDocumentMeta(
    "Privacy Policy — Javian Technologies",
    "How Javian Technologies handles personal information submitted through this website, written for visitors and businesses in India.",
    "https://javiantech.com/privacy-policy",
    true,
  );
  const mail = CONTACT_EMAIL ?? LEGAL.privacyEmail;
  return (
    <LegalLayout
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="This policy explains what personal information Javian Technologies collects through this website, why, who processes it, and how you can reach us about it. It is written for visitors and businesses in India."
      notice={
        <>
          <strong className="text-amber-100">Draft, not legal advice.</strong> Items marked{" "}
          <Ph>[PLACEHOLDER: …]</Ph> are details the company still has to supply. Items tagged{" "}
          <Tag kind="todo" /> are not yet in place. Publishing this page alone does not make the company compliant
          with any law. Have it reviewed by a qualified Indian lawyer before launch.
        </>
      }
      sections={SECTIONS}
    >
      <S id="scope" n={1} title="Introduction and scope">
        <p>
          This website is operated by <Ph>{LEGAL.entity}</Ph> (“Javian Technologies”, “we”, “us”), registered at{" "}
          <Ph>{LEGAL.address}</Ph>. It presents our software, business-systems and AI services and lets visitors send
          us a project inquiry.
        </p>
        <p>
          This policy covers personal information handled through this website only. It is written for people and
          businesses in India. If we serve customers elsewhere, additional jurisdiction-specific terms may be needed;
          this policy does not address them. Client projects are covered by their own agreements.
        </p>
      </S>

      <S id="legal-status" n={2} title="Indian law and its status">
        <p>
          <Tag kind="legal" />
          The Digital Personal Data Protection Act, 2023 (“DPDP Act”) is India's data-protection statute. The Digital
          Personal Data Protection Rules, 2025 were notified on 13 November 2025 and bring the Act into force in
          stages: the provisions on the Data Protection Board took effect on notification, the consent-manager
          framework is due on 13 November 2026, and the main duties of organisations that decide why and how personal
          data is processed (“data fiduciaries”), such as notice, consent, safeguards, breach reporting and handling
          of individuals' rights, are due on 13 May 2027.
        </p>
        <p>
          <Tag kind="legal" />
          As of the date this draft was written, those main duties are not yet enforceable. We nonetheless aim to
          follow their spirit now: tell you clearly what we collect and why, collect only what we need, and respond to
          your requests. Where we describe something as a legal obligation, it is the company's reading of the law and
          must be confirmed against the official Gazette notifications before publication.
        </p>
        <p>
          <Tag kind="legal" />
          Until the DPDP Act's main provisions apply, the Information Technology Act, 2000 and rules made under it
          (including the 2011 rules on reasonable security practices for sensitive personal data) may continue to
          apply to us. Confirm the position with your legal adviser.
        </p>
      </S>

      <S id="collect" n={3} title="Information we collect">
        <p>
          <Tag kind="current" />
          We collect only what you choose to type into the project inquiry form:
        </p>
        <ul>
          <li><strong>Required:</strong> your name, your email address and a description of your project.</li>
          <li><strong>Optional:</strong> company name, phone number, the service you are interested in, and an approximate budget range.</li>
        </ul>
        <p>
          <Tag kind="current" />
          Our own website does not run accounts, payments or analytics, and it does not ask for government
          identifiers, financial details or other sensitive information. Please do not include them in your message.
        </p>
        <p>
          Your web browser also sends ordinary technical data (such as IP address and browser type) to whichever
          servers deliver the site and process the form. We do not combine this with other data to profile you.
        </p>
      </S>

      <S id="purposes" n={4} title="Why we use it">
        <p>
          <Tag kind="current" />
          We use your details to read your inquiry, reply to you, discuss and scope a possible project, and keep a
          record of that conversation. We do not use them for unrelated marketing, and we do not sell them.
        </p>
        <p>
          <Tag kind="todo" />
          The form currently points to this policy but does not ask for a separate, explicit consent action. Before
          launch, decide with your legal adviser whether to add a short consent statement next to the submit button.
        </p>
      </S>

      <S id="form-provider" n={5} title="How the contact form is processed">
        <p>
          <Tag kind="current" />
          The website has no server or database of our own. When you submit the form, your browser sends the details
          directly to Formspree, a hosted form service we use, which delivers them to our email inbox. Formspree
          therefore processes your submission on our behalf and may store it in its own systems and process technical
          data such as IP address and time of submission, under its own terms and privacy policy.
        </p>
        <p>
          <Tag kind="legal" />
          Formspree is operated outside India, so submitting the form can send your information abroad. Confirm
          Formspree's location and terms and describe them accurately here before launch.
        </p>
        <p>
          <Tag kind="todo" />
          The form is configured only once the company creates a Formspree account and adds its endpoint. Until then
          the form shows a “not configured” message and nothing is sent.
        </p>
      </S>

      <S id="cookies" n={6} title="Cookies and tracking">
        <p>
          <Tag kind="current" />
          As built, this website does not set cookies, does not use browser storage to track you, and does not load
          advertising or analytics scripts. Its fonts are served from the website itself, not from a third-party font
          service. For that reason we show no cookie banner.
        </p>
        <p>
          <Tag kind="todo" />
          If analytics, embedded media or other third-party tools are added later, update this section and review
          whether a consent mechanism is then needed.
        </p>
      </S>

      <S id="sharing" n={7} title="Service providers and sharing">
        <p>We share personal information only with providers that help us run the website and handle inquiries:</p>
        <ul>
          <li><strong>Formspree</strong>, for receiving and relaying contact-form submissions (see section 5).</li>
          <li><strong>Our email provider</strong>, where inquiries arrive and replies are sent. <Ph>[PLACEHOLDER: email provider name]</Ph></li>
          <li><strong>Our hosting provider</strong>, which delivers the website to your browser. <Ph>{LEGAL.hosting}</Ph></li>
        </ul>
        <p>
          We may also disclose information where the law requires it, for example to a court or authority in India.
          We do not sell personal information.
        </p>
        <p>
          <Tag kind="todo" />
          Confirm each provider's data-processing terms and list any others the company adds.
        </p>
      </S>

      <S id="retention" n={8} title="Retention and deletion">
        <p>
          <Tag kind="todo" />
          We keep an inquiry only as long as needed to respond and to keep a reasonable record of the conversation.
          The company has not yet fixed a retention period: <Ph>{LEGAL.retention}</Ph>. Copies may exist in our email
          inbox and in Formspree's submission records, so deletion has to cover both.
        </p>
        <p>
          You can ask us to delete your inquiry at any time using the contact details in section 13. We will delete it
          from systems we control and from the form provider where we are able to, unless we must keep it to meet a
          legal obligation.
        </p>
      </S>

      <S id="safeguards" n={9} title="Security safeguards">
        <p>
          <Tag kind="current" />
          The website needs no login and stores no inquiries itself, which limits what can be exposed. Form
          submissions travel over an encrypted connection when the site is served over HTTPS. Our{" "}
          <Link to="/security">Security page</Link> describes what we do and what is still being put in place.
        </p>
        <p>
          No method of transmission or storage is perfectly secure, so we cannot promise absolute security.
        </p>
      </S>

      <S id="rights" n={10} title="Your rights and grievances">
        <p>
          <Tag kind="legal" />
          Under the DPDP Act, once its relevant provisions apply, an individual (“data principal”) can ask for a
          summary of the personal data we process and the parties we share it with, ask us to correct, complete,
          update or erase it, use our grievance process, and nominate someone to exercise these rights on their
          behalf if they die or become unable to.
        </p>
        <p>
          <Tag kind="current" />
          You do not have to wait for those dates. Write to the contact below with the email address you used on the
          form and say what you want. We may ask you to confirm it is really you. Grievance contact:{" "}
          <Ph>{LEGAL.grievanceOfficer}</Ph>. We aim to reply within <Ph>{LEGAL.grievanceResponseTime}</Ph>.
        </p>
        <p>
          <Tag kind="legal" />
          If you remain dissatisfied once the Act's provisions apply, you may complain to the Data Protection Board
          of India. Please contact us first.
        </p>
      </S>

      <S id="children" n={11} title="Children">
        <p>
          <Tag kind="current" />
          Our services are for businesses. This website is not directed at children, and we do not knowingly collect
          personal information from anyone under 18. If you believe a child has sent us information, contact us and
          we will delete it.
        </p>
      </S>

      <S id="changes" n={12} title="Changes to this policy">
        <p>
          We will update this page when our practices or the law change and will revise the “last updated” date at the
          top. If we make a material change, we will make it clear on this page.
        </p>
      </S>

      <S id="contact" n={13} title="Effective date and contact">
        <p>
          <strong>Effective date:</strong> <Ph>{LEGAL.effectiveDate}</Ph>
        </p>
        <ul>
          <li><strong>Entity:</strong> <Ph>{LEGAL.entity}</Ph></li>
          <li><strong>Address:</strong> <Ph>{LEGAL.address}</Ph></li>
          <li>
            <strong>Privacy requests:</strong>{" "}
            {CONTACT_EMAIL ? <a href={`mailto:${mail}`}>{mail}</a> : <Ph>{LEGAL.privacyEmail}</Ph>}
          </li>
          <li><strong>Grievance contact:</strong> <Ph>{LEGAL.grievanceOfficer}</Ph></li>
        </ul>
        <p>
          You can also reach us through the <Link to={{ pathname: "/", hash: "contact" }}>inquiry form</Link>.
        </p>
      </S>
    </LegalLayout>
  );
}
