import { validateContact } from "./validate";

const ok = { name: "Ada Lovelace", email: "ada@example.com", service: "web", message: "A sufficiently long project description." };

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    expect(validateContact(ok)).toEqual({});
  });
  it("flags every invalid field", () => {
    const e = validateContact({ name: "", email: "bad", service: "", message: "short" });
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name", "service"]);
  });
});
