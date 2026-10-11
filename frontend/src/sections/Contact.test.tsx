import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Contact } from "./Contact";

function fill() {
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText(/Project details/), { target: { value: "A sufficiently long project description." } });
}
const submit = () => fireEvent.click(screen.getByRole("button", { name: /Start a Conversation|Sending/ }));
const renderIt = () => render(<MemoryRouter><Contact /></MemoryRouter>);

beforeEach(() => vi.stubEnv("VITE_FORMSPREE_ENDPOINT", "https://formspree.io/f/test"));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

it("shows validation errors and does not send", () => {
  const spy = vi.spyOn(globalThis, "fetch");
  renderIt();
  submit();
  expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();
});

it("shows loading, blocks duplicates, and succeeds only after Formspree accepts", async () => {
  let resolve!: (r: Response) => void;
  const spy = vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise((r) => (resolve = r)));
  renderIt();
  fill();
  submit();
  await waitFor(() => expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled());
  submit();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
  resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
  await waitFor(() => expect(screen.getByText(/Thank you/)).toBeInTheDocument());
});

it("keeps the form and shows an error when Formspree rejects", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ errors: [{ message: "Form not found" }] }), { status: 404 }));
  renderIt();
  fill();
  submit();
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Form not found/));
  expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
  expect(screen.getByLabelText(/^Name/)).toHaveValue("Ada Lovelace");
});

it("shows a network error and allows retry", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("network"));
  renderIt();
  fill();
  submit();
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/couldn't reach the server/i));
  expect(screen.getByRole("button", { name: /Start a Conversation/ })).toBeEnabled();
});
