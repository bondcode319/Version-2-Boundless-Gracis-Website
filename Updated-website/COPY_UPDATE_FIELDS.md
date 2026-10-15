# Fields to update — Boundless Gracia (Updated-website)

Audit of `Updated-website/` against `boundless-gracia-copy-fix-prompt.md`, listing **every field that has to change**, where it lives, what it currently says and what it must say.

> **STATUS: APPLIED, 2026-10-14.** Every field below has been changed, the nine
> files renamed and redirect stubs added. See `CHANGELOG_COPY.md` for what was
> done, the verification results and the nine items the client still has to
> confirm. This file is kept as the audit record.

Run date of the audit: 2026-10-14. Line numbers are from the current `src/` files and will drift as edits land — the element and the current text are the reliable identifiers.

---

## 0. Before you edit anything: where the fields actually live

This site is **not** a set of hand-maintained HTML files. The served `*.html` in the project root are **generated**. Editing them is wasted work — the next build overwrites them.

| Edit here | Covers |
|---|---|
| `src/<page>.html` | That page's `<main>` only |
| `partials/header.html` | Topbar, logo lockup, desktop mega-menu, mobile drawer — **every page** |
| `partials/footer.html` | Footer links, trust badges, subscribe card, legal line — **every page** |
| `site.config.json` | `<title>`, `meta description`, Open Graph, breadcrumbs, canonical, sitemap entry, JSON-LD org data, donate destination |
| `assets/js/site.js` | Any string held in JS (currently: button `aria-label` text for the slideshow pause control only) |

Then run:

```
node build.js            # regenerates all 26 pages + robots.txt + sitemap.xml
node tools/check-links.js # verifies every local href/src resolves
```

**Consequence for this work list:** shared chrome is single-source. A nav label, a footer link or a page title is changed **once**, not 26 times. The per-page counts below are already de-duplicated on that basis.

---

## 1. Baseline counts (sources only: `src/`, `partials/`, `site.config.json`)

| String | Count | Change-set |
|---|---:|---|
| `We Educate` | 15 | A |
| `We Heal` | 15 | A |
| `We Protect` | 13 | A |
| `We Empower` | 18 | A |
| `Sponsor a Child` | 19 | B |
| `Heal a Child` | 11 | B |
| `Empower a Mother` | 11 | B |
| `Build a Clinic` | 10 | B |
| `Outreach Mission` | 14 | B |
| `field mission` | 1 | B |
| `$38` | 6 | C |
| `38 a month` | 5 | C |
| `seen and valued` | 1 | D |
| `seen, valued` | 2 | D |
| `brick by brick` / `pallet of bricks` / `bricks, cement` | 1 / 1 / 2 | E |
| `is predictable` | 3 | F |
| `does not keep to a budget` | 2 | F |
| `schedule a child` | 1 | F |
| `Travel with us` | 2 | G |
| `medical camp` / `health camp` | 2 / 3 | G |
| `half-day walk` | 7 | H |
| `how far you can walk` | 2 | H |
| `hours away on foot` | 1 | H |
| `widow` | 2 | I |
| `crafts` | 4 | I |
| `underprivileged` | 1 | J |
| `Partner logo` | 6 | K |
| `What We Do` (as a page title) | 1 | L |
| `coded to` | 14 | M |
| `carry its own children` | 5 | M |
| `honestly where it fits` | 3 | M |
| `least photogenic` | 2 | M |
| `school year around` | 2 | M |
| `Accounts published annually` | 1 | N |

### Two false positives — do not "fix" these

| Hit | File | Why it stays |
|---|---|---|
| `cement` inside **pla**cement**s** | `src/partner-with-us.html:27` | Substring match only |
| `cement` inside announ**cement**s | `partials/header.html:175` | Substring match only |
| `mud-brick family home` | `src/gallery.html:53` (alt text) | Factual description of the photograph, not appeal framing |

---

## 2. [A] Programme area names — 4 renames, P1

Every one of these fields carries an old programme name.

