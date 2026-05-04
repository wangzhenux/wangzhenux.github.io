# Portfolio Revamp — Design Spec

| | |
|---|---|
| **Date** | 2026-05-04 |
| **Owner** | Zhen Wang |
| **Status** | Approved for implementation planning |
| **Canonical mockup** | `.superpowers/brainstorm/<session>/content/case-study-twilio-v4.html` |
| **Companion screens** | `responsive-views.html`, `option-3-homepage-v2.html`, `about-resume-and-updates.html`, `palette-refined.html`, `hero-final.html`, `portrait-options.html` |

---

## 1. Context and goals

### 1.1 What we are building

A revamp of `wangzhenux.github.io` — Zhen's personal portfolio — for the next round of senior product designer job applications, plus an architecture that supports **adding new case studies (Tripalink, UnitPulse) on top** without manual `dist`-copy rituals.

The current site is a webpack + React app with a manual deploy workflow (now consolidated into one repo with GitHub Actions, prior session). The visual design is dated and does not match the bar reviewers at design-led product companies expect in 2025-2026.

### 1.2 Why now

The previous deploy infrastructure was rebuilt in the prior session. The portfolio's content and visual story have not been updated since the Tasktop years. New case studies (Twilio is the strongest recent piece, plus upcoming Tripalink and UnitPulse) need a frame that lets them shine.

### 1.3 Target audience

Two overlapping segments:

- **Design-led product companies** — Stripe, Linear, Figma, Notion, Vercel, Arc/Browser, Raycast, Cron. Reward taste, opinion, and product craft.
- **AI-era new wave** — Anthropic, OpenAI, Cursor, Perplexity, Replit. Reward distinctive, expressive, fast-moving aesthetic.

### 1.4 Stylistic position

"**B leaning A**" on the distinctiveness spectrum:

- A — Refined / restrained (Stripe, Vercel docs)
- B — Expressive / opinionated (Linear, Cursor, Brian Lovin)
- C — Maximalist / art-forward

Lean *toward* refined, but with enough opinion to feel authored. **Storytelling is the most important quality** — case study writing and narrative structure carry more weight than visual fireworks.

### 1.5 Success criteria

- Senior PD reviewers at the target companies open a case study and read past the first scroll.
- The site reads as a craft piece in itself, not a CMS template.
- Adding a new case study takes < 1 hour and zero CSS edits.
- Deploys are fully automated via the GitHub Actions workflow already in place.

---

## 2. Strategic decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Design archetype | **Story-led** (option 3 of 3 explored) | Maps directly onto "storytelling is most important" + existing case-study assets |
| Visual palette | **Warm Editorial Pro** (light-first; tokens prepared for dark) | Warm + welcoming + confident; pairs well with cream paper aesthetic |
| Dark mode | **Light only for v1** | Editorial-paper sites traditionally light-only. Tokens prepared so adding dark is a one-block edit later. |
| Curation approach | **Tiered** — 4–6 featured headliners + clickable "Earlier work" archive | Senior PD reviewers deep-read 2-3 cases; aggressive curation matters |
| Hero copy (F2) | "Hi, I'm Zhen, a senior product designer who likes quiet, useful software." Sub: "Ten years at Twilio, Tasktop, and Rackspace. Outside work: badminton, ping-pong, calligraphy, and painting." | No double "I'm", no em dash, real hobbies pulled from existing About page |
| Portrait | **Calligraphic seal** (recommended) — a "Z" rendered as a single sumi-e brushstroke inside a chop / yìnzhāng frame. Sumi-e portrait is the strong runner-up. | Authentic to Zhen's calligraphy practice; avoids AI-photo uncanny valley |
| Tech stack | **Migrate to Astro + MDX** (recommended; see §12) | Story-led friendly, MDX for case studies makes new cases trivial to add, builds fast, content-first. Existing webpack/React stack is acceptable but adds friction. |

---

## 3. Information architecture

### 3.1 Site map

```
/                       Homepage (Work)
  └── #featured         Featured case (one rotating spotlight)
  └── #selected         3-5 selected secondary cases
  └── #writing          Writing teasers (links out to Medium for now)
  └── #archive          Earlier-work pill list

/work/twilio            Case studies (Astro MDX route)
/work/tasktop-hub
/work/tasktop-viz
/work/rackspace-servicenow
/work/park-engagement
/work/tripalink         (future)
/work/unitpulse         (future)

/writing                Writing index
/writing/<slug>         Individual essay (or external link to Medium)

/about                  About / Curriculum vitae (combined)
                        With prominent "Download résumé PDF" + "View in browser"
```

