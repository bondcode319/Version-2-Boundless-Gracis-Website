#!/usr/bin/env node
/* ==========================================================================
   BGCF link checker — zero dependencies, plain Node.

   Walks every *.html in the project root and, for each href / src / srcset /
   form action it finds:

     - internal target   → must exist on disk AND return 200 from the local
                           server (both, because a file can exist and still be
                           unreachable, and vice versa with a rewrite rule)
     - in-page fragment  → the target id must actually exist in that document
     - bare "#"          → always a failure; a link that goes nowhere is an
                           accessibility and SEO defect
     - external URL      → reported separately with its HTTP status, never
                           counted as an internal failure

   Usage:  node tools/check-links.js [baseUrl]
           node tools/check-links.js http://127.0.0.1:8137

   Exit code 0 only when there are zero internal failures and zero dead
   placeholders.
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || "http://127.0.0.1:8137").replace(/\/$/, "");
const CHECK_EXTERNAL = process.env.SKIP_EXTERNAL !== "1";

/* -------------------------------------------------------------- extraction */

// Attributes that carry a URL we care about.
const ATTR = /\b(href|src|action)\s*=\s*"([^"]*)"/gi;
const SRCSET = /\bsrcset\s*=\s*"([^"]*)"/gi;

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function idsIn(html) {
  const ids = new Set();
  const re = /\bid\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
}

function extract(file, html) {
  const found = [];
  let m;

  ATTR.lastIndex = 0;
  while ((m = ATTR.exec(html))) {
    found.push({ file, line: lineOf(html, m.index), attr: m[1].toLowerCase(), url: m[2].trim() });
  }

  SRCSET.lastIndex = 0;
  while ((m = SRCSET.exec(html))) {
    const line = lineOf(html, m.index);
    m[1].split(",").forEach((part) => {
      const url = part.trim().split(/\s+/)[0];
      if (url) found.push({ file, line, attr: "srcset", url });
    });
  }

  return found;
}

/* ------------------------------------------------------------ classification */

function classify(url) {
  if (url === "") return "empty";
  if (url === "#") return "dead";
  if (url.startsWith("#")) return "fragment";
  if (/^(mailto:|tel:|sms:)/i.test(url)) return "scheme";
  if (/^data:/i.test(url)) return "data";
  if (/^https?:\/\//i.test(url)) return "external";
  if (/^\/\//.test(url)) return "external";
  return "internal";
}

/* ------------------------------------------------------------------ network */

function head(url) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };

    let lib, opts;
    try {
      const u = new URL(url);
      lib = u.protocol === "https:" ? https : http;
      opts = { method: "GET", timeout: 12000 };
    } catch {
      return done({ status: "BAD-URL" });
    }

    const req = lib.request(url, opts, (res) => {
      res.resume();
      done({ status: res.statusCode });
    });
    req.on("timeout", () => { req.destroy(); done({ status: "TIMEOUT" }); });
    req.on("error", (e) => done({ status: e.code || "ERROR" }));
    req.end();
  });
}

/* --------------------------------------------------------------------- main */