| # | File | Field | Current | New |
|---|---|---|---|---|
| A1 | `partials/header.html` L97 | Mega-menu item 1, `<strong>` + descriptor | We Educate / "Education and child development, from ECD to vocational skills." | **Grace to Learn** / "Schooling, early years and skills, from ECD to vocational training." |
| A2 | `partials/header.html` L101 | Mega-menu item 2 | We Heal / "Health, nutrition, immunisation and safe water." | **Grace to Thrive** / "Health outreach, nutrition, immunisation and safe water." |
| A3 | `partials/header.html` L105 | Mega-menu item 3 | We Protect / "Child protection, safeguarding and family-based care." | **Grace to Belong** / "Child protection, safeguarding and care within a family." |
| A4 | `partials/header.html` L109 | Mega-menu item 4 | We Empower / "Savings groups, enterprise training and caregiver skilling." | **Grace to Rise** / "Savings groups, enterprise training and caregiver skilling." |
| A5 | `partials/header.html` L237–243 | Mobile drawer, "Our Work" accordion, 4 links | We Educate / We Heal / We Protect / We Empower | Grace to Learn / Grace to Thrive / Grace to Belong / Grace to Rise |
| A6 | `partials/footer.html` L28–31 | "Our Work" column, 4 links | "We Educate — education & child development" etc. | "Grace to Learn — education & child development", "Grace to Thrive — health, nutrition & WASH", "Grace to Belong — child protection & family care", "Grace to Rise — livelihoods & household resilience" |
| A7 | `site.config.json` | 4 × `title` | "We Educate — Education & Child Development — Boundless Gracia" etc. | `Grace to Learn — Education & Child Development \| Boundless Gracia`, `Grace to Thrive — Health, Nutrition & WASH \| Boundless Gracia`, `Grace to Belong — Child Protection & Family Strengthening \| Boundless Gracia`, `Grace to Rise — Livelihoods & Economic Empowerment \| Boundless Gracia` |
| A8 | `site.config.json` | 4 × `breadcrumb` last crumb | We Educate / We Heal / We Protect / We Empower | New names |
| A9 | `site.config.json` | 4 × `file` | `we-educate.html` … | `grace-to-learn.html`, `grace-to-thrive.html`, `grace-to-belong.html`, `grace-to-rise.html` (see §12) |
| A10 | `src/we-educate.html:13` | Page `<h1>` | We Educate | **Grace to Learn** (keep the existing sub-line) |
| A11 | `src/we-heal.html:10` | Page `<h1>` | We Heal | **Grace to Thrive** |
| A12 | `src/we-protect.html:10` | Page `<h1>` | We Protect | **Grace to Belong** |
| A13 | `src/we-empower.html:10` | Page `<h1>` | We Empower | **Grace to Rise** |
| A14 | `src/index.html:169,180,191,202` | Home "What we do" 4 cards, `<h3>` | We Educate / We Heal / We Protect / We Empower | New names |
| A15 | `src/what-we-do.html:41,61,91,111` | 4 section `<h2>` | "We Educate — education and child development" etc. | "Grace to Learn — education and child development", and the same pattern for the other three |
| A16 | `src/what-we-do.html:51,71,101,121` | 4 "Inside …" buttons | "Inside We Educate" etc. | "Inside Grace to Learn" etc. |
| A17 | `src/we-educate.html` and `src/we-heal.html` "Related" sections | "Related" cards, `<h3>` + link text | We Heal / We Protect / We Empower / We Educate | New names |
| A18 | `src/donate.html:148–180` | "Where it goes" — 4 fund notes ending "We Educate.", "We Heal.", "We Protect.", "We Empower." | | New names |
| A19 | `src/our-team.html` director bios (3 × `data-role`) | 3 director cards, `data-role` bios ("Senior Management Team · We Educate" etc.) | | New names |
| A20 | `src/story-scholastic-materials-mpara.html` "More from the field" cards | "More from the field" card links | We Heal / We Protect / We Empower | New names |
| A21 | `src/stories.html` | Card links to the programme pages | We Heal / We Protect / We Empower | New names |
| A22 | `src/we-protect.html` closing CTA | Closing CTA ghost button | "See We Empower" | "See Grace to Rise" |

**Rule:** never fall back to any "We + verb" pattern. If the client rejects "Grace to…", use plain **Education / Health / Protection / Livelihoods**.

---

## 3. [B] Giving product names — 5 renames, P1