### 3.2 Curation order (initial)

Featured rotation slot: **Twilio Onboarding** (most recent + clearest outcome).

Selected work (4-6, ordered by hiring-manager strength):
1. Tasktop Hub — making integration configuration portable
2. Tasktop Viz — dashboards engineering directors actually opened
3. Rackspace ServiceNow — onboarding flow that survived three reorgs
4. Park Engagement — research-led journey map for the National Park Service

Archive (clickable, de-emphasized): iLab, Citportal, Pool My Ride, TechScene, PlotGuru, Sketches & visual studies.

When Tripalink and UnitPulse land, they enter as featured-rotation candidates or top-of-Selected — the IA scales without restructure.

### 3.3 Section structure within a case study (canonical: 7 sections)

This structure maps 1:1 to Zhen's existing Twilio Onboarding source content; no fabricated phases.

| # | Section | Purpose |
|---|---|---|
| 01 | The problem | Three reasons something stalled, plus the JTBD in customer language |
| 02 | Looking around | Competitive scan — 3-4 competitors, Strength + Gap framing per row |
| 03 | Seven ideas, narrowed to two | Visual `.ideas-list` showing all candidates with selected ones highlighted, plus design-critique block |
| 04 | Validating with usability testing | 10 participants / 2 objectives stat block, 3 finding quote cards, 3 recommendation cards |
| 05 | A phased approach | Phase 1/2/3 each as: number + content (text in body column) + sibling `.image-showcase` (full-width design mockup) |
| 06 | The outcome | Big metric (e.g., +179%) + supporting paragraph |
| 07 | What I learned | Two reflection cards — labels frame the lesson, body explains |

Section IDs are `s01`–`s07` (prefixed with `s` because numeric IDs break `querySelector` and many anchor-link tools).

A right-side sticky **TOC** lists these 7 sections with a visual prefix (`01`, `02`, … `07`); click smooth-scrolls; scrollspy follows the section in view. The visual prefix is for the reader; the technical anchor IDs are `s01`–`s07` (numeric leading characters break `querySelector` and many anchor-link tools).

---

## 4. Visual system

### 4.1 Color palette (Warm Editorial Pro · light)

```css
:root {
  /* Surface */
  --bg-primary:    #FAF5E8;   /* warm cream paper */
  --bg-secondary:  #F1E9D5;   /* deeper paper for sectioned bands */
  --bg-inverse:    #181210;   /* footer / dark mode bg */
  --stage-bg:      #DDD3C2;   /* outer stage / mockup chrome */

  /* Ink */
  --ink-primary:    #1A1410;
  --ink-secondary:  #1A1410E5;  /* ~90% — body text */
  --ink-tertiary:   #1A1410B8;  /* ~72% — labels, secondary text. Bumped from 88 → B8 to clear AA on cream */
  --ink-quaternary: #1A1410B0;  /* ~69% — placeholders. Reserved for decorative-only OR text on subtle bg */

  /* Accent */
  --accent:         #C8442E;
  --accent-soft:    #C8442E14;
  --accent-medium:  #C8442E55;
  --highlight:      rgba(245, 200, 100, 0.7);  /* marker pen — warm amber, replaces neon green from old WorkHighlight */

  /* Rules */
  --rule:        #1A141018;
  --rule-soft:   #1A14100E;

  /* Shadows */
  --shadow-card:   0 12px 30px -10px rgba(20, 14, 8, 0.16);
  --shadow-hover:  0 16px 36px -12px rgba(20, 14, 8, 0.18);
  --shadow-frame:  0 24px 60px -20px rgba(20, 14, 8, 0.18);
}
```

**Dark variant (prepared, not enabled in v1).** When added: swap `--bg-primary` to `#181210`, `--bg-secondary` to `#221C18`, `--ink-primary` to `#F0E6D2`, `--accent` to `#E0573E` (luminous variant), keep all component CSS unchanged.

