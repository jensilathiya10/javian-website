# Javian Technologies website

Frontend-only site: React + Vite + TypeScript + Tailwind. No backend or database. The contact form posts to
[Formspree](https://formspree.io/), which emails each inquiry to us.

## Run locally

```bash
cd frontend
npm install
cp .env.example .env.local      # then fill in the values below
npm run dev                     # http://localhost:5173
```

## Configuration (frontend only)

| Variable | Purpose |
| --- | --- |
| `VITE_FORMSPREE_ENDPOINT` | Your form endpoint, `https://formspree.io/f/<form-id>`. Public by design, not a secret. Without it the form shows a "not configured" error and never claims success. |
| `VITE_CONTACT_EMAIL` | Optional. Shown as a "prefer email?" link; hidden when unset. |

## Set up the contact form

1. Create an account at formspree.io and a new form; set the destination email and verify it.
2. Copy the form endpoint into `VITE_FORMSPREE_ENDPOINT` (locally in `frontend/.env.local`, and in your hosting dashboard's environment variables).
3. In the Formspree dashboard, keep spam filtering on (and enable reCAPTCHA if you want). The form also sends a hidden `_gotcha` honeypot field.
4. Submit a real test inquiry and confirm it arrives in your inbox. Formspree adds the submission time to each email.

## Tests and build

```bash
cd frontend
npm test
npm run build      # outputs frontend/dist
```

## Deploy (Vercel, Netlify, or any static host)

Set the project root to `frontend`, build command `npm run build`, output directory `dist`, and add the environment
variables above. `frontend/vercel.json` already rewrites all routes to `index.html` for client-side routing; on Netlify
add a `/* /index.html 200` redirect.

## Still to configure before launch

- Set `VITE_FORMSPREE_ENDPOINT` and `VITE_CONTACT_EMAIL`.
- Replace `example.com` in `frontend/public/sitemap.xml` and `robots.txt` with the real domain.
- Review `/privacy` with legal counsel (marked as a draft on the page).
- Work items are labeled concepts; replace them in `frontend/src/lib/projects.ts` when real projects are available.