| # | File | Field | Current | New |
|---|---|---|---|---|
| B1 | `partials/header.html` L128–152 | "Get Involved" mega-menu, 5 items (`<strong>` + descriptor) | Sponsor a Child / Heal a Child / Empower a Mother / Build a Clinic / Outreach Missions | **Sponsor a Learner** / **Keep a Child Well** / **Back a Caregiver** / **The Mpara Health Unit** / **Field Weeks**, with the descriptors from the brief §6.2 |
| B2 | `partials/header.html` L257–265 | Mobile drawer, "Get Involved" accordion | same five | same five |
| B3 | `partials/footer.html` L40–46 | "Get Involved" column | "Sponsor a child", "Heal a child", "Empower a mother", "Build a clinic" | "Sponsor a learner", "Keep a child well", "Back a caregiver", "The Mpara health unit" |
| B4 | `site.config.json` | 5 × `title`, 5 × `description`, 5 × `breadcrumb` | | New names. **Keep the phrase "child sponsorship" in the Sponsor a Learner description** for search |
| B5 | `site.config.json` | 5 × `file` | `sponsor-a-child.html` … | `sponsor-a-learner.html`, `keep-a-child-well.html`, `back-a-caregiver.html`, `mpara-health-unit.html`, `field-weeks.html` (see §12) |
| B6 | `src/sponsor-a-child.html:10` | `<h1>` | Sponsor a Child | **Sponsor a Learner** |
| B7 | `src/heal-a-child.html:10` | `<h1>` | Heal a Child | **Keep a Child Well** |
| B8 | `src/empower-a-mother.html:10` | `<h1>` | Empower a Mother | **Back a Caregiver** |
| B9 | `src/build-a-clinic.html:10` | `<h1>` | Build a Clinic | **The Mpara Health Unit Appeal** |
| B10 | `src/outreach-missions.html:10` | `<h1>` | Outreach Missions | **Field Weeks** |
| B11 | `src/index.html` hero slide 3 + "Ways to give" ×4 + CTA buttons | Button labels | "Empower a Mother", "Sponsor a Child", "Heal a Child", "Build a Clinic" | New names |
| B12 | `src/get-involved.html` action cards | 9 action cards: `<h3>` + button label | 5 of them carry old names, incl. "Join an Outreach Mission" | New names; "Join an Outreach Mission" → **"Join a Field Week"** |
| B13 | `src/we-educate.html` · `we-heal.html` · `we-empower.html` · `we-protect.html` (hero + closing-CTA buttons) | Programme-page hero + CTA buttons | old product names | New names |
| B14 | `src/we-heal.html` "Related" card 2 | "Related" card | "Build a Clinic" / "The clinic appeal" | "The Mpara Health Unit" / "The health unit appeal" |
| B15 | `src/heal-a-child.html` closing CTA ghost button | CTA ghost button | "Or fund the clinic" | "Or fund the health unit" |
| B16 | `src/build-a-clinic.html` closing CTA | Closing CTA buttons | "Give to the appeal" / "Partner on a phase" | Keep, but check the H2 (see E3) |
| B17 | `src/donate.html:58` | Fund `<select>` option | "The Mpara clinic appeal" | "The Mpara health unit appeal" |
| B18 | `src/contact.html` topic `<select>` | Topic `<select>` option | "Volunteering or outreach missions" | "Volunteering or field weeks" |
| B19 | `src/contact.html` shortcut card 1 | Shortcut card `<h3>` + link | "Sponsorship questions" → "Sponsorship page" | Update link target; label may stay |
| B20 | `src/volunteer.html:14,153,155` | Hero ghost button, CTA, body | "Outreach missions", "planned outreach missions", "See outreach missions" | "Field weeks", "planned field weeks", "See field weeks" |
| B21 | `src/our-story.html` · `our-impact.html` · `thank-you.html` · `404.html` (closing CTAs) | CTA buttons / cards | "Sponsor a Child" | "Sponsor a Learner" |
| B22 | `src/outreach-missions.html` hero + closing CTA | Hero + CTA buttons | "Volunteer remotely" (keep), "Apply to join" (keep) | No change |

Generic body copy — "sponsored child", "child sponsorship", "the health fund" — **stays**. Only product names change.

---

## 4. [C] The $38 price point — 7 fields, P1

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| C1 | `src/sponsor-a-child.html:11` | Hero lead | "From $38 a month, a child stays in class for a full year — with a named case worker and termly reporting on attendance, results and wellbeing." | "One steady monthly gift keeps a child in class for the whole school year, with a named case worker and termly reports on attendance, results and wellbeing." |
| C2 | `src/sponsor-a-child.html:43` | Section `<h2>` | "$38 a month, itemised" | "What your monthly gift covers" |
| C3 | `src/sponsor-a-child.html:45` | Paragraph under that H2 — **new first sentence** | — | "A primary place is budgeted at UGX `[TBC: costed monthly primary sponsorship]` (about US$`[TBC]`) a month." + `<!-- TODO(client): confirm costed monthly sponsorship figure from the education budget -->` |
| C4 | `src/donate.html:36–40` | 4 amount preset `<button>` labels **and** their `data-value` **and** the `value="38"` on `#d-amount` | $20 · $38 · $75 · $150 | $25 · $50 · $100 · $200 + `<!-- TODO(client): confirm preset amounts -->`. Set `#d-amount` default to `50` and move `aria-pressed="true"` to the $50 button |
| C5 | `src/contact.html:141` | Shortcut card body | "What $38 a month covers, how matching works, and what the termly report contains." | "What sponsorship covers, how matching works, and what the termly report contains." |
| C6 | `src/story-scholastic-materials-mpara.html:58` | Body paragraph | "Sponsorship at $38 a month covers fees and examination charges…" | "A monthly sponsorship covers fees and examination charges…" (rest of the sentence also changes — see F4) |
| C7 | `src/thank-you.html:37` | "Stand with a child" card | "Sponsorship from $38 a month covers a full school year…" | "A monthly sponsorship covers a full school year…" |

