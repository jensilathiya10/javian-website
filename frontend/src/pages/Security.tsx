import { Link } from "react-router-dom";
import { LegalLayout, LegalSectionBlock as S, Ph, Tag } from "../components/LegalLayout";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { LEGAL } from "../lib/legal";

const SECTIONS = [
  { id: "principles", title: "Security principles" },
  { id: "access", title: "Access control" },
  { id: "secrets", title: "Credentials and secrets" },
  { id: "encryption", title: "Encryption" },
  { id: "dependencies", title: "Dependencies and updates" },
  { id: "testing", title: "Code review and testing" },
  { id: "deployment", title: "Secure deployment" },
  { id: "minimization", title: "Data minimization" },
  { id: "incidents", title: "Incident response" },
  { id: "disclosure", title: "Responsible disclosure" },
  { id: "contact", title: "Security contact" },
] as const;

export default function Security() {
  useDocumentMeta(
    "Security — Javian Technologies",
    "How Javian Technologies approaches security for this website and the software it builds, including what is in place today and what is still planned.",
  );
  return (
    <LegalLayout
      eyebrow="Security"
      title="Security"
      intro="How we approach protecting information and building secure software. We separate what is in place today from what we intend to do, so nothing here overstates our position."
      notice={
        <>
          <strong className="text-amber-100">Draft for company confirmation.</strong> Statements tagged{" "}
          <Tag kind="current" /> describe how this website is built today. Statements tagged{" "}
          <Tag kind="todo" /> are intended practices that must be confirmed or put in place before they are published
          as fact. We hold no security certification and have not claimed any. Items marked{" "}
          <Ph>[PLACEHOLDER: …]</Ph> need real company details.
        </>
      }
      sections={SECTIONS}
    >
      <S id="principles" n={1} title="Security principles">
        <p>
          <Tag kind="current" />
          This website is deliberately small: static pages with no user accounts, no database of our own and no server
          code we operate. Fewer moving parts means fewer things that can fail or be attacked.
        </p>
        <p>
          <Tag kind="todo" />
          For client work we intend to apply secure-by-design habits: decide what must be protected early, collect
          only what is needed, validate input on the server side, and default to the safer choice. Describe the
          practices you actually follow in client engagements here before publishing.
        </p>
      </S>

      <S id="access" n={2} title="Access control">
        <p>
          <Tag kind="current" />
          The website has no administrative login or back office to protect. Content changes go through the source
          repository and deployment, not through a web-based admin.
        </p>
        <p>
          <Tag kind="todo" />
          Intended: least-privilege access to the code repository, hosting account, form-service account and email
          inbox, with multi-factor authentication switched on and access removed when someone leaves. Confirm each
          is enabled before stating it.
        </p>
      </S>

      <S id="secrets" n={3} title="Credentials and secrets">
        <p>
          <Tag kind="current" />
          The browser code contains no passwords, private API keys or email credentials. The only configuration it
          holds is the public form endpoint, which is designed to be public. Local environment files are excluded
          from version control.
        </p>
        <p>
          <Tag kind="todo" />
          Intended: keep secrets in the hosting provider's environment settings, never in the repository, and rotate
          them if exposure is suspected.
        </p>
      </S>

      <S id="encryption" n={4} title="Encryption">
        <p>
          <Tag kind="todo" />
          In transit: the site and the form submission are intended to be served only over HTTPS. This depends on the
          deployment, so confirm HTTPS is enforced at <Ph>{LEGAL.hosting}</Ph> and that the form endpoint is
          HTTPS.
        </p>
        <p>
          <Tag kind="current" />
          At rest: we do not run a database or file store of our own. Inquiries sit in our email account and in the
          form provider's records. We have not independently verified how those providers encrypt stored data, so we
          make no claim about encryption at rest.
        </p>
      </S>

      <S id="dependencies" n={5} title="Dependencies and updates">
        <p>
          <Tag kind="current" />
          Third-party packages are locked to exact versions in the repository's lockfile, so builds are repeatable.
          The site uses a small set of well-known open-source libraries and no third-party scripts at runtime.
        </p>
        <p>
          <Tag kind="todo" />
          Intended: regularly check dependencies for known vulnerabilities and apply security updates promptly. No
          automated scanning or fixed schedule is set up yet; decide on one (for example automated dependency alerts)
          and describe it accurately.
        </p>
      </S>

      <S id="testing" n={6} title="Code review and testing">
        <p>
          <Tag kind="current" />
          The project has automated tests for the contact form's validation, loading, success and error behaviour, and
          a type-check and production build that must pass before release. The form sends a hidden spam-trap field and
          shows success only when the form service confirms it accepted the message.
        </p>
        <p>
          <Tag kind="todo" />
          Intended: peer review of changes and prompt remediation of reported vulnerabilities. No formal review
          process, penetration test or external security audit has been carried out, and we do not claim one.
        </p>
      </S>

      <S id="deployment" n={7} title="Secure deployment">
        <p>
          <Tag kind="current" />
          The site is built to static files and ships with basic protective response headers configured for the
          host (no content-type sniffing, and a restricted referrer policy). Hashed asset files are cached for
          performance only.
        </p>
        <p>
          <Tag kind="todo" />
          Not yet configured: a Content Security Policy and further hardening headers. Consider adding them after
          testing that they do not break the site.
        </p>
      </S>

      <S id="minimization" n={8} title="Data minimization">
        <p>
          <Tag kind="current" />
          The form asks for the minimum needed to answer an inquiry; most fields are optional, and the site uses no
          cookies or tracking. See the <Link to="/privacy-policy">Privacy Policy</Link> for what we collect and how
          long we plan to keep it.
        </p>
      </S>

      <S id="incidents" n={9} title="Incident response">
        <p>
          <Tag kind="todo" />
          We have no written incident-response plan yet. The intended approach: contain the problem, find what was
          affected, fix the cause, tell the people affected, and record what we learned. Write and test a short plan
          before describing it as in place.
        </p>
        <p>
          <Tag kind="legal" />
          India's CERT-In directions of 2022 require certain organisations to report specified cyber incidents to
          CERT-In within a short window (currently stated as six hours). Whether and how this applies to the company is
          for your legal adviser to confirm. Separately, the DPDP Rules' breach-notification duties are due from 13 May
          2027.
        </p>
      </S>

      <S id="disclosure" n={10} title="Responsible disclosure">
        <p>
          If you believe you have found a security weakness in this website, please tell us before sharing it
          publicly. Include what you found, where, and the steps to reproduce it. Please:
        </p>
        <ul>
          <li>do not access, change or delete anyone else's data;</li>
          <li>do not run denial-of-service, spam or social-engineering attacks;</li>
          <li>give us a reasonable time to fix the issue before disclosure.</li>
        </ul>
        <p>
          <Tag kind="todo" />
          The company must decide and state its commitments: how quickly it will acknowledge reports (
          <Ph>[PLACEHOLDER: acknowledgement time]</Ph>), whether it offers any recognition, and any legal safe-harbour
          wording reviewed by counsel. This page does not promise a bounty or immunity.
        </p>
      </S>

      <S id="contact" n={11} title="Security contact">
        <ul>
          <li><strong>Report a vulnerability:</strong> <Ph>{LEGAL.securityEmail}</Ph></li>
          <li><strong>Privacy requests:</strong> see the <Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><strong>General inquiries:</strong> <Link to={{ pathname: "/", hash: "contact" }}>contact form</Link></li>
        </ul>
        <p>Please do not send sensitive personal data or secrets in an initial report.</p>
      </S>
    </LegalLayout>
  );
}