```css
@media (prefers-color-scheme: dark) {
  :root[data-theme="dark"], :root:not([data-theme="light"]) {
    --bg-primary: #181210; /* etc */
  }
}
```

### 4.2 Typography

| Role | Family | Notes |
|---|---|---|
| Display | `'Iowan Old Style'`, `'Charter'`, `'GT Sectra'`, Georgia, serif | Used for h1, h2, h3 section headings, lede, pull quotes, big metric. Weight 500. |
| Body | `'Inter'`, system-ui, sans-serif | Body paragraphs, labels, navigation. Weight 400/500. |
| Mono | `ui-monospace`, `'SF Mono'`, `'Geist Mono'`, monospace | Eyebrows, meta strip values, captions, TOC items, all-caps labels. |

Use `clamp()` on display sizes so type scales fluidly across breakpoints (e.g., `clamp(28px, 5vw, 56px)` for hero title) — no breakpoint jumps.

### 4.3 Spacing rhythm

Baseline rhythm built from `8px` increments. Section vertical padding: `48-80px`. Hairline rules between sections at `1px` in `--rule` (never accent color).

### 4.4 Per-case accent

Each case study defines a `--case-cover` gradient on its `.preview` (or `<main>`) element. The `.cover` rule references it. Default Twilio:

```css
--case-cover: linear-gradient(135deg, #F22F46 0%, #B82334 50%, #6B1F2E 100%);
```

Cases that ship with this template define their own `--case-cover` — no need to edit component CSS.

---

## 5. Content principles (apply to every case)

### 5.1 No-fabrication rule (non-negotiable)

> Never fabricate statistics, concepts, dates, names, quotes, or specific facts. Only use what is documented in source case material (existing TSX files, Notion, transcripts, or direct content from Zhen). When uncertain, ask first or omit.

This was a critical lesson learned during brainstorming when fabricated stats ("6 tasks", "3 directions", "8 key threads", "9 of 10 sessions") slipped into the mockup. Implementation must enforce this at the content-authoring layer (e.g., MDX front-matter validation, peer review).

### 5.2 Voice (modeled on Zhen's existing About page)

- Direct, plain, sincere
- First-person, comfortable with "I"
- Concrete over abstract — real numbers, real teams, real artifacts
- Personal anecdote over general claim when there's a choice
- Active verbs > linking verbs ("designed" beats "was responsible for")

### 5.3 AI-tell avoidance (banned patterns)

| Pattern | Why | Use instead |
|---|---|---|
| Em dashes (`—`) used to set up reformulations | Heavy AI signature post-2024 | Periods, commas, parentheses; max 1 em dash per page |
| "thoughtful / intentional / crafted / curated" vocabulary | Designer-buzzword flag | Specific verbs: designed, mapped, narrowed, validated |
| "Not just X, but Y" structure | Symmetric AI parallelism | Plain declarative |
| "The kind of X that Y" framings | Setup-and-payoff cadence | Just say what it is |
| Triadic "X, Y, and Z" structures everywhere | Predictable rhythm | Vary list length and structure |
| Perfectly balanced sentence pairs | Symmetry tell | Vary sentence length deliberately |

---

## 6. Page specs

### 6.1 Homepage

Reference: `option-3-homepage-v2.html`.

Sections, top to bottom:

1. **Top nav** — `<nav>` with logotype name (display serif) on left, `Work · Writing · About` on right. Inline at desktop; hamburger drawer at mobile.
2. **Hero** — eyebrow ("Senior Product Designer"), display-serif H1 with the F2 copy, sub paragraph mentioning companies and hobbies. Width capped to ~720px reading column.
3. **Featured case** — full-bleed cover (16/9, per-case gradient), title + cta over the image, **side-pinned meta strip** beneath: Role / Team / Span / Outcome.
4. **Selected work** — `.selected-grid` (asymmetric: 1.5fr / 1fr) showing **3–5 secondary cases** each with cover, mono meta line, display-serif title, 2-line summary. The asymmetric grid is designed for 4 as the common count (one larger + three smaller); 3 or 5 also fit by adjusting which row gets the larger slot.
5. **Writing** — three latest essays as a list (mono date / display-serif headline / sans excerpt). Currently links out to Medium.
6. **Earlier work archive** — quiet inline pill list, hover state shows accent + arrow → indicates clickability.
7. **Footer** — minimal, matching current site's pattern: name + © year on left, three socials (Email · LinkedIn · Instagram) on right. Dark `--bg-inverse` background.