> **Note:** the brief lists five locations; this site has **seven**, because `thank-you.html` and the donate field default also carry the figure. After the edits, `$38` and `38 a month` must return **0**.

---

## 5. [D] "Seen and valued" hero and belief line — 4 fields, P1

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| D1 | `src/index.html:27` | Hero slide 1 `<h2>` | "Every child deserves to be *seen and valued*" | **"A child's circumstances should never set the limits of their future."** (keep an `<em>` on a phrase of your choice for the gold accent) |
| D2 | `src/index.html:28` | Hero slide 1 lead | "…in Kyegegwa District, Uganda — because a child's circumstances should never set the limits of their future." | "Boundless Gracia Children's Foundation walks with vulnerable children, teenage mothers and children with special needs in Kyegegwa District, Uganda, through school, health, protection and a stronger household income." |
| D3 | `src/index.html:105` | "Who we are" first sentence | "…we believe every child deserves to be seen, valued, loved and given the opportunity to build a better future." | "At Boundless Gracia Children's Foundation, we believe every child is worthy of love, protection and a fair chance at a future of their own making." |
| D4 | `src/our-story.html:27` | "How it began" first sentence | "…we believe that every child deserves to be seen, valued, loved, and given the opportunity to build a better future." | Same replacement as D3 |

`src/our-story.html:31` — "We exist because a child's circumstances should never determine the limits of their future." — **keep unchanged.** It is the source line.

---

## 6. [E] Brick-and-cement appeal framing — 4 fields, P1

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| E1 | `partials/header.html:140` | Mega-menu descriptor | "A health facility at Mpara, costed brick by brick." | "A permanent health unit for Mpara, costed phase by phase." |
| E2 | `src/index.html:296` | "Ways to give" card body | "Bricks, cement and the solar cold chain for a facility that removes the half-day walk." | "Construction, a maternal unit and solar-powered vaccine storage, for care at Mpara every day of the week." |
| E3 | `src/build-a-clinic.html:95` | Closing CTA `<h2>` | "Fund a phase, a room, or a pallet of bricks" | "Fund a phase, a room or a piece of equipment" |
| E4 | `src/donate.html:166` | "Where it goes" — clinic fund | "A restricted fund: bricks, cement, the maternal unit and the solar cold chain for a facility that removes the half-day walk entirely." | "A restricted fund for construction, the maternal unit, solar power and vaccine storage at a permanent health unit in Mpara." |

"Construction materials" in the Partner With Us in-kind list (`src/partner-with-us.html` in-kind card) is fine and stays.

---

## 7. [F] "Predictable vs unpredictable" argument — 7 fields, P1

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| F1 | `src/sponsor-a-child.html:25` | "Why monthly" `<h2>` | "Sponsorship is a commitment, not a transaction" | **"Steady support keeps a child steady in school"** |
| F2 | `src/sponsor-a-child.html:27` | First paragraph | "A school year is predictable. A child's health is not. Sponsorship covers fees, uniform and materials on a known calendar — and it also absorbs the unbudgeted week when malaria puts a child in bed, or a guardian falls ill and the household income stops." | "Fees, uniform and materials fall due on the school calendar. A monthly gift meets each of them on time. And because it arrives every month, a case worker can respond the week malaria keeps a child at home or a guardian's income suddenly stops, without first having to find the money." |
| F3 | `src/heal-a-child.html:24–27` | Kicker + `<h2>` + first paragraph | "Why a pooled fund" / "Illness does not keep to a budget line" / "You cannot schedule a child's malaria. You cannot predict which week…" + "So gifts to Heal a Child are pooled…" | Kicker "Why a shared fund" / `<h2>` **"Care that starts on the day it is needed"** / "Gifts to Keep a Child Well are pooled and spent as children present at outreaches and referrals, rather than assigned to one named child in advance. When an outreach finds three malnourished children instead of none, or a mother needs a referral to the district hospital this week, the money is already there, and it's reported in exactly the same detail." |
| F3b | `src/heal-a-child.html:29` | Third paragraph ("What it does not do is build a parallel health service…") | | **Keep unchanged** |
| F4 | `src/we-educate.html:130–132` | Closing CTA `<h2>` + body | "A school year is predictable. Make the funding predictable too." / "Monthly sponsorship is the only gift a case worker can plan a whole academic year around — which is why we ask for it before anything else." | **"Keep a learner in class all year"** / "A monthly sponsorship lets a case worker plan a child's whole school year (fees, materials and follow-up) with confidence. That's why we ask for it first." |
| F5 | `src/story-scholastic-materials-mpara.html:58` | Second half of the paragraph | "It is set up monthly because a school year is predictable and a household crisis is not; a monthly commitment absorbs the week when malaria…" | "It is set up monthly so that it keeps pace with the school calendar, and so that a case worker can respond the week malaria keeps a child at home or a guardian's income stops." |
| F6 | `src/get-involved.html:49` | "Heal a Child" card body | "Pooled and spent as cases present, because illness does not keep to a budget." | "Pooled and spent as cases present, so treatment never waits on a fundraising cycle." |

