import type { ContactPayload, FieldErrors } from "../types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactPayload): FieldErrors {
  const e: FieldErrors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.service) e.service = "Please choose a service.";
  const len = v.message.trim().length;
  if (len < 20) e.message = "Please describe your project in at least 20 characters.";
  else if (len > 4000) e.message = "Please keep the description under 4000 characters.";
  return e;
}