### 6.2 Case study (canonical: Twilio v4)

Reference: `case-study-twilio-v4.html`.

Layout:

```
┌────────────────────────────────────────────────────────┐
│  Top nav (full width)                                  │
├────────────────────────────────────────────────────────┤
│  ← All work                                            │
│                                                        │
│  Hero (eyebrow, title, deck, cover, meta strip)        │
├────────────────────────────────────────┬───────────────┤
│                                        │               │
│  Body content                          │   Sidebar TOC │
│  - Section 01                          │   (sticky)    │
│  - Section 02                          │   (right)     │
│  - Section 03                          │               │
│  - Section 04                          │               │
│  - Section 05  [phase block]           │               │
│  - Section 06  [outcome]               │               │
│  - Section 07  [reflection]            │               │
│  - Next case footer                    │               │
│                                        │               │
├────────────────────────────────────────┴───────────────┤
│  Footer                                                │
└────────────────────────────────────────────────────────┘
```

Body+TOC unit centered at `max-width: 1080px`; body cell `880px`, gap `56px`, TOC `144px`. Hero is also bounded to 1080px so cover image and meta strip align with body content.

Section structure: see §3.3.

### 6.3 About / Curriculum vitae

Reference: `about-resume-and-updates.html` (top frame).

One page, six blocks:

1. **Hero** — portrait (calligraphic seal), bio paragraph (incorporates engineering background + hobbies), eyebrow `About · Curriculum vitae`.
2. **Curriculum vitae callout** — section with `--bg-secondary` background, `Download PDF` (primary button) and `View in browser` (secondary button), "Last updated [date]" subline.
3. **Where I've been** — chronological work history (year · role · company · location). Hairline-separated rows.
4. **Education & practice** — two-column block: Education list left (formal credentials), short paragraph right on practice (illustration, prototyping, usability research).
5. **Reach me** — three contact cards (Email, LinkedIn, Instagram) with hover state.
6. **Footer** — same as homepage / case study.

The résumé PDF is the existing `Zhen-Wang-Resume.pdf` file in the repo. The "View in browser" link can render an inline PDF viewer or link directly to the file.

### 6.4 Writing index (deferred)

For v1, the homepage Writing section links out to Medium directly (the three existing Tasktop posts). When Zhen starts writing in-house: build a `/writing` index using the same Story-led patterns (hairline-separated row list, mono dates, display-serif headlines) and individual posts as MDX files.

---

## 7. Reusable component catalog

Every component below has a CSS class name + markup contract + tokens it reads + responsive behavior. Components must be reusable across all case studies — no Twilio-specific assumptions baked in.

### 7.1 Layout / chrome

| Class | Purpose |
|---|---|
| `.nav` | Top navigation bar (logo + links) |
| `.back` | "← All work" back link beneath nav on case study pages |
| `.body-wrap` | Flex container holding `.body` + `.toc`. Centered at 1080px max. |
| `.body` | Reading column, `flex: 0 1 880px`. Contains all `<section>` elements. |
| `.toc` | Sticky sidebar TOC. `<aside aria-label="Case study sections">` |
| `.toc-list` | `<ul>` with hairline `border-left`. Items are `<button>` (see 7.2). |
| `.footer` | Minimal footer (name + © + 3 socials). Dark `--bg-inverse`. |

### 7.2 Navigation

| Class | Markup contract |
|---|---|
| `.toc-item` | `<button type="button" class="toc-item" data-target="s01"><span class="num">01</span>The problem</button>` |
| | Active state: `aria-current="location"` + `.active` class |
| | Click: smooth-scroll to `data-target` (skips smooth if `prefers-reduced-motion: reduce`) |
| | Focus: visible 2px accent ring with 2px offset |

### 7.3 Hero block