`src/build-a-clinic.html` "What we promise" list — the governance sentence about funds not being "moved to another budget line without the Board recording the decision" — **keep exactly as is.**

---

## 8. [G] Mission-trip language — 16 fields, P1

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| G1 | `src/get-involved.html:92–93` | Outreach card `<h3>` + body | "Join an Outreach Mission" / "Travel with us to Kyegegwa District for a planned outreach: health camps, distributions and household visits, with a real job to do." | **"Join a Field Week"** / "Join our field team in Kyegegwa District for a scheduled outreach week, covering health outreach days, distributions and household visits, with a defined role for every person." |
| G2 | `src/outreach-missions.html:11` | Hero lead | "Travel with us to Kyegegwa District for a planned outreach — health camps, distributions and household visits, with a defined job to do." | Same new text as G1 |
| G3 | `src/outreach-missions.html:23` | Section kicker | "What a mission is" | "What a field week is" |
| G4 | `src/outreach-missions.html:25` | `<h2>` | "Not a trip. A work plan with people attached." | "A work plan with people attached, not a trip." |
| G5 | `src/outreach-missions.html:27` | Body | "An outreach mission is a scheduled block of field work: a health camp run with district health teams…" | "A field week is a scheduled block of field work: an outreach day run with district health teams…" |
| G6 | `src/outreach-missions.html:31` | Body | "Missions are small by design." | "Field weeks are small by design." |
| G7 | `src/outreach-missions.html:91` | "You cover your own costs" card | "charges no mission or volunteer fee" | "charges no field-week or volunteer fee" |
| G8 | `src/outreach-missions.html:104` | Callout | "**Dates.** Mission dates are set against the programme calendar…" | "**Dates.** Field-week dates are set against the programme calendar…" |
| G9 | `src/outreach-missions.html:112` | Form section `<h2>` | "Register for the next mission" | "Register for the next field week" |
| G10 | `src/sponsor-a-child.html:176` | FAQ answer | "only as part of a planned outreach mission" | "only as part of a planned field week" |
| G11 | `src/volunteer.html:14,153,155` | Hero ghost button, CTA heading, CTA button | "Outreach missions", "planned outreach missions", "See outreach missions" | "Field weeks", "planned field weeks", "See field weeks" |
| G12 | `src/what-we-do.html:65` | Grace to Thrive tick list | "Community health outreaches and medical camps" | "Community health outreach days, run with district health teams" |
| G13 | `src/we-heal.html:50` | Tick list | "Community health outreaches and medical camps run jointly with district health teams." | "Community health outreach days run jointly with district health teams." |
| G14 | `src/heal-a-child.html:52` | "The consultation" card | "Clinical assessment at an outreach camp or health facility…" | "Clinical assessment at an outreach day or health facility…" |
| G15 | `src/volunteer.html:52` | "Clinical" skills card | "…for outreach camps, working alongside district health teams" | "…for outreach days, working alongside district health teams" |
| G16 | `src/our-impact.html:57` | Stat card body | "…through camps run with district health teams." | "…through outreach days run with district health teams." |

**Careful:** do **not** touch "mission" where it means the organisation's own mission — `src/vision-mission-values.html`, `src/governance.html` ("departs from the mission"), `site.config.json` titles and breadcrumbs for Vision, Mission & Values.

---

## 9. [H] Walking-distance motif — 11 fields, P2

