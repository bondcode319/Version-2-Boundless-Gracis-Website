#!/usr/bin/env node
/* ==========================================================================
   BGCF static site build — zero dependencies, plain Node.

   Composes  partials/{head,header,footer}.html  +  src/<page>.html
   into the flat .html files served from this folder, and regenerates
   robots.txt and sitemap.xml.

   Why a build step rather than injecting the chrome at runtime: the served
   pages stay real static HTML, so navigation works with scripting off and
   crawlers see every link without executing anything. `node build.js` is the
   whole toolchain — there is nothing to install.

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

   A null URL in site.config.json means "this profile is not known yet". Such
   an icon is omitted entirely: shipping href="#" would be a dead link, which
   is both an accessibility and an SEO defect. Fill a URL in and the icon
   reappears in the header and the footer automatically.
   -------------------------------------------------------------------------- */

const NETWORKS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
];

function socialRow(colour) {
  return NETWORKS.filter((n) => config.social[n.key])
    .map(
      (n) =>
        `<a href="${config.social[n.key]}" target="_blank" rel="noopener noreferrer" aria-label="Boundless Gracia on ${n.label}">` +
        `<img src="assets/icons/${n.key}-${colour}.svg" alt="" width="16" height="16"></a>`
    )
    .join("\n        ");
}

const topIcons = socialRow("white");
const socialTop = topIcons ? `<div class="social-row">\n        ${topIcons}\n      </div>` : "";

const footerIcons = socialRow("white");
const socialFooter = footerIcons ? `<div class="social-row">\n        ${footerIcons}\n      </div>` : "";

/* --------------------------------------------------------------------------
   Donate destination
   -------------------------------------------------------------------------- */

const donateUrl = config.donateUrl || "donate.html";
const isInternalDonate = !/^https?:/i.test(donateUrl);

/* --------------------------------------------------------------------------
   Canonicals, breadcrumbs, active nav
   -------------------------------------------------------------------------- */

function origin() {
  const base = (config.siteUrl || "").trim();
  if (!base) return "";
  return base.endsWith("/") ? base : base + "/";
}

function canonicalFor(page) {
  const o = origin();
  if (!o) return page.file === "index.html" ? "./" : "./" + page.file;
  return page.file === "index.html" ? o : o + page.file;
}

function breadcrumbFor(page) {
  if (!page.breadcrumb || !page.breadcrumb.length) return "";
  const items = page.breadcrumb
    .map((crumb, i) => {
      const last = i === page.breadcrumb.length - 1;
      const label = crumb.label;
      if (last || !crumb.href) {
        return `      <li${last ? ' aria-current="page"' : ""}>${label}</li>`;
      }
      return `      <li><a href="${crumb.href}">${label}</a></li>`;
    })
    .join("\n");

  return (
    '  <nav class="breadcrumb" aria-label="Breadcrumb">\n' +
    "    <ol>\n" +
    items +
    "\n    </ol>\n" +
    "  </nav>"
  );
}

/* The nav entry for the section the page sits in gets aria-current="true";
   a link pointing at the page itself gets aria-current="page". */
function markActive(html, page) {
  let out = html;

  if (page.navSlug) {
    out = out.replace(
      new RegExp(`(data-nav-link data-slug="${page.navSlug}")`, "g"),
      '$1 aria-current="true"'
    );
  }

  out = out.replace(
    new RegExp(`href="${page.file.replace(/\./g, "\\.")}"`, "g"),
    `href="${page.file}" aria-current="page"`
  );

  return out;
}

/* --------------------------------------------------------------------------
   Structured data — Organization on the home page only
   -------------------------------------------------------------------------- */

function schemaFor(page) {
  if (page.file !== "index.html") return "";
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: config.org.legalName,
    alternateName: "Boundless Gracia Children's Foundation",
    foundingDate: "2024",
    founder: { "@type": "Person", name: config.org.founder },
    description: config.org.description,
    telephone: config.org.phone,
    email: config.org.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mpara Village",
      addressRegion: "Kyegegwa District",
      addressCountry: "UG",
    },
  };
  if (origin()) data.url = origin();
  const social = NETWORKS.map((n) => config.social[n.key]).filter(Boolean);
  if (social.length) data.sameAs = social;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* --------------------------------------------------------------------------
   Token substitution
   -------------------------------------------------------------------------- */

function applyTokens(tpl, page) {
  return tpl
    .replace(/\{\{DONATE\}\}/g, donateUrl)
    .replace(/\{\{SOCIAL_TOP\}\}/g, socialTop)
    .replace(/\{\{SOCIAL_FOOTER\}\}/g, socialFooter)
    .replace(/\{\{BREADCRUMB\}\}/g, breadcrumbFor(page))
    .replace(/\{\{HEADER_CLASS\}\}/g, page.plainHeader ? "is-plain" : "")
    .replace(/\{\{TITLE\}\}/g, page.title)
    .replace(/\{\{DESCRIPTION\}\}/g, page.description)
    .replace(/\{\{CANONICAL\}\}/g, canonicalFor(page))
    .replace(/\{\{OG_IMAGE\}\}/g, (origin() || "") + (page.ogImage || config.ogImage))
    .replace(/\{\{SCHEMA\}\}/g, schemaFor(page))
    .replace(
      /\{\{ROBOTS\}\}/g,
      page.noindex ? '<meta name="robots" content="noindex, follow">\n' : ""
    );
}

/* --------------------------------------------------------------------------
   Page build
   -------------------------------------------------------------------------- */

function buildPage(page) {
  const srcPath = path.join(SRC, page.file);
  if (!fs.existsSync(srcPath)) {
    return { file: page.file, ok: false, reason: "no src/" + page.file };
  }

  const body = read(srcPath).trimEnd();
  const head = applyTokens(headTpl, page);
  const header = applyTokens(markActive(headerTpl, page), page);
  const footer = applyTokens(markActive(footerTpl, page), page);
  const main = applyTokens(markActive(body, page), page);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${head}
</head>
<body>

<a class="skip-link" href="#main">Skip to main content</a>

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
  const o = origin();
  const lines = ["User-agent: *", "Allow: /", ""];
  if (o) lines.push(`Sitemap: ${o}sitemap.xml`, "");
  else lines.push("# Set siteUrl in site.config.json to emit an absolute sitemap URL", "");
  fs.writeFileSync(path.join(ROOT, "robots.txt"), lines.join("\n"));
}

function buildSitemap() {
  const o = origin();
  const today = new Date().toISOString().slice(0, 10);

  const urls = config.pages
    .filter((p) => !p.noindex)
    .map((p) => {
      const loc = p.file === "index.html" ? o || "./" : (o || "") + p.file;
      const priority = p.file === "index.html" ? "1.0" : p.priority || "0.7";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
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
  if (!topIcons) {
    console.log('note: every social URL is null in site.config.json — icons omitted (no href="#" shipped)');
  }
  if (isInternalDonate) {
    console.log(`note: donate CTAs route to ${donateUrl} (no external payment endpoint configured)`);
  }
  if (missing.length) {
    console.log("\nMISSING SOURCES:");
    missing.forEach((m) => console.log("  - " + m.reason));
    process.exitCode = 1;
  }
}

main();
