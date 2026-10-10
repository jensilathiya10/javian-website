import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Contact } from "./Contact";

function fill() {
  fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText(/Service type/), { target: { value: "web" } });
  fireEvent.change(screen.getByLabelText(/Project details/), { target: { value: "A sufficiently long project description." } });
}
const renderIt = () => render(<MemoryRouter><Contact /></MemoryRouter>);

afterEach(() => vi.restoreAllMocks());

it("shows validation errors and does not call the API", () => {
  const spy = vi.spyOn(globalThis, "fetch");
  renderIt();
  fireEvent.click(screen.getByRole("button", { name: /Start a Conversation/ }));
  expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();
});

it("shows success only after the backend accepts", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ reference: "JT-000007" }), { status: 201 }));
  renderIt();
  fill();
  fireEvent.click(screen.getByRole("button", { name: /Start a Conversation/ }));
  await waitFor(() => expect(screen.getByText(/JT-000007/)).toBeInTheDocument());
});

it("shows an honest error when the backend is unreachable", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("network"));
  renderIt();
  fill();
  fireEvent.click(screen.getByRole("button", { name: /Start a Conversation/ }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/couldn't reach the server/i));
  expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
});