Keep **one** physical-distance reference on the whole site: the problem statement on Grace to Thrive (H2 below).

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| H1 | `src/we-heal.html:11` | Hero lead | "…in communities where the nearest facility is hours away on foot." | "…in communities where the nearest health facility is far from home and costly to reach." |
| H2 | `src/we-heal.html:27` | Problem paragraph (**the one distance reference we keep**) | "A treatable fever becomes an emergency when the health centre is a half-day walk and the household has no transport money." | "A treatable fever becomes an emergency when the nearest health centre is `[TBC: distance from Mpara to the nearest HC III/IV]` away and the household has no money for transport." + `<!-- TODO(client): confirm distance -->`. If the client cannot confirm: "is out of reach". Keep the `<h2>` "Distance is the diagnosis" |
| H3 | `src/we-heal.html:126` | Closing CTA `<h2>` | "Care should not depend on how far you can walk" | "Good health should not depend on where a child is born" |
| H4 | `src/we-heal.html` "Related" card 2 | "Related" card body | "…a permanent outpatient and maternal health facility at Mpara." | Rephrase without distance: "…removes the gap between outreaches entirely." |
| H5 | `src/what-we-do.html:63` | Programme two body | "…when the health centre is a half-day walk and the household has no transport money." | "…when the nearest health centre is out of reach and the household has no money for transport." |
| H6 | `src/heal-a-child.html:113` | Closing CTA `<h2>` | "Care should not depend on how far you can walk" | "Treatment should start the day a child falls ill" |
| H7 | `src/get-involved.html:71` | Clinic card body | "…so care no longer depends on a half-day walk. Costed line by line." | "…so that care is there the day it is needed. Costed line by line." |
| H8 | `src/build-a-clinic.html:11` | Hero lead | "An outpatient and maternal health facility at Mpara, so that care no longer depends on a half-day walk." | "A permanent outpatient and maternal health unit at Mpara, with care that is open every day, not once a quarter." |
| H9 | `src/build-a-clinic.html` "The case" paragraphs | "The case" paragraphs — 2 further distance references | | Rephrase without walking or distance imagery |
| H10 | `src/index.html:296` | "Ways to give" clinic card | (also covered by E2) | See E2 |
| H11 | `src/donate.html:166` | Clinic fund note | (also covered by E4) | See E4 |

`src/outreach-missions.html:49` — "families arrive on foot" — **keep.** Factual operational detail in the day schedule.

---

## 10. [I] Caregiver wording and trades · [J] objective · [K] partner logos · [L] IA label

### [I] — 7 fields, P2

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| I1 | `src/empower-a-mother.html:25` | `<h2>` | "The fastest route to a child staying in school is a mother with an income" | **"A child stays in school when the household can keep them there"** |
| I2 | `src/empower-a-mother.html:27` | Beneficiary sentence | "…a widow, a grandmother, an elderly guardian holding several children together, or a teenage mother whose own schooling stopped abruptly." | "…a grandmother raising her grandchildren, a parent raising children alone on seasonal harvests, an elderly guardian holding several children together, or a teenage mother whose own schooling stopped too soon." |
| I3 | `src/we-empower.html:27` | Beneficiary sentence | same, "— a widow, a grandmother…" | Same replacement as I2 |
| I4 | `src/we-empower.html:53` | Tick list | "A women's skilling centre offering tailoring, crafts, catering and other marketable trades." | "A women's skilling centre offering tailoring, catering and other trades with real local demand." + `<!-- TODO(client): confirm trades offered at the skilling centre -->` (add this **once**, here) |
| I5 | `src/we-empower.html:108` | "Learn the trade" step | "…in tailoring, crafts or catering." | "…in tailoring, catering or another trade with local demand." |
| I6 | `src/empower-a-mother.html:53` | "Enterprise training" step | "…in tailoring, crafts or catering." | Same replacement as I5 |
| I7 | `src/our-team.html:170` | Director bio `data-text` | "…the women's skilling centre offering tailoring, crafts and catering." | "…the women's skilling centre offering tailoring, catering and other local trades." |

`src/index.html`, `src/our-story.html` and `src/vision-mission-values.html` — "single mothers, grandmothers and elderly guardians" — **leave unchanged.** That is the organisation's own strategic-plan wording.

### [J] — 1 field, P2

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| J1 | `src/vision-mission-values.html:123` | Objective (a) body | "To empower underprivileged children by equipping them with essential life skills and vocational training." | "To equip children and young people facing disadvantage with practical life skills and market-relevant vocational training." + `<!-- TODO(client): if the original wording is quoted verbatim from the registered Constitution, restore it and cite the Constitution -->` |

