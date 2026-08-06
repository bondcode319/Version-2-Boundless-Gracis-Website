/* Decodes any binary assets captured from the Claude Design project.
   DesignSync returns binaries as base64 inline; outputs over ~30KB are
   auto-persisted to tool-results/*.txt, which keeps them out of the model
   context. This scans those payloads and writes each to assets/ by the
   `path` recorded inside the JSON, so no id-to-filename bookkeeping is
   needed. Idempotent — re-running just overwrites with identical bytes. */
"use strict";
const fs = require("fs");
const path = require("path");

const DIR = process.argv[2];
const DEST = { "photos/": "assets/photos/", "brand/": "assets/brand/", "icons/": "assets/icons/" };

let written = 0, skipped = 0;
for (const name of fs.readdirSync(DIR)) {
  if (!name.endsWith(".txt")) continue;
  let obj;
  try { obj = JSON.parse(fs.readFileSync(path.join(DIR, name), "utf8")); } catch { continue; }
  if (obj.method !== "get_file" || !obj.path || !obj.isBase64) continue;

  const prefix = Object.keys(DEST).find((p) => obj.path.startsWith(p));
  if (!prefix) continue;
  if (obj.truncated) { console.log("TRUNCATED, skipped:", obj.path); skipped++; continue; }

  const out = DEST[prefix] + obj.path.slice(prefix.length);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const buf = Buffer.from(obj.content, "base64");
  const magic = buf.slice(0, 4).toString("hex");
  const ok = magic.startsWith("ffd8") || magic === "89504e47";
  if (!ok) { console.log("BAD MAGIC", out, magic); skipped++; continue; }
  fs.writeFileSync(out, buf);
  written++;
}
console.log(`decoded ${written} assets, ${skipped} skipped`);