| Class | Purpose | Markup |
|---|---|---|
| `.hero` | Hero container | `<header class="hero">` |
| `.hero-eyebrow` | Mono eyebrow text | `Twilio · 2024 · Senior PD` |
| `.hero-title` | Display-serif h1 | `<h1 class="hero-title">…</h1>` |
| `.hero-deck` | Italic display-serif sub-line | `<p class="hero-deck">…</p>` |
| `.cover` | Full-width 16/8 cover image | Reads `--case-cover` gradient (or real image) |
| `.meta-strip` | Role / Team / Span / Outcome row | `<dl>` with `<div><dt>Role</dt><dd>…</dd></div>` per field. **Auto-fits N children** — variant `.meta-strip--3` / `.meta-strip--4` overrides column count. |

### 7.4 Reading components

| Class | Purpose | HTML element |
|---|---|---|
| `.lede` | Large display-serif paragraph that opens the case (one per case) | `<p>` |
| `.body-text` | Sans body paragraph, fills column. `<strong>` inside gets `--highlight` marker on hover | `<p>` |
| `.section-h` | Section heading. Display serif, with 28px accent rule above. `.section-h--small` modifier for sub-headings within a section. | `<h2>` (sections), `<h3>` (sub-sections) |
| `.section-deck` | Italic display-serif sub-line beneath `.section-h` | `<p>` |
| `.pullquote` | Italic display-serif quote with left accent rail. Use sparingly (1-2 per case). | `<blockquote>` |
| `.figure` + `.figure-image` + `.figure-caption` | Standalone image with mono caption (body-column width, not full-bleed) | `<figure>` + `<img>` + `<figcaption>` |

**Heading hierarchy is locked**: `<h1>` = case title (one per page); `<h2>` = `.section-h` for the 7 main sections; `<h3>` = sub-sections inside a section (e.g., "Key findings", "Recommendations" inside Validating); `<h4>` = card titles (`.pain-card h4`, `.quote-card h4`, `.reflection-card h4`, `.critique h4`). No level skipping.

### 7.5 Data / structured components

| Class | Purpose |
|---|---|
| `.card-row` + `.pain-card` | Three-column editorial block. Large display-serif numbers, no chrome. For pain points / principles / themes. |
| `.competitors` + `.competitor` | Competitor row: logo / Strength / Gap. Top-aligned. 3-4 per case. |
| `.research-stats` | Stat block. `--cols` variable (default 3, `.research-stats--2` for 2-up). Big display-serif accent number + mono label + bullet-list description. |
| `.quote-row` + `.quote-card` | Three customer-quote cards: mono label + display-serif heading + italic quote. |
| `.ideas-list` | Numbered "considered → chosen" list. `<li class="selected">` highlights chosen items with accent number + `Tested` badge. Reusable for any narrowing narrative. |
| `.dual` + `.dual-col` | Two-column findings + recommendations side-by-side, hairline-separated rows. |
| `.phase` + sibling `.image-showcase` | Numbered phase block (text only) plus a full-width design mockup beneath. Repeat per phase. |

### 7.6 Showcase / display

| Class | Purpose |
|---|---|
| `.image-showcase` | Full-bleed band with subtle dotted-grid background. **Reserved for design artifacts** (user flows, phase mockups, before/afters) — not text. Image content sits at body-column width, left-aligned. Background extends to viewport edges via the `left:50%; right:50%; margin-left:-50vw; margin-right:-50vw` trick. |
| `.outcome` + `.outcome-num` + `.outcome-text` | Big metric (160px display serif accent number) + supporting text. One per case. |
| `.reflection` + `.reflection-card` | Two-column "What I learned": mono accent label + display-serif heading + body. Standard close to every case. |
| `.critique` (text-left + image-right rows) | Vertical stack of design-critique entries. Use 0-3 per case as the design-iteration story warrants. |
| `.next-case` | Footer block linking to the next case in curated order |

### 7.7 Interaction states

All interactive elements must have:

- `:hover` state — subtle lift, color change, or background tint
- `:focus-visible` — 2px accent outline with 2-3px offset
- `cursor` semantics — `pointer` on click targets, `zoom-in` on enlargeable images

---

## 8. Interactions

### 8.1 Marker highlight (`<strong>` in body text)

- **Default:** thin 3px amber underline (`--highlight`) at the bottom of the text
- **Hover:** background-size animates 100% × 3px → 100% × 88% over 350 ms cubic-bezier `(0.4, 0, 0.2, 1)`
- **Reduced motion:** marker shows at full 88% height by default, no animation

### 8.2 TOC scrollspy + click-to-scroll

