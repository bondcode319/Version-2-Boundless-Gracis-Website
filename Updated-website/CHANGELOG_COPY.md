# CHANGELOG_COPY — removal of Precious Kids Foundation carry-over copy

Carried out against `boundless-gracia-copy-fix-prompt.md`, on `Updated-website/`.
Date: 2026-10-14. Field inventory that drove the work: `COPY_UPDATE_FIELDS.md`.

Copy only. No layout, CSS class, component, image or form-logic change, with one
exception noted under "Incidental fixes".

---

## How the edits were made

Shared chrome is single-source in this project, so nav labels, footer links,
page titles, meta descriptions and breadcrumbs were each changed **once**:

| Edited | Scope |
|---|---|
| `src/*.html` | Page bodies |
| `partials/header.html` | Topbar, mega-menu, mobile drawer — all pages |
| `partials/footer.html` | Footer links, trust badges, legal line — all pages |
| `site.config.json` | Titles, meta descriptions, Open Graph, breadcrumbs, canonicals, sitemap, JSON-LD |

The 26 served `*.html` were then regenerated with `node build.js`. They are
build output and were never hand-edited.

---

## Baseline (sources, before any change)

| String | Count | | String | Count |
|---|---:|---|---|---:|
| `We Educate` | 15 | | `half-day walk` | 7 |
| `We Heal` | 15 | | `how far you can walk` | 2 |
| `We Protect` | 13 | | `hours away on foot` | 1 |
| `We Empower` | 18 | | `is predictable` | 3 |
| `Sponsor a Child` | 19 | | `does not keep to a budget` | 2 |
| `Heal a Child` | 11 | | `schedule a child` | 1 |
| `Empower a Mother` | 11 | | `widow` | 2 |
| `Build a Clinic` | 10 | | `crafts` | 4 |
| `Outreach Mission` | 14 | | `underprivileged` | 1 |
| `field mission` | 1 | | `Partner logo` | 6 |
| `$38` | 6 | | `coded to` | 14 |
| `38 a month` | 5 | | `carry its own children` | 5 |
| `seen and valued` | 1 | | `honestly where it fits` | 3 |
| `seen, valued` | 2 | | `least photogenic` | 2 |
| `brick by brick` | 1 | | `school year around` | 2 |
| `pallet of bricks` | 1 | | `Accounts published annually` | 1 |
| `bricks, cement` | 2 | | `Travel with us` | 2 |
| `medical camp` | 2 | | `health camp` | 3 |

---

## [A] Programme areas renamed

| Old | New | Old URL | New URL |
|---|---|---|---|
| We Educate | **Grace to Learn** | `we-educate.html` | `grace-to-learn.html` |
| We Heal | **Grace to Thrive** | `we-heal.html` | `grace-to-thrive.html` |
| We Protect | **Grace to Belong** | `we-protect.html` | `grace-to-belong.html` |
| We Empower | **Grace to Rise** | `we-empower.html` | `grace-to-rise.html` |

Changed in: mega-menu (name + descriptor), mobile drawer, footer "Our Work"
column, page `<h1>`, `<title>`, breadcrumb, home programme cards, Our Work
section headings, "Inside …" buttons, "Related" cards on each programme page,
Donate "Where it goes" fund notes, three director bios on Our Team, story
kickers and card links.

Mega-menu descriptors also updated:

- Grace to Learn → "Schooling, early years and skills, from ECD to vocational training."
- Grace to Thrive → "Health outreach, nutrition, immunisation and safe water."
- Grace to Belong → "Child protection, safeguarding and care within a family."
- Grace to Rise → unchanged.

Footer lines: "Grace to Rise — livelihoods & household resilience" (was
"We Empower — livelihoods & empowerment"); the other three keep their existing
descriptors with the new name.

