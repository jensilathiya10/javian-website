import { validateContact } from "./validate";

const ok = { name: "Ada Lovelace", email: "ada@example.com", service: "web", message: "A sufficiently long project description." };

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    expect(validateContact(ok)).toEqual({});
  });
  it("treats service as optional", () => {
    expect(validateContact({ ...ok, service: "" })).toEqual({});
  });
  it("flags every invalid required field", () => {
    const e = validateContact({ name: "", email: "bad", service: "", message: "short" });
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name"]);
  });
});