- IntersectionObserver watches all `<section>[id]` with `rootMargin: -25% 0px -50% 0px`
- The section with the highest intersection ratio gets `.active` + `aria-current="location"` on its TOC button
- **Initial state on load:** compute nearest section to viewport top and seed active state (do not rely on hardcoded `.active`)
- **Click TOC button:** smooth `scrollIntoView` (or instant if reduced-motion); spy is **locked** during the click-driven scroll until `scrollend` fires (or 2s safety timeout) — prevents the active state from ping-ponging through intermediate sections

### 8.3 TOC fade during image-showcase

- Separate IntersectionObserver tracks all `.image-showcase` blocks with `rootMargin: -15% 0px -15% 0px`
- When any showcase intersects, TOC gets `.hidden` (opacity 0, visibility hidden, pointer-events none) over a 300 ms transition
- When no showcase intersects, TOC fades back in
- **While hidden, scrollspy active-state updates are paused** so TOC re-emerges showing the right section

### 8.4 Click-to-enlarge lightbox

- **Production: must be a native `<dialog>` element** opened with `showModal()` (not the ad-hoc div in the mockup)
- Trigger: click on any `.image-showcase .figure-image`, `.image-showcase .phase-image`, or `.critique-thumb`
- Affordances: cursor flips to `zoom-in`, image lifts 2px on hover, `⤢` icon fades in at top-right corner
- Inside the dialog:
  - Image at 92vw / 88vh max
  - Caption beneath (mono small text)
  - Visible × close button at top-right (48 × 48 px button, light-on-dark)
  - Subtext: `click × · press esc · or click outside`
- **Focus management:** focus moves to the close button on open; restored to the trigger on close; Tab is trapped inside the dialog
- **Dismiss:** click × · click outside · press Esc · `<dialog>` native behavior

### 8.5 Smooth scroll behavior

- Apply `html { scroll-behavior: smooth; }` globally for anchor jumps
- Override to `auto` under `prefers-reduced-motion: reduce`
- Sections need `scroll-margin-top: 80px` so smooth-scroll lands cleanly past the nav

---

## 9. Responsive design

### 9.1 Breakpoints

| Range | Treatment |
|---|---|
| **≥ 1280 px** | Right-side sticky TOC visible (144 px). Body+TOC unit 1080px centered. 4-col meta strip. |
| **1024–1279 px** | TOC collapses to thin floating column on right (~32px) — dots + numbers, names on hover. 3-col meta strip. Phase number 56px. |
| **768–1023 px** | TOC hidden. Top progress bar + section tag takes over. 2-col meta strip. Card row stays 3-col but tighter. Phase number 56px. |
| **< 768 px (mobile)** | Top progress bar only; tap → drawer with TOC list. Hamburger nav. Single-column meta strip (3 of 4 fields). Cover aspect 4/3. Card row stacks. Phase number 48px. Reflection stacks. |

### 9.2 Per-component matrix

See `responsive-views.html` and the responsive matrix in the v4 mockup annotation block. Every component's behavior at each breakpoint is documented there. Implementation must include actual `@media` queries that match — the mockup currently documents the plan but the CSS only fully implements the desktop case.

### 9.3 Type and image scaling

- **Type:** `clamp(min, fluid, max)` on display sizes — no breakpoint jumps
- **Cover images:** `aspect-ratio` swaps at breakpoints (16/8 desktop → 16/9 tablet → 4/3 mobile). Real implementation may need `<picture>` with art direction for distinct image crops.
- **Dotted grid spacing:** 28px on desktop → 18px on mobile so the pattern still reads at small sizes

---

## 10. Accessibility requirements

### 10.1 Keyboard

- All interactive elements reachable via Tab in document order
- TOC items are `<button>` (not `<li>`) so they are focusable
- Modal traps focus; restores to trigger on close
- Visible focus rings on every focusable element (`:focus-visible` 2px accent outline + 2-3px offset)

### 10.2 Screen readers

- `<aside aria-label="Case study sections">` on TOC
- `aria-current="location"` on active TOC item
- Modal: `<dialog role="dialog" aria-modal="true" aria-labelledby="dialog-title">`
- Cover-image overlay text has sufficient contrast (white-on-dark gradient; verify per case)
- All decorative SVG marked `aria-hidden="true"`

### 10.3 Color contrast (WCAG AA)