Titles follow the brief's pattern, e.g. `Grace to Learn — Education & Child
Development | Boundless Gracia`.

**Also swept:** the lowercase form of the same device — the link labels
"How we educate / heal / protect / empower" → "Inside Grace to Learn /
Thrive / Belong / Rise" (5 instances across Home, Sponsor a Learner, Keep a
Child Well, Back a Caregiver, Stories), and one body clause on Home, "so we
treat all four together" → "so all four are addressed together."

## [B] Giving products renamed

| Old | New | Old URL | New URL |
|---|---|---|---|
| Sponsor a Child | **Sponsor a Learner** | `sponsor-a-child.html` | `sponsor-a-learner.html` |
| Heal a Child | **Keep a Child Well** | `heal-a-child.html` | `keep-a-child-well.html` |
| Empower a Mother | **Back a Caregiver** | `empower-a-mother.html` | `back-a-caregiver.html` |
| Build a Clinic | **The Mpara Health Unit** | `build-a-clinic.html` | `mpara-health-unit.html` |
| Outreach Missions | **Field Weeks** | `outreach-missions.html` | `field-weeks.html` |

Page H1 on the health-unit page is **"The Mpara Health Unit Appeal"** per the brief.

Descriptors updated: Keep a Child Well → "Consultation, medicine, referral
transport and follow-up."; Back a Caregiver → "A savings group, training and a
start-up grant for a caregiver."; The Mpara Health Unit → "A permanent health
unit for Mpara, costed phase by phase."; Field Weeks → "Join a scheduled
outreach week in Kyegegwa District."

Also changed: all CTA buttons, footer "Get Involved" column, Get Involved action
cards ("Join an Outreach Mission" → "Join a Field Week"), Donate fund
`<select>` ("The Mpara clinic appeal" → "The Mpara health unit appeal") and the
same string in "Where it goes", Contact topic `<select>` ("Volunteering or
outreach missions" → "Volunteering or field weeks"), Volunteer page links.

"child sponsorship" was added to the Sponsor a Learner meta description so the
search term is not lost.

## [C] $38 removed — 7 fields, not the 5 the brief listed

| File | Old | New |
|---|---|---|
| `sponsor-a-learner.html` hero | "From $38 a month, a child stays in class for a full year — …" | "One steady monthly gift keeps a child in class for the whole school year, …" |
| `sponsor-a-learner.html` H2 | "$38 a month, itemised" | "What your monthly gift covers" |
| `sponsor-a-learner.html` intro | — | New first sentence: "A primary place is budgeted at UGX [TBC …] (about US$[TBC]) a month." + TODO |
| `donate.html` presets | $20 · $38 · $75 · $150 | $25 · $50 · $100 · $200 + TODO; default pressed state moved to $50 |
| `donate.html` amount field | `value="38"` | `value="50"` |
| `contact.html` shortcut card | "What $38 a month covers, …" | "What sponsorship covers, …" |
| `story-scholastic-materials-mpara.html` | "Sponsorship at $38 a month covers …" | "A monthly sponsorship covers …" |
| `thank-you.html` card | "Sponsorship from $38 a month covers …" | "A monthly sponsorship covers …" |

The last two were **not** in the brief's list; they carried the same figure.

## [D] "Seen and valued" replaced

- Home hero H1 → **"A child's circumstances should never *set the limits of their future*"** (the italic span keeps the gold accent the design uses).
- Home hero lead rewritten so the line is not repeated.
- Belief line on Home and Our Story → "At Boundless Gracia Children's Foundation, we believe every child is worthy of love, protection and a fair chance at a future of their own making."
- Our Story's source line, "We exist because a child's circumstances should never determine the limits of their future.", left unchanged.

## [E] Brick-and-cement framing removed

Mega-menu descriptor, Home "Ways to give" card, health-unit closing CTA H2
("Fund a phase, a room or a piece of equipment") and the Donate fund note all
rewritten to construction / phase language. "Construction materials" on Partner
With Us kept.

## [F] "Predictable vs unpredictable" argument rewritten

Sponsor a Learner H2 → "Steady support keeps a child steady in school";
Keep a Child Well kicker/H2 → "Why a shared fund" / "Care that starts on the day
it is needed" (two paragraphs collapsed into the brief's single replacement, the
"parallel health service" paragraph left intact); Grace to Learn closing CTA →
"Keep a learner in class all year"; the story page and the Get Involved health
card rewritten. The governance sentence on the health-unit page about funds not
being moved between budget lines was left exactly as it was.

## [G] Mission-trip language replaced

"Travel with us" (×2), "medical camps" (×2), "health camp(s)" (×3), "outreach
camp(s)" (×2) and every "outreach mission" variant replaced. Field Weeks page:
kicker, H2 ("A work plan with people attached, not a trip."), body, "Field weeks
are small by design.", "no field-week or volunteer fee", "Field-week dates are
set…", "Register for the next field week". Sponsor FAQ and Volunteer page
updated. "Mission" in the organisational sense (Vision, Mission & Values;
"departs from the mission") was not touched.

## [H] Walking-distance motif cut to one reference

Kept: the Grace to Thrive problem statement, now "…when the nearest health
centre is [TBC: distance from Mpara to the nearest HC III/IV] away and the
household has no money for transport." with a TODO.

Removed from: Grace to Thrive hero lead and closing CTA ("Good health should not
depend on where a child is born"), Our Work programme two, Keep a Child Well
closing CTA ("Treatment should start the day a child falls ill"), Get Involved
health-unit card, health-unit hero lead, Donate fund note, Home "Ways to give"
card, and the health-unit page's meta description in `site.config.json`.

"Families arrive on foot" on the Field Weeks day schedule kept as a factual
operational detail.

## [I] Caregiver wording and trades

Back a Caregiver H2 → "A child stays in school when the household can keep them
there". Beneficiary sentence on Grace to Rise and Back a Caregiver rewritten
without "widow". "Crafts" removed from all four trade lists (Grace to Rise ×2,
Back a Caregiver ×1, Our Team director bio ×1) with one TODO on Grace to Rise.
The strategic-plan wording "single mothers, grandmothers and elderly guardians"
on Home, Our Story and Vision, Mission & Values was left unchanged.

## [J] Objective wording

Vision, Mission & Values objective (a) → "To equip children and young people
facing disadvantage with practical life skills and market-relevant vocational
training." + TODO about the registered Constitution.

## [K] Partner logos

The four placeholder boxes are commented out (markup retained for later). The
section heading and paragraph stay. Last line now reads "Our first partnership
agreements are being finalised. Partners will be listed here once each agreement
is signed." "Become a partner" button kept.

## [L] Information architecture label

`what-we-do.html` title → "Our Work — Boundless Gracia Children's Foundation".
The breadcrumb already read "Our Work". The URL was **not** renamed (lower risk,
and it avoided a tenth redirect stub).

## [M] Repetition trimmed

| Phrase | Before | After | Kept on |
|---|---:|---:|---|
| "coded to (a/the) fund" | 14 | 3 | Donate ×2, Governance ×1 |
| "carry its own children" | 5 | 1 | Back a Caregiver |
| "tell you honestly where it fits" | 3 | 1 | Volunteer |
| "least photogenic gift" | 2 | 1 | Grace to Belong |
| "plan a school year around" | 2 | 0 | — see note |

Replacements were varied: "ring-fenced for", "allocated to", "recorded against",
"goes to", or the clause dropped. **Note on the last row:** the brief said to
keep one instance on Sponsor a Learner and one on Donate, but neither page
carried the phrase — the only two instances were on Our Impact and Our Story,
and both were rewritten. The result is 0, not 2.

## [N] Claim accuracy

- Footer trust badge (all pages): "Accounts published annually" → **"Audited accounts: first report in preparation"**.
- Home "Ways to give" lead → "Every gift is allocated to a fund in our accounts, reported against our results framework, and will be audited each year by an independent auditor."
- "Safeguarding policy in force" badge kept, with a TODO against Board adoption.

---

## Renames and redirects

Nine `src/` files renamed, their `file` key updated in `site.config.json`, and
all 93 internal references rewritten. A redirect stub now sits at each old path
in the project root — `<meta http-equiv="refresh">` + `<link rel="canonical">` +
`noindex, follow`, with a visible fallback link. Stubs live outside `src/`, so
`build.js` does not touch them.

`sitemap.xml` and `robots.txt` regenerate from `site.config.json` and now list
the new URLs only.

## Incidental fixes (not copy)

One CSS contrast bug surfaced during the visual check and was fixed:
`.hero .btn--ghost` had no reversed-out rule, so the secondary hero button
rendered navy-on-photograph. It now matches the other dark grounds
(`assets/css/site.css`, the `.btn--ghost` reversed-out group).

---

## Verification

| Check | Result |
|---|---|
| Zero-match grep, all 30 strings, across `src/` + `partials/` + `site.config.json` | **0**, with the two notes below |
| Zero-match grep across the 26 built pages | **0**, except the commented-out logo row |
| `node build.js` | 26/26 pages + robots.txt + sitemap.xml |
| `node tools/check-links.js` | 3695 references across 35 pages, no broken local links or missing assets |
| Old URLs | 9 redirect stubs present and resolving |
| TODO / TBC markers | 6, as expected |

**Two deliberate non-zero results:**

1. `Partner logo` ×4 in `index.html` — inside the commented-out block the brief asked to retain.
2. `we treat` ×1 — "the children we treated once", a blockquote on Keep a Child Well. Ordinary English, not the PKF pillar; left alone.

**Three grep false positives** confirmed and left alone: `cement` inside
"pla**cement**s" (Partner With Us) and "announ**cement**s" (header), and
"mud-brick family home" in a gallery `alt` attribute, which describes the
photograph.

---

## Client to confirm

| # | Item | Where |
|---|---|---|
| 1 | Costed monthly sponsorship figure (UGX and US$) | `src/sponsor-a-learner.html` |
| 2 | Donate preset amounts — are $25 / $50 / $100 / $200 right? | `src/donate.html` |
| 3 | Distance from Mpara to the nearest HC III/IV | `src/grace-to-thrive.html` |
| 4 | Trades actually offered at the women's skilling centre | `src/grace-to-rise.html` |
| 5 | Is objective (a) quoted verbatim from the registered Constitution? | `src/vision-mission-values.html` |
| 6 | Has the Board formally adopted the safeguarding policy? | `partials/footer.html` |
| 7 | Is "Extending grace. Restoring hope. Transforming lives." the registered strapline? | Home hero, Our Story H1, footer, home `<title>` |
| 8 | Approval of the "Grace to…" programme family | Applied throughout; fallback is Education / Health / Protection / Livelihoods |
| 9 | Approval of the five new giving-product names | Applied throughout |

Items 8 and 9 were applied as the brief specified them. If either is rejected,
the change is mechanical — the same rename pass run with different target
strings, plus a second set of redirect stubs.

## Outstanding

The final pixel check could not be completed: Chrome's screenshot capture timed
out repeatedly on this machine after the first page. Home was confirmed visually
(new hero copy, correct wrapping, hero button contrast fixed); the remaining
pages were verified structurally only. Worth eyeballing the mega-menu, the
mobile drawer and the footer columns at 1280px and 375px, since "Grace to
Belong" and "The Mpara Health Unit" are longer than the strings they replaced.
