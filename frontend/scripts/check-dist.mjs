/**
 * Post-build validation: fails the build if any dist HTML file has a
 * duplicate title, duplicate description, or a canonical that is not its own URL.
 *
 * Run after prerender.mjs: node scripts/check-dist.mjs
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, "../dist");

function getHtmlFiles(dir, base = "") {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      files.push(...getHtmlFiles(full, rel));
    } else if (entry === "index.html") {
      files.push({ full, rel: base ? `/${base}/` : "/" });
    }
  }
  return files;
}

function extractTag(html, pattern) {
  const m = html.match(pattern);
  return m ? m[1] : null;
}

const files = getHtmlFiles(distDir);
const errors = [];
const titles = new Map();
const descs = new Map();

for (const { full, rel } of files) {
  const html = readFileSync(full, "utf-8");

  const title = extractTag(html, /<title>([^<]*)<\/title>/);
  const desc = extractTag(html, /<meta\s+name="description"\s+content="([^"]*)"/);
  const canonical = extractTag(html, /<link rel="canonical" href="([^"]*)"/);

  if (!title) {
    errors.push(`${rel}: missing <title>`);
  } else {
    const prev = titles.get(title);
    if (prev && prev !== rel) {
      errors.push(`${rel}: duplicate title "${title}" (also on ${prev})`);
    } else {
      titles.set(title, rel);
    }
  }

  if (!desc) {
    errors.push(`${rel}: missing <meta name="description">`);
  } else {
    const prev = descs.get(desc);
    if (prev && prev !== rel) {
      errors.push(`${rel}: duplicate description (also on ${prev})`);
    } else {
      descs.set(desc, rel);
    }
  }

  if (!canonical) {
    errors.push(`${rel}: missing <link rel="canonical">`);
  } else {
    // The canonical URL path should match the route
    const expectedPath = rel === "/" ? "/" : rel.replace(/\/$/, "");
    const canonicalPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
    const relPath = rel.replace(/\/$/, "") || "/";
    if (canonicalPath !== relPath) {
      errors.push(`${rel}: canonical "${canonical}" does not point to itself (expected path "${relPath}")`);
    }
  }
}

if (errors.length > 0) {
  console.error("\ncheck-dist: FAILED\n");
  for (const e of errors) {
    console.error(`  ✗ ${e}`);
  }
  console.error("");
  process.exit(1);
} else {
  console.log(`check-dist: OK — ${files.length} HTML files verified`);
}
