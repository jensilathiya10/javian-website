/**
 * Prerender script: builds an SSR bundle then renders each known route to a
 * static index.html in dist/. Vercel serves these static files directly;
 * the /work/:slug rewrite in vercel.json remains as a fallback for future routes.
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

const { render } = await import(
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
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );
    writeFileSync(resolve(outDir, "index.html"), html, "utf-8");
    console.log(`  ✓ ${route}`);
  } catch (err) {
    console.error(`  ✗ ${route} (${err.message}) — writing bare template`);
    writeFileSync(resolve(outDir, "index.html"), template, "utf-8");
  }
}

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log("Prerender: done.");