async function main() {
  const pages = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort();

  if (!pages.length) {
    console.error("No .html files in project root — run `node build.js` first.");
    process.exit(1);
  }

  const docIds = new Map();
  let refs = [];

  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), "utf8");
    docIds.set(page, idsIn(html));
    refs = refs.concat(extract(page, html));
  }

  const rows = [];
  const externalCache = new Map();

  for (const ref of refs) {
    const kind = classify(ref.url);
    let status = "";
    let ok = true;

    if (kind === "dead" || kind === "empty") {
      status = kind === "dead" ? 'DEAD href="#"' : "EMPTY";
      ok = false;
    } else if (kind === "fragment") {
      const id = decodeURIComponent(ref.url.slice(1));
      const has = docIds.get(ref.file).has(id);
      status = has ? "id ok" : "MISSING id #" + id;
      ok = has;
    } else if (kind === "scheme" || kind === "data") {
      status = "n/a (" + ref.url.split(":")[0] + ")";
    } else if (kind === "internal") {
      const clean = ref.url.split("#")[0].split("?")[0];
      const onDisk = fs.existsSync(path.join(ROOT, decodeURIComponent(clean)));
      const res = await head(BASE + "/" + clean.replace(/^\//, ""));
      const http200 = res.status === 200;
      ok = onDisk && http200;
      status = onDisk
        ? http200 ? "200" : "disk ok / HTTP " + res.status
        : "MISSING ON DISK" + (http200 ? "" : " / HTTP " + res.status);

      // An in-page fragment on an internal link must exist in the target doc.
      const frag = ref.url.split("#")[1];
      if (ok && frag) {
        const target = docIds.get(clean);
        if (target && !target.has(frag)) {
          ok = false;
          status = "200 / MISSING id #" + frag;
        }
      }
    } else if (kind === "external") {
      if (!CHECK_EXTERNAL) {
        status = "skipped";
      } else {
        if (!externalCache.has(ref.url)) externalCache.set(ref.url, await head(ref.url));
        status = String(externalCache.get(ref.url).status);
      }
    }

    rows.push({ ...ref, kind, status, ok });
  }

  /* ------------------------------------------------------------- reporting */

  const internal = rows.filter((r) => r.kind === "internal");
  const fragments = rows.filter((r) => r.kind === "fragment");
  const external = rows.filter((r) => r.kind === "external");
  const schemes = rows.filter((r) => r.kind === "scheme" || r.kind === "data");
  const dead = rows.filter((r) => r.kind === "dead" || r.kind === "empty");
  const failures = rows.filter((r) => !r.ok && r.kind !== "external");

  const pad = (s, n) => String(s).padEnd(n).slice(0, n);
  const table = (list, title) => {
    if (!list.length) return;
    console.log("\n" + title + "  (" + list.length + ")");
    console.log("-".repeat(118));
    console.log(pad("SOURCE", 26) + pad("LINE", 6) + pad("ATTR", 8) + pad("URL", 58) + "STATUS");
    console.log("-".repeat(118));
    list.forEach((r) => {
      console.log(pad(r.file, 26) + pad(r.line, 6) + pad(r.attr, 8) + pad(r.url, 58) + r.status);
    });
  };

  // Unique internal targets keep the table readable; every ref is still checked.
  const seen = new Set();
  const internalUnique = internal.filter((r) => {
    const k = r.file + "|" + r.url;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  table(internalUnique, "INTERNAL (unique per source file)");
  table(fragments.filter((r) => !r.ok), "IN-PAGE FRAGMENTS — FAILURES");
  table(dead, 'DEAD PLACEHOLDERS');
  table(schemes.slice(0, 8), "MAILTO / TEL (sample)");

  const extSeen = new Set();
  table(
    external.filter((r) => {
      if (extSeen.has(r.url)) return false;
      extSeen.add(r.url);
      return true;
    }),
    "EXTERNAL (reported, not counted as internal failures)"
  );

  console.log("\n" + "=".repeat(118));
  console.log("SUMMARY");
  console.log("  pages walked            " + pages.length);
  console.log("  references checked      " + rows.length);
  console.log("  internal refs           " + internal.length + "  (" + internalUnique.length + " unique)");
  console.log("  in-page fragments       " + fragments.length);
  console.log("  mailto/tel/data         " + schemes.length);
  console.log("  external URLs           " + external.length + "  (" + extSeen.size + " unique)");
  console.log('  dead href="#"           ' + dead.length);
  console.log("  INTERNAL FAILURES       " + failures.length);
  console.log("=".repeat(118));

  if (failures.length) {
    console.log("\nFAILING REFERENCES:");
    failures.forEach((r) => console.log("  " + r.file + ":" + r.line + "  " + r.url + "  → " + r.status));
    process.exit(1);
  }
  console.log("\nAll internal links resolve. No dead placeholders.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
