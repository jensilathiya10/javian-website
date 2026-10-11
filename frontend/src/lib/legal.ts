/**
 * Company details the legal pages cannot invent. Every value here is shown on the page as a
 * highlighted "[PLACEHOLDER: …]" until you replace it with the real value. Search the codebase
 * for "PLACEHOLDER" to find everything still open before launch.
 */
const ph = (what: string) => `[PLACEHOLDER: ${what}]`;

export const LEGAL = {
  entity: ph("registered legal entity name"),
  address: ph("registered office address in India"),
  privacyEmail: ph("privacy contact email"),
  securityEmail: ph("security reporting email"),
  grievanceOfficer: ph("name and designation of grievance contact"),
  grievanceResponseTime: ph("committed response time, e.g. number of days"),
  retention: ph("retention period for inquiries, decided by the company"),
  hosting: ph("hosting provider and region, confirm at deployment"),
  effectiveDate: ph("effective date, set when the policy is published"),
} as const;

/** Date this draft text was last revised. Update it whenever the wording changes. */
export const LEGAL_LAST_UPDATED = "11 October 2026";

export const isPlaceholder = (v: string) => v.startsWith("[PLACEHOLDER");
