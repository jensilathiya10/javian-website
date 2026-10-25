/**
 * Prerender script: builds an SSR bundle then renders each known route to a
 * static index.html in dist/. Per-route head metadata (title, description,
 * canonical, og:*, twitter:*, JSON-LD) is injected into each file so crawlers
 * see correct values without waiting for JS hydration.
 */
import { build } from "vite";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

const ROUTES = [
  "/",
  "/privacy-policy",
  "/security",
  "/services/web-design-development",
  "/services/custom-software-development",
  "/services/ai-automation",
  "/work/cafe-linde",
  "/work/studio-x",
  "/work/brew-bloom",
  "/work/three-tyres-grocery",
];

/** HTML-escape a string for use in attribute values and text content. */
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Inject per-route head metadata into the HTML template.
 * Replaces title, description, canonical, og:*, twitter:* and appends page JSON-LD.
 */
function injectRouteMeta(html, meta, jsonLd) {
  const { title, description, canonical, noindex } = meta;
  const robots = noindex ? "noindex, follow" : "index, follow";
  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);

  // <meta name="description" ...> — [^>]* stops at the tag boundary; handles multiline tags too
  out = out.replace(
    /<meta[^>]*name="description"[^>]*\/?>/,
    `<meta name="description" content="${esc(description)}" />`,
  );

  // <meta name="robots" ...>
  out = out.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/,
    `<meta name="robots" content="${robots}" />`,
  );

  // <link rel="canonical" ...>
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  // og:url
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonical}" />`,
  );

  // og:title
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${esc(title)}" />`,
  );

  // og:description — [^>]* stops at the tag boundary; handles multiline tags too
  out = out.replace(
    /<meta[^>]*property="og:description"[^>]*\/?>/,
    `<meta property="og:description" content="${esc(description)}" />`,
  );

  // twitter:title
  out = out.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${esc(title)}" />`,
  );

  // twitter:description
  out = out.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  );

  // Inject page-specific JSON-LD before </head>
  if (jsonLd) {
    const ldScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
    out = out.replace("</head>", `${ldScript}\n</head>`);
  }

  return out;
}

console.log("Prerender: building SSR bundle…");
await build({
  root,
  configFile: resolve(root, "vite.config.ts"),
  logLevel: "warn",
  build: {
    ssr: resolve(root, "src/entry-server.tsx"),
    outDir: resolve(root, "dist-ssr"),
    emptyOutDir: true,
    rollupOptions: { output: { format: "esm" } },
  },
});

const { render, getRouteMeta, buildRouteJsonLd } = await import(
  pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href
);

const template = readFileSync(resolve(root, "dist/index.html"), "utf-8");

console.log("Prerender: rendering routes…");
for (const route of ROUTES) {
  const outDir =
    route === "/"
      ? resolve(root, "dist")
      : resolve(root, "dist", route.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });

  try {
    const appHtml = render(route);
    const meta = getRouteMeta(route);
    const jsonLd = buildRouteJsonLd(route);

    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );

    if (meta) {
      html = injectRouteMeta(html, meta, jsonLd);
    }

    writeFileSync(resolve(outDir, "index.html"), html, "utf-8");
    console.log(`  ✓ ${route}`);
  } catch (err) {
    console.error(`  ✗ ${route} (${err.message}) — writing bare template`);
    writeFileSync(resolve(outDir, "index.html"), template, "utf-8");
  }
}

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("Prerender: done.");