### [K] — 2 fields, P2

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| K1 | `src/index.html:313–319` (`.logo-row` L314, slots L315–318) | `.logo-row` with 4 `.partner-slot` boxes | "Partner logo" × 4 | **Comment the whole block out** (keep the markup so it can return). Keep the section `<h2>` and paragraph |
| K2 | `src/index.html:310` | Section intro, last sentence | "Partner logos appear here as agreements are signed." | "Our first partnership agreements are being finalised. Partners will be listed here once each agreement is signed." |

Keep the "Become a partner" button (`src/index.html:322`).

### [L] — 1 field, P2

| # | File | Field | Current | New |
|---|---|---|---|---|
| L1 | `site.config.json` → `what-we-do.html` | `title` | "What We Do — Boundless Gracia Children's Foundation" | "Our Work — Boundless Gracia Children's Foundation" |

> The breadcrumb for this page **already reads "Our Work"** — no change needed there. Renaming the file to `our-work.html` is optional; if you do, add a redirect stub (§12).

---

## 11. [M] Repetition · [N] claim accuracy

### [M] — trim after A–L are done, P3

| Phrase | Now | Keep | Change these |
|---|---:|---|---|
| "coded to (a/the) fund" | 14 | `donate.html` ×2, `governance.html` ×1 | `build-a-clinic.html` ×1, `empower-a-mother.html` ×1, `get-involved.html` ×3, `heal-a-child.html` ×1, `index.html` ×2, `partner-with-us.html` ×1, `what-we-do.html` ×1 → "ring-fenced for the fund you choose", "allocated to", "recorded against", or drop the clause |
| "a household can carry its own children" | 5 | `empower-a-mother.html` (→ Back a Caregiver) ×1 | `donate.html`, `get-involved.html`, `our-story.html`, `we-empower.html` → "so a household can provide for its own children", "so a family can stand on its own" |
| "tell you honestly where it fits" | 3 | `volunteer.html` ×1 | `index.html:253`, `our-team.html:221` → "we'll match you to a real gap in the work", "we'll tell you where it helps most" |
| "least photogenic gift" | 2 | `we-protect.html:114` (→ Grace to Belong) | `empower-a-mother.html:96` → "This is a quiet gift, and one of the most consequential on the site." |
| "plan a (whole) school year around" | 2 | `sponsor-a-child.html` ×1, `donate.html` ×1 | `our-impact.html:164`, `our-story.html:164` → "build a child's year around", "plan with confidence" |

### [N] — 3 fields, P3

| # | File:line | Field | Current | New |
|---|---|---|---|---|
| N1 | `partials/footer.html:20` | Trust badge (**all 26 pages**) | "Accounts published annually" | "Audited accounts: first report in preparation" |
| N2 | `src/index.html:272` | "Ways to give" lead | "Every gift is coded to a fund in our accounts, reported against our results framework and audited annually." | "Every gift is allocated to a fund in our accounts, reported against our results framework, and will be audited each year by an independent auditor." |
| N3 | `partials/footer.html:16` | Trust badge "Safeguarding policy in force" | | **Keep**, and add `<!-- TODO(client): confirm the safeguarding policy has been formally adopted by the Board -->` |

---

## 12. File renames and redirect stubs

Nine files, plus one optional. Each rename means: rename `src/<old>.html` → `src/<new>.html`, update the `file` key in `site.config.json`, update every internal link, then `node build.js`.

| Old | New | Source files to touch | References |
|---|---|---:|---:|
| `we-educate.html` | `grace-to-learn.html` | 8 | 10 |
| `we-heal.html` | `grace-to-thrive.html` | 10 | 11 |
| `we-protect.html` | `grace-to-belong.html` | 9 | 10 |
| `we-empower.html` | `grace-to-rise.html` | 12 | 14 |
| `sponsor-a-child.html` | `sponsor-a-learner.html` | 13 | 16 |
| `heal-a-child.html` | `keep-a-child-well.html` | 6 | 8 |
| `empower-a-mother.html` | `back-a-caregiver.html` | 6 | 9 |
| `build-a-clinic.html` | `mpara-health-unit.html` | 8 | 9 |
| `outreach-missions.html` | `field-weeks.html` | 4 | 6 |
| `what-we-do.html` *(optional)* | `our-work.html` | 9 | 15 |

