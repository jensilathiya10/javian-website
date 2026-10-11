import type { ContactPayload, FieldErrors } from "../types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Optional; digits with common separators and an optional leading +.
const PHONE = /^\+?[\d\s().-]{7,20}$/;

export function validateContact(v: ContactPayload): FieldErrors {
  const e: FieldErrors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.phone?.trim() && !PHONE.test(v.phone.trim())) e.phone = "Please enter a valid phone number.";
  const len = v.message.trim().length;
  if (len < 20) e.message = "Please describe your project in at least 20 characters.";
  else if (len > 4000) e.message = "Please keep the description under 4000 characters.";
  return e;
}
