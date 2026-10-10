import { fireEvent, render, screen } from "@testing-library/react";
import { Carousel } from "./Carousel";

// jsdom has no layout: fake a 300px viewport over four 90px cards placed every 100px (scrollWidth 400).
const scrollTo = vi.fn();
const defs: Array<[string, PropertyDescriptor | undefined]> = [];
function stub(name: string, get: (this: HTMLElement) => number) {
  defs.push([name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)]);
  Object.defineProperty(HTMLElement.prototype, name, { configurable: true, get });
}

beforeEach(() => {
  scrollTo.mockClear();
  HTMLElement.prototype.scrollTo = scrollTo as unknown as typeof HTMLElement.prototype.scrollTo;
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  stub("clientWidth", () => 300);
  stub("scrollWidth", () => 400);
  stub("offsetWidth", () => 90);
  stub("offsetLeft", function () {
    return this.classList.contains("car-item") ? Array.from(this.parentElement!.children).indexOf(this) * 100 : 0;
  });
});
afterEach(() => {
  for (const [name, d] of defs.splice(0)) d ? Object.defineProperty(HTMLElement.prototype, name, d) : delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name];
});

const setup = () =>
  render(
    <Carousel count={4} label="Demo" indicator="dots" dotLabels={["one", "two", "three", "four"]} renderItem={(i) => <div>Card {i + 1}</div>} />,
  );

it("renders every card and starts at the first with Previous disabled", () => {
  setup();
  for (let i = 1; i <= 4; i++) expect(screen.getByText(`Card ${i}`)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("button", { name: "Next" })).toHaveAttribute("aria-disabled", "false");
});

it("Next, dots and arrow keys scroll to real positions; Previous at the start does nothing", () => {
  setup();
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(scrollTo).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(scrollTo).toHaveBeenLastCalledWith({ left: 100, behavior: "smooth" });
  fireEvent.click(screen.getByRole("button", { name: "Go to three" }));
  // card 3 sits at 200 but the track can only scroll to 100 (400 - 300): clamped, not overshooting
  expect(scrollTo).toHaveBeenLastCalledWith({ left: 100, behavior: "smooth" });
  fireEvent.keyDown(document.querySelector(".car-track")!, { key: "ArrowRight" });
  expect(scrollTo).toHaveBeenCalledTimes(3);
});
