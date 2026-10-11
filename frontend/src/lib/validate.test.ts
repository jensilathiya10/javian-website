import { validateContact } from "./validate";

const ok = { name: "Ada Lovelace", email: "ada@example.com", service: "web", message: "A sufficiently long project description." };

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    expect(validateContact(ok)).toEqual({});
  });
  it("treats service as optional", () => {
    expect(validateContact({ ...ok, service: "" })).toEqual({});
  });
  it("validates phone only when provided", () => {
    expect(validateContact({ ...ok, phone: "" })).toEqual({});
    expect(validateContact({ ...ok, phone: "+1 (555) 010-9999" })).toEqual({});
    expect(Object.keys(validateContact({ ...ok, phone: "abc" }))).toEqual(["phone"]);
  });
  it("flags every invalid required field", () => {
    const e = validateContact({ name: "", email: "bad", service: "", message: "short" });
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name"]);
  });
});
