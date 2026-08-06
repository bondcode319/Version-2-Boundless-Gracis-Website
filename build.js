#!/usr/bin/env node
/* ==========================================================================
   BGCF static site build — zero dependencies, plain Node.

   Composes  partials/{head,header,footer}.html  +  src/<page>.html
   into the flat .html files served from the project root, and regenerates
   robots.txt and sitemap.xml.

   Why a build step rather than injecting the chrome with JS at runtime:
     - the served pages stay real static HTML, so navigation works with
       scripting off and crawlers see the links without executing anything;
     - the STEP 7 link checker walks the *.html files and reads their hrefs —
       runtime injection would leave those files with no nav to check;
     - it costs no npm dependencies. `node build.js` is the whole toolchain.

   Run:  node build.js
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const PARTIALS = path.join(ROOT, "partials");

const config = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const read = (p) => fs.readFileSync(p, "utf8");

const headTpl = read(path.join(PARTIALS, "head.html")).trimEnd();
const headerTpl = read(path.join(PARTIALS, "header.html")).trimEnd();
const footerTpl = read(path.join(PARTIALS, "footer.html")).trimEnd();

/* --------------------------------------------------------------------------
   Social icons

   A null URL in site.config.json means "we do not know this profile yet".
   Such an icon is omitted entirely — emitting href="#" would ship a link that
   goes nowhere, which is both an accessibility defect and an SEO one.
   -------------------------------------------------------------------------- */

const NETWORKS = [
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
];

function socialRow(colour, size) {
  const base = size || 16;
  return NETWORKS.filter((n) => config.social[n.key])
    .map((n) => {
      const isX = n.key === "x";
      const px = isX ? base - 2 : base;
      const cls = isX && base === 16 ? ' class="is-x"' : "";
      return (
        `<a href="${config.social[n.key]}" target="_blank" rel="noopener noreferrer" aria-label="BGCF on ${n.label}">` +
        `<img${cls} src="assets/icons/${n.key}-${colour}.svg" alt="" width="${px}" height="${px}"></a>`
      );
    })
    .join("\n      ");
}

// Both strips drop their wrapper entirely when no URL is known, so no empty
// container is shipped.
const topIcons = socialRow("white");
const socialTop = topIcons ? `<div class="social-row">\n      ${topIcons}\n    </div>` : "";

const footerIcons = socialRow("emerald");
const socialFooter = footerIcons
  ? `<div class="site-footer__social">\n      ${footerIcons}\n    </div>`
  : "";

/* Share links need an absolute page URL to point a network at. While siteUrl
   is unset there is nothing real to share, so only the mailto — which works
   without a public URL — is emitted. Setting siteUrl brings the rest back. */
function shareRow() {
  const base = (config.siteUrl || "").trim();
  const mail =
    '<a href="mailto:?subject=Boundless%20Gracia%20Children%27s%20Foundation" aria-label="Share BGCF by email">' +
    '<img src="assets/icons/mail-emerald.svg" alt="" width="17" height="17"></a>';
  if (!base) return mail;

  const url = encodeURIComponent(base.endsWith("/") ? base : base + "/");
  const nets = [
    ["Facebook", "facebook", "https://www.facebook.com/sharer/sharer.php?u=" + url],
    ["LinkedIn", "linkedin", "https://www.linkedin.com/sharing/share-offsite/?url=" + url],
    ["X", "x", "https://twitter.com/intent/tweet?url=" + url],
  ]
    .map(
      ([label, key, href]) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Share BGCF on ${label}">` +
        `<img src="assets/icons/${key}-emerald.svg" alt="" width="${key === "x" ? 15 : 17}" height="${key === "x" ? 15 : 17}"></a>`
    )
    .join("\n            ");
  return nets + "\n            " + mail;
}
const shareLinks = shareRow();

// Contact page's larger round variant on navy.
const contactIcons = socialRow("white", 17);
const socialContact = contactIcons
  ? `<div class="social-round">\n              ${contactIcons}\n            </div>`
  : "";

/* --------------------------------------------------------------------------
   Donate destination

   One constant for the entire site. Fund parameters are only meaningful
   against a real donation endpoint; while donateUrl points at the internal
   page they are dropped, because donate.html has no fund routing.
   -------------------------------------------------------------------------- */

const isInternalDonate = !/^https?:/i.test(config.donateUrl);

function donateHref(fund) {
  if (!fund || isInternalDonate) return config.donateUrl;
  return config.donateUrl + (config.donateFunds[fund] || "");
}

/* --------------------------------------------------------------------------
   Breadcrumb
   -------------------------------------------------------------------------- */

function breadcrumb(trail) {
  if (!trail || !trail.length) return "";
  const items = [];
  trail.forEach((crumb, i) => {
    const last = i === trail.length - 1;
    if (i > 0) items.push(`      <li class="breadcrumb__sep" aria-hidden="true">/</li>`);
    if (last) items.push(`      <li><strong>${crumb.label}</strong></li>`);
    else if (crumb.href) items.push(`      <li><a href="${crumb.href}">${crumb.label}</a></li>`);
    else items.push(`      <li>${crumb.label}</li>`);
  });
  return [
    `  <nav class="breadcrumb" aria-label="Breadcrumb">`,
    `    <ol>`,
    items.join("\n"),
    `    </ol>`,
    `  </nav>`,
  ].join("\n");
}

