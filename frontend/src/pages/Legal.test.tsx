import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import Security from "./Security";

const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/security" element={<Security />} />
      </Routes>
    </MemoryRouter>,
  );

it.each([
  ["/privacy-policy", "Privacy Policy"],
  ["/security", "Security"],
])("%s renders, shows a date, and every contents link has a target", (path, title) => {
  const { container } = at(path);
  expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
  expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  const links = [...container.querySelectorAll('a[href^="#"]')];
  expect(links.length).toBeGreaterThan(8);
  for (const a of links) {
    expect(container.querySelector(a.getAttribute("href")!)).not.toBeNull();
  }
});

it("flags missing company details as placeholders", () => {
  const { container } = at("/privacy-policy");
  expect(container.querySelectorAll("mark").length).toBeGreaterThan(3);
});

it("redirects the old /privacy URL", () => {
  at("/privacy");
  expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument();
});
