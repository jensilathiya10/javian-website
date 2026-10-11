import "@testing-library/jest-dom/vitest";

// jsdom has no IntersectionObserver; a no-op stand-in is enough for components that only observe visibility.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;
