/**
 * Converts public/og.svg → public/og.png at build time.
 * Run: node scripts/generate-og.mjs  (or via `npm run og`)
 * Also runs automatically as part of `npm run build`.
 */
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/og.svg");
const pngPath = resolve(__dirname, "../public/og.png");

const svg = readFileSync(svgPath);
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
});
const png = resvg.render().asPng();
writeFileSync(pngPath, png);
console.log("og.png generated →", pngPath);