- `--ink-primary` on `--bg-primary`: ≥ 7:1 (AAA) ✓
- `--ink-secondary` on `--bg-primary`: ≥ 7:1 (AAA) ✓
- `--ink-tertiary` on `--bg-primary`: must clear ≥ 4.5:1 (AA). The original `#1A141088` (~53% alpha) computes to ~4.0:1 — bumped to `#1A1410B8` (~72% alpha) to clear AA.
- `--accent` on `--bg-primary`: must clear AA for any text role; reserved for callouts and small marks elsewhere
- `--ink-quaternary` is **decorative-only** (placeholders, dividers) — never used on real text

### 10.4 Motion

`@media (prefers-reduced-motion: reduce)`:

- All `transition-duration` and `animation-duration` → 0.01ms
- `scroll-behavior: auto` (no smooth-scroll)
- Marker highlight shows at full 88% height by default (no hover animation)

---

## 11. Content rules (per case study)

### 11.1 Required fields (front-matter)

Each case MDX file declares:

```yaml
title: "Onboarding Twilio's first international tier"
deck: "How a US-only developer platform learned to feel global, in three deliberate phases."
slug: twilio
company: Twilio
year: 2024
role: Senior Product Designer
team: ["Growth", "Console", "Phone Number"]
span: "[duration]"            # may be empty if not yet confirmed
outcome:
  metric: "+179%"
  context: "regional Buy-a-Number page impressions, 3 months after Phase 1"
cover:
  gradient: "linear-gradient(135deg, #F22F46 0%, #B82334 50%, #6B1F2E 100%)"
  # OR
  image: "/cases/twilio/cover.png"
order: 1
featured: true
```

### 11.2 Section authoring

Each section is an MDX block with section ID `s01`–`s07`. Components used inside are imported from the shared component library (e.g., `<CardRow>`, `<Competitors>`, `<ResearchStats>`, `<IdeasList>`, `<QuoteRow>`, `<Phase>`, `<Outcome>`, `<Reflection>`).

### 11.3 What goes into Looking around

Real competitor names. Each row has Strength + Gap fields. Logos use real SVG (brand colors), sized ~24-28 px height. No fabricated comparisons.

### 11.4 What goes into Validating

Real participant counts and objectives from the actual research. Real customer quotes verbatim from session transcripts (or archived in TSX content from existing site). Real recommendations.

---

## 12. Implementation requirements (audit-deferred)

The following must be addressed during implementation. They are non-negotiable for production but were deferred from mockup polish.

| # | Requirement | Notes |
|---|---|---|
| 1 | Modal as native `<dialog>` with `showModal()` | Replace the ad-hoc div in the v4 mockup. Includes focus trap, focus restoration, Tab capture. |
| 2 | Dark-mode token block | Define under `[data-theme="dark"]` and a `prefers-color-scheme: dark` media query. All component CSS already reads tokens; activation is a data attribute. |
| 3 | Token extraction — no hardcoded values in component CSS | Extract `--highlight`, `--shadow-card`, `--shadow-hover`, `--shadow-frame`, `--stage-bg`. Remove inline `style="..."` from markup. |
| 4 | Inline styles → modifier classes | Examples: `.section-h--small`, `.research-stats--2`, `.figure-caption--tight`, `.meta-strip--3`. |
| 5 | Color contrast bumps | `--ink-tertiary` to `#1A1410B8`. Audit every text role for AA. |
| 6 | Implement actual `@media` queries | The 1024 px and 768 px breakpoints are described in the mockup annotation but not enforced in CSS. Implementation must cover all four ranges. |
| 7 | Initial scrollspy state on load | Compute nearest section to viewport top; do not rely on hardcoded `.active` markup. |
| 8 | Screen-reader announcement on active section change | Use `aria-current="location"` (already specced) + an optional `aria-live="polite"` region for the section name. |
| 9 | Heading hierarchy lock | h1 = case title; h2 = `.section-h`; h3 = sub-section within a section; h4 = card title. No level skipping. |
| 10 | Component parameterization for reuse | `.cover` reads `--case-cover`, `.meta-strip` auto-fits N children, `.research-stats --cols`, `.phase-meta` labels as content. |
| 11 | Cover images via `<picture>` art direction | Different crops per breakpoint (16/8 desktop → 4/3 mobile). |

