/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Injects <link rel="preload"> for the primary Manrope latin woff2 after build.
const preloadManrope: Plugin = {
  name: "preload-manrope",
  transformIndexHtml(html, ctx) {
    if (!ctx.bundle) return html;
    const key = Object.keys(ctx.bundle).find(
      (k) => k.includes("manrope-latin-wght-normal") && k.endsWith(".woff2"),
    );
    if (!key) return html;
    const tag = `    <link rel="preload" href="/${key}" as="font" type="font/woff2" crossorigin>\n`;
    return html.replace("</head>", `${tag}  </head>`);
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadManrope],
  // Tailwind runs via its Vite plugin; an inline config stops Vite searching parent folders for PostCSS configs.
  css: { postcss: {} },
  server: {
    port: 5173,
  },
  build: {
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});