/* --------------------------------------------------------------------------
   Active nav state

   STEP 6: use the data-slug attributes the markup already carries. Doing it
   at build time rather than in site.js means the current page is marked in
   the HTML itself, so assistive tech sees it without waiting on script.
   -------------------------------------------------------------------------- */

function markActive(html, page) {
  let out = html;

  if (page.navSlug) {
    out = out.replace(
      new RegExp(`(<(?:a|button)[^>]*data-slug="${page.navSlug.replace(/\//g, "\\/")}")`, "g"),
      `$1 aria-current="true"`
    );
  }

  // Any nav or drawer link pointing at this very page gets aria-current="page".
  out = out.replace(
    new RegExp(`(<a href="${page.file.replace(/\./g, "\\.")}")(?![^>]*aria-current)`, "g"),
    `$1 aria-current="page"`
  );

  return out;
}

/* --------------------------------------------------------------------------
   Compose
   -------------------------------------------------------------------------- */

function canonicalFor(page) {
  const base = (config.siteUrl || "").trim();
  if (!base) return page.file === "index.html" ? "./" : page.file;
  const origin = base.endsWith("/") ? base : base + "/";
  return page.file === "index.html" ? origin : origin + page.file;
}

// `<!--! … -->` marks a note meant for whoever edits the partial, not for the
// shipped page. Stripped before token substitution so token syntax quoted
// inside such a note is never itself substituted.
function stripBuildComments(str) {
  return str.replace(/^[ \t]*<!--![\s\S]*?-->[ \t]*\r?\n?/gm, "");
}

function applyTokens(str, page) {
  return stripBuildComments(str)
    .replace(/\{\{DONATE:(\w+)\}\}/g, (_, fund) => donateHref(fund))
    .replace(/\{\{DONATE\}\}/g, donateHref(null))
    .replace(/\{\{SOCIAL_TOP\}\}/g, socialTop)
    .replace(/\{\{SOCIAL_FOOTER\}\}/g, socialFooter)
    .replace(/\{\{SOCIAL_CONTACT\}\}/g, socialContact)
    .replace(/\{\{SHARE_LINKS\}\}/g, shareLinks)
    .replace(/\{\{BREADCRUMB\}\}/g, breadcrumb(page.breadcrumb))
    .replace(/\{\{TITLE\}\}/g, page.title)
    .replace(/\{\{DESCRIPTION\}\}/g, page.description)
    .replace(/\{\{CANONICAL\}\}/g, canonicalFor(page))
    .replace(/\{\{ROBOTS\}\}/g, page.noindex ? '<meta name="robots" content="noindex, follow">\n' : "")
    // Page-specific behaviour ships only to the page that needs it, rather
    // than loading every page's script on every page.
    .replace(/\{\{PAGE_SCRIPT\}\}/g, page.script ? `<script src="${page.script}" defer></script>` : "");
}

function buildPage(page) {
  const srcPath = path.join(SRC, page.file);
  if (!fs.existsSync(srcPath)) return { file: page.file, ok: false, reason: "no src/" + page.file };

  const body = read(srcPath).trimEnd();
  const head = applyTokens(headTpl, page);
  const header = applyTokens(markActive(headerTpl, page), page);
  const footer = applyTokens(markActive(footerTpl, page), page);
  const main = applyTokens(body, page);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>

<a class="skip-link" href="#bgcf-main">Skip to main content</a>

${header}

${main}

${footer}

</body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, page.file), html);
  return { file: page.file, ok: true, bytes: Buffer.byteLength(html) };
}

/* --------------------------------------------------------------------------
   robots.txt + sitemap.xml
   -------------------------------------------------------------------------- */

function buildRobots() {
  const base = (config.siteUrl || "").trim();
  const lines = ["User-agent: *", "Allow: /", ""];
  if (base) {
    const origin = base.endsWith("/") ? base : base + "/";
    lines.push(`Sitemap: ${origin}sitemap.xml`, "");
  } else {
    lines.push("# Sitemap: set siteUrl in site.config.json to emit an absolute sitemap URL", "");
  }
  fs.writeFileSync(path.join(ROOT, "robots.txt"), lines.join("\n"));
}

function buildSitemap() {
  const base = (config.siteUrl || "").trim();
  const origin = base ? (base.endsWith("/") ? base : base + "/") : "";
  const today = new Date().toISOString().slice(0, 10);

  const urls = config.pages
    .filter((p) => !p.noindex)
    .map((p) => {
      const loc = p.file === "index.html" ? origin || "./" : (origin || "") + p.file;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
}

/* -------------------------------------------------------------------------- */

function main() {
  const results = config.pages.map(buildPage);
  buildRobots();
  buildSitemap();

  const built = results.filter((r) => r.ok);
  const missing = results.filter((r) => !r.ok);

  console.log(`built ${built.length}/${config.pages.length} pages + robots.txt + sitemap.xml`);
  if (!socialTop) console.log('note: all social URLs are null in site.config.json — icons omitted (no href="#" emitted)');
  if (isInternalDonate) console.log(`note: donate CTAs route to ${config.donateUrl} (external endpoint unresolved)`);
  if (missing.length) {
    console.log("\nMISSING SOURCES:");
    missing.forEach((m) => console.log("  - " + m.reason));
    process.exitCode = 1;
  }
}

main();