---

## 13. Tech stack

### 13.1 Recommendation: migrate to Astro + MDX

- **Why:** Story-led portfolios benefit from MDX (MDX = Markdown + components inline). New case studies become a single `.mdx` file with imported components from the shared library. Astro's island architecture keeps the site fast and ships almost no JavaScript by default. Build pipeline produces a static `dist/` that the existing GitHub Actions workflow can deploy unchanged.
- **What stays:** the GitHub Actions deploy workflow (already wired to publish `dist/`), the `Zhen-Wang-Resume.pdf` file, the `public/` asset folder, the `.npmrc`.
- **What changes:** webpack config retired; `package.json` scripts switch to `astro dev` / `astro build`; React components become Astro components (mostly unchanged JSX inside `.astro` files).

### 13.2 Alternative: stay on webpack + React

Acceptable if the migration cost is too high. In this case:

- Implement components with the same class names and tokens
- Use React Router `<Link>` for case-study routing
- Case studies become `.tsx` files instead of `.mdx`. Adding a new case = scaffold a new TSX, fill in front-matter object, copy paste section markup, replace content. ~30 minutes per case.

The implementation plan will pick one path based on Zhen's preference.

### 13.3 Hosting

Already wired: GitHub Actions → GitHub Pages with `wangzhenux.github.io` as the published origin. No infra changes needed.

---

## 14. Non-goals (out of scope for this revamp)

- Backend / database / authentication
- Comments, likes, social features
- Search (case list is small enough to scroll)
- CMS / admin UI for editing content (MDX in the repo is the editing surface)
- E-commerce, contact forms beyond `mailto:`
- Internationalization (English only for v1)
- Analytics beyond what's already in the site (Google Analytics 4 if desired, but not required)

---

## 15. Open questions

These need confirmation from Zhen before or during implementation:

1. **Project span on Twilio meta strip** — currently `[Project span — to confirm]`. Provide actual start/end dates.
2. **Team composition specifics** — currently "Cross-functional with Growth, Console, and Phone Number teams" (verbatim safe). Confirm if specific PM/engineer counts are public.
3. **Phase ship dates** — currently "Shipped / In design / Planned" (verbatim safe). Provide quarter or month if they should be public.
4. **Calligraphic seal artwork** — Zhen iterates the prompt in GPT-image-2 / Imagen until satisfied. Final SVG/PNG goes in `public/seal.svg` (preferred SVG for crispness at all sizes).
5. **Astro vs. webpack+React** — Zhen's preference based on appetite for migration vs. shipping speed.
6. **Dark mode v1 toggle** — locked as light-only for v1, but if Zhen wants a manual `prefers-color-scheme` switcher in the nav, this is a 30-min add at any time.
7. **Writing index** — link out to Medium for v1 or build in-house? (Spec recommends Medium for v1.)

---

## 16. Acceptance criteria (definition of done)

This spec is "done" when:

- [ ] Implementation plan (next document, via `writing-plans`) covers every component in §7
- [ ] Implementation respects every requirement in §12
- [ ] Twilio case study renders end-to-end matching the v4 mockup at all four breakpoints
- [ ] Tasktop Hub case study scaffolds in < 1 hour using only the component library + new `.mdx` content
- [ ] Lighthouse a11y score ≥ 95
- [ ] Lighthouse performance score ≥ 90 on mobile
- [ ] Site deploys via the existing GitHub Actions workflow with no manual steps
- [ ] Zhen reviews and signs off

---

## 17. References

- v4 case study mockup (canonical visual reference)
- `responsive-views.html` (per-component breakpoint matrix)
- Existing source: `src/works/TwilioOnboarding.tsx`, `src/works/Tasktop.tsx`, `src/about.tsx`, `src/footer.tsx`
- Competitive research transcript (in brainstorming session log)
- Brian Lovin's site (sticky TOC, `/uses` page reference) — `brianlovin.com`
- Karri Saarinen's site (CV-as-portfolio reference) — `karrisaarinen.com`
- Frank Chimero's site (editorial paper aesthetic reference) — `frankchimero.com`
- Pasquale D'Silva's site (story-led, image-rich reference)
- Tai Yu Lin's site (image-emphasis reference Zhen called out) — `taiyu.work`
