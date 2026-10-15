# Claude Code brief: remove Precious Kids Foundation carry-over copy from the Boundless Gracia website

> **How to use:** Save this file in the root of the Boundless Gracia project and tell Claude Code: *"Read `COPY_FIX_PROMPT.md` and carry it out in full. Report back when you're done."* Or paste the whole file in as your prompt.

---

## 1. Role and goal

You are a senior front-end engineer working with a senior copywriter. The Boundless Gracia Children's Foundation website (served locally at `http://127.0.0.1:8000/`) was built by cloning the structure and parts of the copy from another charity's site, **Precious Kids Foundation (PKF)**, `https://preciouskidsfoundation.org`. PKF is a separate US 501(c)(3) organisation. Boundless Gracia is a Ugandan company limited by guarantee, founded in 2024 by Asiimwe Eunice, based in Mpara Village, Kyegegwa District.

Your job is to **remove every piece of wording, naming, pricing and signature phrasing that came from PKF** and replace it with the Boundless Gracia copy given below. Then tidy up a short list of phrases the site repeats too often. The site needs to read as clearly and only Boundless Gracia's own.

Change copy only. Do not change layout, CSS classes, component structure, images, form logic or the visual design unless a step below says so.

---

## 2. Brand facts to preserve (do not change these)

- Name: **Boundless Gracia Children's Foundation** (legal: Boundless Gracia Children's Foundation Limited)
- Strapline: **Extending grace. Restoring hope. Transforming lives.** (keep it; the client has to confirm it's their registered strapline, so log it in the TODO list)
- Founder and year: Asiimwe Eunice, 2024
- Location: Mpara Village, Kyegegwa District, Western Uganda
- Phone, email, office hours, registration status lines, all safeguarding procedures (24-hour rule, Designated Safeguarding Lead line, whistleblower protection, no residential care)
- Who they serve: vulnerable and orphaned children, children with special needs or disabilities, teenage mothers, and their caregivers (single mothers, grandmothers, elderly guardians)
- The vision and mission statements on `vision-mission-values.html` (these come from the organisation's own constitution and strategy)
- The voice: plain, accountable and child-first. It says what things cost and what was missed, and it never makes a child the object of pity.

---

## 3. Hard rules

1. **Never invent facts.** That covers prices, distances, numbers of children, partner names, trades offered and dates. If a fact is needed and you don't have it, use the marker `[TBC: description]` and add an HTML comment `<!-- TODO(client): … -->` next to it. Keep these markers to the minimum stated below.
2. **Find every instance of a string.** Shared elements (header, mega-menu, mobile nav, footer) may be copied into every `.html` file, or they may live in a template or partial. Check first (Step 0). Then change each string in **all** of these places:
   - visible text, headings and buttons
   - `<title>`, `meta name="description"`, `og:title`, `og:description` and `twitter:*` tags
   - `alt`, `title` and `aria-label` attributes, visually hidden text and breadcrumb labels
   - JSON-LD and structured data, the sitemap, `robots.txt` and any JS that holds strings
3. **Watch for encoding.** Apostrophes may be `’`, `&rsquo;` or `'`. Dashes may be `—`, `&mdash;` or `–`. A phrase may also be split across inline tags (for example `<strong>`). Search case-insensitively and with a little flexibility.
4. **Keep the British/Ugandan spelling** already used on the site (organisation, programme, prioritise, centre).
5. **Renamed pages must still work.** If you rename a file or URL, update every internal link to it. Then leave a small redirect stub at the old path (a `<meta http-equiv="refresh">` plus a `<link rel="canonical">` to the new URL, or a server or framework redirect if the project has routing) so that old shared links don't return 404.
6. Keep a running log of every change in `CHANGELOG_COPY.md` (see section 7).

---

## 4. Step 0: Discovery (do this before editing)

1. Identify how the site is built: plain static HTML, Django or Jinja templates (`{% include %}`), or a static-site generator. If shared partials exist, edit those rather than each output file.
2. List every page. The known pages are: `index`, `our-story`, `vision-mission-values`, `our-team`, `governance`, `our-impact`, `what-we-do`, `we-educate`, `we-heal`, `we-protect`, `we-empower`, `get-involved`, `sponsor-a-child`, `heal-a-child`, `empower-a-mother`, `build-a-clinic`, `volunteer`, `outreach-missions`, `partner-with-us`, `donate`, `stories`, `gallery`, `contact` and `story-scholastic-materials-mpara`.
3. Run a baseline grep for every string in section 6 and save the counts to `CHANGELOG_COPY.md` under **"Baseline"**.

---

## 5. What was carried over from Precious Kids Foundation (the audit)

These are the findings behind the changes. Priority **P1** is copied or near-copied signature wording, pricing or naming. **P2** is structural or thematic echo. **P3** is internal repetition that makes the copy feel templated.

| # | Pri | PKF original | Where it shows up on Boundless Gracia | Issue |
|---|---|---|---|---|
| A | P1 | Brand pillars **"We Treat ‖ We Educate ‖ We Empower"**, with pages `/we-treat/`, `/we-educate/`, `/we-empower/` | Programme names **We Educate / We Heal / We Protect / We Empower**, with pages `we-educate.html`, `we-heal.html`, `we-protect.html`, `we-empower.html`. They appear on every page (mega-menu, footer, cards, page titles, donate fund notes) | "We Educate" and "We Empower" are identical. "We Heal" is a synonym of "We Treat". The "We + verb" device is PKF's signature brand system, and two URL slugs are the same as PKF's |
| B | P1 | Giving products **Treat a Medical Child / Sponsor an Orphan / Build a Hospital / Empower a Woman** | **Heal a Child / Sponsor a Child / Build a Clinic / Empower a Mother**. These appear in the nav, the footer, home "Ways to give", Get Involved and their own pages | A one-to-one copy of PKF's product set using swapped synonyms, in nearly the same order |
| C | P1 | **"For $38/Month, you can educate an orphan"** | `$38 a month` on Sponsor (×2), Donate preset `$38`, Contact ("What $38 a month covers") and the scholastic-materials story | PKF's price point was carried over as fact. It is not Boundless Gracia's costed figure |
| D | P1 | **"They are seen. They are valued. They are worth fighting for."** (PKF's recurring tagline) | Home hero H1: **"Every child deserves to be seen and valued"**. Home and Our Story: "every child deserves to be **seen, valued**, loved…" | Echoes PKF's signature line in the most prominent spot on the site |
| E | P1 | Build a Hospital: **"Brick by Brick we can collectively build"**, "$40 buys 1,000 bricks, $50 buys 5 bags of cement…" | Mega-menu "costed **brick by brick**", home card "**Bricks, cement** and the solar cold chain", Build a Clinic "a pallet of bricks", Donate "bricks, cement…" | PKF's appeal framing, carried into the clinic appeal |
| F | P1 | Home, "Why Support a Medical Child": education needs are "**predictable** month after month", while medical kids have "**uncertain, untimely**" needs | Sponsor: "A school year is **predictable**. A child's health is not." We Educate: "A school year is predictable. Make the funding predictable too." Heal a Child: "Illness does not keep to a budget line / You cannot schedule a child's malaria". Story page: "a school year is predictable and a household crisis is not" | PKF's core fundraising argument, reworded |
| G | P1 | **"Grab Your Passport And Travel With Us To Uganda"**, "Medical Missions", "Medical Mission Trip", "Medical Camps" | "**Travel with us** to Kyegegwa District…" (Get Involved, Outreach Missions), "**Outreach Missions**", "field mission", "**medical camps**" (What We Do, We Heal), "health camps" | PKF's mission-trip naming and call to action |
| H | P2 | Build a Hospital: patients "have to **walk over 60 kilometres**", "Bring medical help closer…" | "**half-day walk**" ×8 (home, What We Do, We Heal, Get Involved, Build a Clinic ×3, Donate), "hours away **on foot**", "Care should not depend on **how far you can walk**" ×2 | PKF's distance-to-care argument, and an over-used motif |
| I | P2 | Empower a Woman: "**Widows** and Single mothers", "Support a Single Mother", "weaving, sewing, **tailoring, craftmaking**…" | We Empower and Empower a Mother: "a **widow**, a grandmother…", "The fastest route… is **a mother with an income**", skilling centre "**tailoring, crafts**, catering" | PKF's beneficiary language and skills list |
| J | P2 | "we believe in preparing them for life beyond just books, equipping them through **skills development**" / "underprivileged" | Objective: "To empower **underprivileged** children by equipping them with essential life skills and **vocational training**." | Phrasing close to PKF's education copy |
| K | P2 | "**Some of Our Partners**" logo strip | Home: four "**Partner logo**" placeholder boxes | Structure copied, and a live placeholder looks unfinished |
| L | P2 | Pages "What We Do", "Our Vision, Mission and Values", "Our Impact", and the "DONATE NOW" button | `what-we-do.html` titled "What We Do", plus `vision-mission-values.html` and `our-impact.html` | Mirrored information architecture. Low risk because these are sector-standard names, but "What We Do" should match the site's own nav label, "Our Work" |
| M | P3 | — | "coded to (a/the) fund" ~15×, "a household can carry its own children" ~6×, "tell you honestly where it fits" ~5×, "least photogenic gift" ×2, "plan a (whole) school year around" ~5× | Internal repetition. It makes the copy read as templated |
| N | P3 | — | Footer badge "**Accounts published annually**" and home "…and **audited annually**", while Our Impact says the first audited report is still "In preparation" | Claim accuracy. Donors and the NGO Bureau will read these as present-tense facts |

---

## 6. Change set (carry out in this order)

### 6.1 [A] Rename the four programme areas (P1)

Use a programme family that belongs to Boundless Gracia and is built on its own brand word, *grace*:

| Old name | New name | New URL | Mega-menu descriptor | Footer line |
|---|---|---|---|---|
| We Educate | **Grace to Learn** | `grace-to-learn.html` | Schooling, early years and skills, from ECD to vocational training. | Grace to Learn — education & child development |
| We Heal | **Grace to Thrive** | `grace-to-thrive.html` | Health outreach, nutrition, immunisation and safe water. | Grace to Thrive — health, nutrition & WASH |
| We Protect | **Grace to Belong** | `grace-to-belong.html` | Child protection, safeguarding and care within a family. | Grace to Belong — child protection & family care |
| We Empower | **Grace to Rise** | `grace-to-rise.html` | Savings groups, enterprise training and caregiver skilling. | Grace to Rise — livelihoods & household resilience |

Apply the new names everywhere the old ones appear:
- Page H1s. Keep each page's existing subheading; only the name changes.
- `<title>` tags. Use this pattern: `Grace to Learn — Education & Child Development | Boundless Gracia`, `Grace to Thrive — Health, Nutrition & WASH | Boundless Gracia`, `Grace to Belong — Child Protection & Family Strengthening | Boundless Gracia`, `Grace to Rise — Livelihoods & Economic Empowerment | Boundless Gracia`.
- Home "What we do" cards. What We Do section headings: "Programme one / **Grace to Learn** — education and child development", and the same pattern for the other three.
- "Inside We Educate" → "Inside Grace to Learn" (and the same for the other three).
- "Related" cards on each programme page.
- The Donate page's "Where it goes" fund notes, which end in "We Educate." and so on.
- Story kickers, breadcrumbs and the footer.

Rename the four files or routes and leave redirect stubs at the old paths (rule 5).

> If the client rejects the "Grace to…" family, the fallback is plain department names: **Education**, **Health**, **Protection**, **Livelihoods**. Do not revert to the "We + verb" pattern under any circumstances.

### 6.2 [B] Rename the giving products (P1)

| Old | New name / nav label | New URL | Mega-menu descriptor |
|---|---|---|---|
| Sponsor a Child | **Sponsor a Learner** | `sponsor-a-learner.html` | A full school year, reported back to you each term. |
| Heal a Child | **Keep a Child Well** | `keep-a-child-well.html` | Consultation, medicine, referral transport and follow-up. |
| Empower a Mother | **Back a Caregiver** | `back-a-caregiver.html` | A savings group, training and a start-up grant for a caregiver. |
| Build a Clinic | **The Mpara Health Unit** (page H1: "The Mpara Health Unit Appeal") | `mpara-health-unit.html` | A permanent health unit for Mpara, costed phase by phase. |
| Outreach Missions | **Field Weeks** | `field-weeks.html` | Join a scheduled outreach week in Kyegegwa District. |
| Volunteer With Us / Partner With Us / Make a Donation | *(keep as they are)* | *(keep)* | *(keep)* |

Update all buttons and CTAs that use the old names, for example:
- "Sponsor a Child" buttons → "Sponsor a Learner"
- "Heal a Child" → "Keep a Child Well"
- "Empower a Mother" → "Back a Caregiver"
- "Build a Clinic" / "Fund the clinic" / "Or fund the clinic" → "The Mpara Health Unit" / "Fund the health unit" / "Or fund the health unit"
- "Join an Outreach Mission" → "Join a Field Week"
- "Outreach missions" (link text) → "Field weeks"
- Footer list: "Sponsor a learner", "Keep a child well", "Back a caregiver", "The Mpara health unit"
- Donate fund dropdown: "The Mpara clinic appeal" → "The Mpara health unit appeal"
- Contact dropdown: "Volunteering or outreach missions" → "Volunteering or field weeks"

In body copy, generic phrases such as "sponsored child", "child sponsorship" and "the health fund" can stay. Only the **product names** change. Keep the phrase "child sponsorship" in the Sponsor a Learner meta description for search.

### 6.3 [C] Remove PKF's $38 price point (P1)

Change the copy so that only **one** figure is needed, and mark that figure for the client to supply.

| Page | Current | Replace with |
|---|---|---|
| Sponsor (hero lead) | "From $38 a month, a child stays in class for a full year — with a named case worker and termly reporting on attendance, results and wellbeing." | "One steady monthly gift keeps a child in class for the whole school year, with a named case worker and termly reports on attendance, results and wellbeing." |
| Sponsor (section H2) | "$38 a month, itemised" | "What your monthly gift covers" |
| Sponsor (paragraph under that H2, appended as a new first sentence) | — | "A primary place is budgeted at UGX [TBC: costed monthly primary sponsorship] (about US$[TBC]) a month." plus `<!-- TODO(client): confirm costed monthly sponsorship figure from the education budget -->` |
| Donate (amount presets) | `$20 · $38 · $75 · $150` | `$25 · $50 · $100 · $200`, plus `<!-- TODO(client): confirm preset amounts -->` |
| Contact (shortcut card) | "What $38 a month covers, how matching works, and what the termly report contains." | "What sponsorship covers, how matching works, and what the termly report contains." |
| Story: scholastic materials | "Sponsorship at $38 a month covers fees and examination charges…" | "A monthly sponsorship covers fees and examination charges…" |

When you're done, the strings `$38` and `38 a month` must not appear anywhere.

### 6.4 [D] Replace the "seen and valued" hero and belief line (P1)

**Home hero H1**
- Current: "Every child deserves to be seen and valued"
- New: **"A child's circumstances should never set the limits of their future."**

**Home hero lead.** Rewrite it so the line above isn't repeated.
- Current: "…in Kyegegwa District, Uganda — because a child's circumstances should never set the limits of their future."
- New: "Boundless Gracia Children's Foundation walks with vulnerable children, teenage mothers and children with special needs in Kyegegwa District, Uganda, through school, health, protection and a stronger household income."

**Belief line** (Home "Who we are", and Our Story "How it began")
- Current: "…we believe (that) every child deserves to be seen, valued, loved(,) and given the opportunity to build a better future."
- New: "At Boundless Gracia Children's Foundation, we believe every child is worthy of love, protection and a fair chance at a future of their own making."

Our Story already says "We exist because a child's circumstances should never determine the limits of their future." Keep it there, since it's the source line.

### 6.5 [E] Remove the brick-and-cement appeal framing (P1)

| Location | Current | Replace with |
|---|---|---|
| Mega-menu (all pages) | "A health facility at Mpara, costed brick by brick." | "A permanent health unit for Mpara, costed phase by phase." |
| Home, "Ways to give" card | "Bricks, cement and the solar cold chain for a facility that removes the half-day walk." | "Construction, a maternal unit and solar-powered vaccine storage, for care at Mpara every day of the week." |
| Build page, closing CTA H2 | "Fund a phase, a room, or a pallet of bricks" | "Fund a phase, a room or a piece of equipment" |
| Donate, "Where it goes" | "A restricted fund: bricks, cement, the maternal unit and the solar cold chain for a facility that removes the half-day walk entirely." | "A restricted fund for construction, the maternal unit, solar power and vaccine storage at a permanent health unit in Mpara." |

Then grep for every remaining `brick` and `cement` (the baseline shows them on every page, so they may sit in a hidden element, a template or an alt text). Rephrase each one as "construction" or "building materials". "Construction materials" on Partner With Us (in-kind list) is fine and can stay.

### 6.6 [F] Rewrite the "predictable vs unpredictable" argument (P1)

| Location | Current | Replace with |
|---|---|---|
| Sponsor, "Why monthly" H2 + first paragraph | H2 "Sponsorship is a commitment, not a transaction" / "A school year is predictable. A child's health is not. Sponsorship covers fees, uniform and materials on a known calendar — and it also absorbs the unbudgeted week when malaria puts a child in bed, or a guardian falls ill and the household income stops." | H2 **"Steady support keeps a child steady in school"** / "Fees, uniform and materials fall due on the school calendar. A monthly gift meets each of them on time. And because it arrives every month, a case worker can respond the week malaria keeps a child at home or a guardian's income suddenly stops, without first having to find the money." |
| Keep a Child Well (was Heal a Child), "Why a pooled fund" H2 + first two paragraphs | "Illness does not keep to a budget line" / "You cannot schedule a child's malaria. You cannot predict which week…" / "So gifts to Heal a Child are pooled and spent as cases present…" | Kicker "Why a shared fund" / H2 **"Care that starts on the day it is needed"** / "Gifts to Keep a Child Well are pooled and spent as children present at outreaches and referrals, rather than assigned to one named child in advance. When an outreach finds three malnourished children instead of none, or a mother needs a referral to the district hospital this week, the money is already there, and it's reported in exactly the same detail." Keep the paragraph that follows ("What it does not do is build a parallel health service…") unchanged. |
| Grace to Learn (was We Educate), closing CTA | H2 "A school year is predictable. Make the funding predictable too." / "Monthly sponsorship is the only gift a case worker can plan a whole academic year around — which is why we ask for it before anything else." | H2 **"Keep a learner in class all year"** / "A monthly sponsorship lets a case worker plan a child's whole school year (fees, materials and follow-up) with confidence. That's why we ask for it first." |
| Story: scholastic materials | "It is set up monthly because a school year is predictable and a household crisis is not; a monthly commitment absorbs the week when malaria…" | "It is set up monthly so that it keeps pace with the school calendar, and so that a case worker can respond the week malaria keeps a child at home or a guardian's income stops." |
| Get Involved, Heal card | "Pooled and spent as cases present, because illness does not keep to a budget." | "Pooled and spent as cases present, so treatment never waits on a fundraising cycle." |

Leave the governance sentence on the health-unit page about funds not being "moved to another budget line without the Board recording the decision" exactly as it is.

### 6.7 [G] Replace the mission-trip language (P1)

- **Get Involved card**
  - Current: "Join an Outreach Mission / Travel with us to Kyegegwa District for a planned outreach: health camps, distributions and household visits, with a real job to do."
  - New: "**Join a Field Week** / Join our field team in Kyegegwa District for a scheduled outreach week, covering health outreach days, distributions and household visits, with a defined role for every person."
- **Field Weeks page (was Outreach Missions), hero lead**
  - Current: "Travel with us to Kyegegwa District for a planned outreach — health camps, distributions and household visits, with a defined job to do."
  - New: "Join our field team in Kyegegwa District for a scheduled outreach week, covering health outreach days, distributions and household visits, with a defined role for every person."
- **Field Weeks page, other wording**
  - Section kicker "What a mission is" → "What a field week is"
  - H2 "Not a trip. A work plan with people attached." → "A work plan with people attached, not a trip."
  - "An outreach mission is a scheduled block of field work" → "A field week is a scheduled block of field work"
  - "Missions are small by design." → "Field weeks are small by design."
  - "charges no mission or volunteer fee" → "charges no field-week or volunteer fee"
  - "Dates. Mission dates are set…" → "Dates. Field-week dates are set…"
  - "Register for the next mission" → "Register for the next field week"
- **Sponsor FAQ.** "only as part of a planned outreach mission" → "only as part of a planned field week"
- **Volunteer page.** "Outreach missions" → "Field weeks", "planned outreach missions" → "planned field weeks", "See outreach missions" → "See field weeks"
- **"Medical camps" / "health camps"**
  - What We Do list: "Community health outreaches and medical camps" → "Community health outreach days, run with district health teams"
  - Grace to Thrive list: "Community health outreaches and medical camps run jointly with district health teams." → "Community health outreach days run jointly with district health teams."
  - Every other "health camp(s)" → "outreach day(s)". This includes Our Impact ("camps run with district health teams" → "outreach days run with district health teams"), Volunteer ("outreach camps" → "outreach days") and Keep a Child Well ("at an outreach camp" → "at an outreach day").
- **Careful:** do **not** touch "mission" where it means the organisation's mission (vision and mission, "departs from the mission" and so on).

### 6.8 [H] Tone down the walking-distance motif (P2)

Keep at most **one** physical-distance reference on the whole site: the problem statement on Grace to Thrive. Change everything else as follows.

| Location | Current | Replace with |
|---|---|---|
| Grace to Thrive, hero lead | "…in communities where the nearest facility is hours away on foot." | "…in communities where the nearest health facility is far from home and costly to reach." |
| Grace to Thrive, problem H2 + first line | "Distance is the diagnosis" / "A treatable fever becomes an emergency when the health centre is a half-day walk and the household has no transport money." | Keep the H2. Body: "A treatable fever becomes an emergency when the nearest health centre is [TBC: distance from Mpara to the nearest HC III/IV] away and the household has no money for transport." plus `<!-- TODO(client): confirm distance -->`. If the client can't confirm a figure, use "is out of reach". |
| What We Do, Programme two | "…when the health centre is a half-day walk and the household has no transport money." | "…when the nearest health centre is out of reach and the household has no money for transport." |
| Grace to Thrive closing CTA H2 | "Care should not depend on how far you can walk" | "Good health should not depend on where a child is born" |
| Keep a Child Well closing CTA H2 | "Care should not depend on how far you can walk" | "Treatment should start the day a child falls ill" |
| Get Involved, health unit card | "…so care no longer depends on a half-day walk. Costed line by line." | "…so that care is there the day it is needed. Costed line by line." |
| Health unit page, hero lead | "An outpatient and maternal health facility at Mpara, so that care no longer depends on a half-day walk." | "A permanent outpatient and maternal health unit at Mpara, with care that is open every day, not once a quarter." |
| Health unit page, other "half-day walk" (×2) and Grace to Thrive "Related" card | — | Rephrase without walking or distance imagery, for example "…removes the gap between outreaches entirely." |

"Families arrive on foot" on the Field Weeks day schedule is a factual operational detail and can stay.

### 6.9 [I] Caregiver wording and the skills list (P2)

- **Back a Caregiver page H2**
  - Current: "The fastest route to a child staying in school is a mother with an income"
  - New: **"A child stays in school when the household can keep them there"**
- **Beneficiary sentence** (Grace to Rise and Back a Caregiver)
  - Current: "…a widow, a grandmother, an elderly guardian holding several children together, or a teenage mother whose own schooling stopped (abruptly)."
  - New: "…a grandmother raising her grandchildren, a parent raising children alone on seasonal harvests, an elderly guardian holding several children together, or a teenage mother whose own schooling stopped too soon."
- **Skilling-centre trades.** Remove "crafts" wherever the trades are listed.
  - "tailoring, crafts, catering and other marketable trades" → "tailoring, catering and other trades with real local demand"
  - "tailoring, crafts or catering" → "tailoring, catering or another trade with local demand"
  - Add `<!-- TODO(client): confirm trades offered at the skilling centre -->` once, on Grace to Rise.
- Leave the formal beneficiary definition on Home, Our Story and Vision, Mission & Values ("single mothers, grandmothers and elderly guardians") **unchanged**. It is the organisation's own strategic-plan wording.

### 6.10 [J] Objective wording (P2), Vision, Mission & Values page

- Current: "To empower underprivileged children by equipping them with essential life skills and vocational training."
- New: "To equip children and young people facing disadvantage with practical life skills and market-relevant vocational training."
- Add `<!-- TODO(client): if the original wording is quoted verbatim from the registered Constitution, restore it and cite the Constitution -->`.

### 6.11 [K] Partner logos placeholder (P2), Home page

Remove the four "Partner logo" placeholder boxes, but keep the markup commented out so it can return later. Keep the section heading ("We work with communities and government, not around them") and its paragraph. Then replace the line "Partner logos appear here as agreements are signed." with:

> "Our first partnership agreements are being finalised. Partners will be listed here once each agreement is signed."

Keep the "Become a partner" button.

### 6.12 [L] Information architecture labels (P2)

- `what-we-do.html`: change `<title>` and breadcrumb from "What We Do" to **"Our Work"**, to match the main nav. Keep the URL (low risk), or rename it to `our-work.html` with a redirect stub. Your call; log whichever you do.
- Leave "Vision, Mission & Values", "Our Impact" and "Donate Now" as they are. These are sector-standard labels.

### 6.13 [M] Cut down internal repetition (P3)

After 6.1 to 6.12 are done, re-grep these phrases and trim them to the target counts. Use the alternatives given, and vary them rather than repeating one replacement.

| Phrase | Keep | Use instead elsewhere |
|---|---|---|
| "coded to (a / the) fund" | Donate page (up to 2), Governance (1) | "ring-fenced for the fund you choose", "allocated to", "recorded against", or drop the clause |
| "(so) a household can carry its own children" | Back a Caregiver (1) | "so a household can provide for its own children", "so a family can stand on its own" |
| "tell you honestly where it fits" | Volunteer page (1) | "we'll match you to a real gap in the work", "we'll tell you where it helps most" |
| "least photogenic gift" | Grace to Belong (1) | Back a Caregiver: "This is a quiet gift, and one of the most consequential on the site." |
| "plan a (whole) school year around" | Sponsor a Learner (1), Donate (1) | "build a child's year around", "plan with confidence" |

### 6.14 [N] Claim accuracy (P3)

- **Footer trust badge** (all pages): "Accounts published annually" → "Audited accounts: first report in preparation"
- **Home, "Ways to give" lead**
  - Current: "Every gift is coded to a fund in our accounts, reported against our results framework and audited annually."
  - New: "Every gift is allocated to a fund in our accounts, reported against our results framework, and will be audited each year by an independent auditor."
- **Footer badge "Safeguarding policy in force".** Keep it, but add `<!-- TODO(client): confirm the safeguarding policy has been formally adopted by the Board -->`.

---

## 7. Verification (must pass before you report done)

1. **Zero-match grep.** Run a case-insensitive search across all site files, excluding `CHANGELOG_COPY.md`, this brief and the redirect stubs. Each of these must return **0**:
   ```
   We Educate | We Heal | We Protect | We Empower | We Treat
   Heal a Child | Empower a Mother | Build a Clinic | Outreach Mission | field mission
   Sponsor a Child (as a product name/button/nav label)
   seen and valued | seen, valued
   brick by brick | pallet of bricks | bricks, cement
   \$38 | 38 a month
   Travel with us | medical camp | health camp
   half-day walk | how far you can walk | hours away on foot
   is predictable | does not keep to a budget | schedule a child
   widow | underprivileged | Partner logo
   Accounts published annually
   href="we-educate.html | we-heal.html | we-protect.html | we-empower.html | sponsor-a-child.html | heal-a-child.html | empower-a-mother.html | build-a-clinic.html | outreach-missions.html  (outside redirect stubs)
   ```
2. **Link check.** Crawl `http://127.0.0.1:8000/` (a small Python script is fine). Every internal link must return 200, and every old URL must redirect to its new page.
3. **Visual check.** Open Home, Get Involved, Sponsor a Learner, Grace to Thrive and Donate. Confirm that headings still fit their containers (the new names are a similar length) and that the mega-menu and mobile nav show the new labels.
4. **TODO count.** List every `[TBC:` and `TODO(client)` marker. There should be roughly six:
   - sponsorship figure
   - donate presets
   - health-centre distance
   - skilling-centre trades
   - constitution objective
   - safeguarding policy adoption
   
   Also add the strapline confirmation from section 2 to the list.

### Report back with

- `CHANGELOG_COPY.md`, containing:
  - the baseline counts
  - each change as **file → old text → new text**
  - the files and URLs you renamed and the redirects you added
  - the final grep results (all zero)
  - a **"Client to confirm"** list built from the TODO markers
- A short summary of anything you couldn't change and why.