**Redirect stubs.** This project has no server-side routing — it builds flat files. So each old path needs a hand-written stub in the project root (not in `src/`, so `build.js` leaves it alone):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=grace-to-learn.html">
<link rel="canonical" href="grace-to-learn.html">
<meta name="robots" content="noindex, follow">
<title>Moved — Boundless Gracia Children's Foundation</title>
</head>
<body><p>This page is now at <a href="grace-to-learn.html">Grace to Learn</a>.</p></body>
</html>
```

Add `tools/check-links.js` to your post-build routine — it already walks every root `*.html` and will catch a missed link.

**Also update after renaming:** `sitemap.xml` and `robots.txt` regenerate automatically from `site.config.json` — no manual edit needed.

---

## 13. Client to confirm (the TBC list)

| # | Item | Where the marker goes |
|---|---|---|
| 1 | Costed monthly sponsorship figure (UGX and US$) from the education budget | `src/sponsor-a-learner.html` (C3) |
| 2 | Donate preset amounts — are $25 / $50 / $100 / $200 right for this donor base? | `src/donate.html` (C4) |
| 3 | Distance from Mpara to the nearest HC III/IV | `src/grace-to-thrive.html` (H2) |
| 4 | Trades actually offered at the women's skilling centre | `src/grace-to-rise.html` (I4) |
| 5 | Is objective (a) quoted verbatim from the registered Constitution? If so, restore and cite it | `src/vision-mission-values.html` (J1) |
| 6 | Has the Board formally adopted the safeguarding policy? | `partials/footer.html` (N3) |
| 7 | Is "Extending grace. Restoring hope. Transforming lives." the registered strapline? | Brief §2 — appears in `src/our-story.html` H1, `src/index.html` hero eyebrow, `partials/footer.html`, `site.config.json` home title |
| 8 | Does the client accept the "Grace to…" programme family, or the plain fallback (Education / Health / Protection / Livelihoods)? | Blocks §2 entirely |
| 9 | Does the client accept the five new giving-product names? | Blocks §3 entirely |

Items 8 and 9 are **blocking**: 46 of the fields below cannot be written until they are answered.

---

## 14. Verification before sign-off

```bash
cd Updated-website

# 1. Zero-match grep across the sources
grep -rniE "We Educate|We Heal|We Protect|We Empower|We Treat|Heal a Child|Empower a Mother|Build a Clinic|Outreach Mission|field mission|seen and valued|seen, valued|brick by brick|pallet of bricks|bricks, cement|\\\$38|38 a month|Travel with us|medical camp|health camp|half-day walk|how far you can walk|hours away on foot|is predictable|does not keep to a budget|schedule a child|widow|underprivileged|Partner logo|Accounts published annually" src partials site.config.json

# 2. Rebuild and link-check
node build.js
node tools/check-links.js

# 3. Old URLs still resolve (stubs present)
ls we-educate.html we-heal.html we-protect.html we-empower.html \
   sponsor-a-child.html heal-a-child.html empower-a-mother.html \
   build-a-clinic.html outreach-missions.html

# 4. TODO markers — expect 6 in the files, plus items 7–9 tracked here
grep -rn "TODO(client)\|\[TBC" src partials
```

**Visual check** at 1280px and 375px: Home, Get Involved, Sponsor a Learner, Grace to Thrive, Donate. Confirm the new names still fit the mega-menu, the mobile drawer accordion, the footer columns and the programme card `<h3>`s. "Grace to Belong" is 3 characters longer than "We Protect"; "The Mpara Health Unit" is 8 longer than "Build a Clinic" — the nav and the action-card buttons are the two places to look.

---

## 15. Totals

| Change set | Priority | Fields | Blocked on client |
|---|---|---:|---|
| A — programme names | P1 | 22 | Yes (item 8) |
| B — giving product names | P1 | 22 | Yes (item 9) |
| C — $38 price point | P1 | 7 | Partly (item 1, 2) |
| D — "seen and valued" | P1 | 4 | No |
| E — brick and cement | P1 | 4 | No |
| F — predictable argument | P1 | 7 | No |
| G — mission-trip language | P1 | 16 | Yes (item 9, for "Field Weeks") |
| H — walking distance | P2 | 11 | Partly (item 3) |
| I — caregiver wording | P2 | 7 | Partly (item 4) |
| J — objective wording | P2 | 1 | Partly (item 5) |
| K — partner logos | P2 | 2 | No |
| L — IA label | P2 | 1 | No |
| M — repetition | P3 | 5 phrase groups, 14 edits | No |
| N — claim accuracy | P3 | 3 | Partly (item 6) |
| Renames + stubs | P1 | 9 files, 93 references, 9 stubs | Yes (items 8, 9) |

**121 copy fields, 9 file renames, 9 redirect stubs, 6 in-page TODO markers, 9 client questions.**

Unblocked work that can start now: **D, E, F, K, L, M, N** — 35 fields across 14 files.
