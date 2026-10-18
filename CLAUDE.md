# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `frontend/` directory:

```bash
npm run dev       # dev server at http://localhost:5173
npm test          # run tests once (vitest run)
npm run build     # tsc type-check + vite build → frontend/dist
npm run preview   # serve the built dist locally
```

To run a single test file:
```bash
npx vitest run src/components/Carousel.test.tsx
```

## Environment

Copy `frontend/.env.example` to `frontend/.env.local` before running locally. Two variables:
- `VITE_FORMSPREE_ENDPOINT` — required for the contact form (e.g. `https://formspree.io/f/xxxxxxxx`)
- `VITE_CONTACT_EMAIL` — optional; shows a fallback email link in the contact section

## Architecture

**Frontend-only** React + Vite + TypeScript + Tailwind CSS v4. No backend or database. The contact form POSTs to Formspree.

### Directory layout

```
frontend/src/
  sections/      # Major page sections rendered by Home.tsx (Hero, Services, Solutions, AI, Work, Process, About, Founders, Contact)
  components/    # Shared UI (Navbar, Footer, Carousel, RingCarousel, Reveal, JourneyBar, LegalLayout, …)
  pages/         # Route components: Home, ProjectPage, PrivacyPolicy, Security, NotFound
  lib/           # Content data and utilities
  hooks/         # Custom React hooks
  types/         # Shared TypeScript types (Project, ContactPayload, FieldErrors)
```

### Content is centralised in `src/lib/`

- **`content.ts`** — all copy and site data: `NAV`, `SERVICES`, `MODULES`, `AI_FLOW`, `PROCESS`, `PRINCIPLES`, `TECH`, `BUDGETS`. Edit this file to change text rather than hunting through section components.
- **`projects.ts`** — `FALLBACK_PROJECTS` array; replace with real client work when available.
- **`legal.ts`** — `LEGAL` object whose values are `[PLACEHOLDER: …]` strings. Search for `PLACEHOLDER` to find everything still open before launch.
- **`contact.ts`** — Formspree submission logic (`submitContact`).
- **`validate.ts`** — contact form field validation.

### Routing

React Router v7. `App.tsx` defines all routes:
- `/` → `Home` (all sections)
- `/work/:slug` → `ProjectPage` (lazy)
- `/privacy-policy` → `PrivacyPolicy` (lazy)
- `/security` → `Security` (lazy)
- `*` → `NotFound` (lazy)

### Scroll reveal pattern

Elements are hidden by CSS class `.reveal` (requires `html.js` to be set, which `main.tsx` does on load). `useReveal` hook attaches an `IntersectionObserver` and adds `.in` when the element enters the viewport. The `<Reveal>` component wraps this for convenience. `useActiveSection` tracks which section is currently in view for the navbar highlight.

### Design tokens

All colours and fonts are defined as CSS custom properties in `src/index.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#080b1a` | Page background |
| `--color-violet` | `#8057ff` | Primary brand colour |
| `--color-cyan` / `--color-accent` | `#35d9ff` | Accent / focus / glow |
| `--color-ink` | `#f7f8ff` | Body text |
| `--color-muted` | `#a5abc5` | Eyebrow / secondary text |
| `--font-sans` | Manrope Variable | Body |
| `--font-mono` | JetBrains Mono Variable | Eyebrow labels |

Reusable CSS utility classes (defined in `index.css`): `.btn`, `.btn-primary`, `.btn-ghost`, `.panel`, `.reveal`, `.eyebrow`, `.grad-text`, `.container-x`, `.field`, `.hairline`.

### Testing

Vitest + jsdom + `@testing-library/react`. Setup file: `src/test-setup.ts`. Test files live alongside source (`*.test.tsx` / `*.test.ts`).
