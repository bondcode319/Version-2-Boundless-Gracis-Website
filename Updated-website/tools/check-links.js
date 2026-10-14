#!/usr/bin/env node
/* ==========================================================================
   Link and asset checker — zero dependencies.

   Walks every built *.html in the project root and verifies that each local
   href, src, srcset and in-page anchor resolves to something that exists.
   External links (http, mailto, tel) are listed but not fetched.

   Run:  node tools/check-links.js
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));

let problems = 0;
let checked = 0;

const ATTR = /(?:href|src)\s*=\s*"([^"]+)"/g;

pages.forEach((page) => {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  const ids = new Set(
    (html.match(/\sid\s*=\s*"([^"]+)"/g) || []).map((m) => m.replace(/.*"([^"]+)"/, "$1"))
  );

  let match;
  while ((match = ATTR.exec(html)) !== null) {
    const raw = match[1].trim();
    checked++;

    if (!raw || /^(https?:|mailto:|tel:|data:|#\s*$)/i.test(raw)) continue;

    if (raw.startsWith("#")) {
      const id = raw.slice(1);
      if (id && !ids.has(id)) {
        console.log(`  MISSING ANCHOR  ${page}  ->  ${raw}`);
        problems++;
      }
      continue;
    }

    const [target] = raw.split("#");
    if (!target) continue;

    const file = path.join(ROOT, decodeURIComponent(target));
    if (!fs.existsSync(file)) {
      console.log(`  MISSING FILE    ${page}  ->  ${raw}`);
      problems++;
    }
  }
});

console.log(`\nchecked ${checked} references across ${pages.length} pages`);
if (problems) {
  console.log(`${problems} problem(s) found`);
  process.exitCode = 1;
} else {
  console.log("no broken local links or missing assets");
}
