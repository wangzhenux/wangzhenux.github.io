# Design system — wangzhenux.github.io

The single source of truth for this portfolio's visual language. Future designs
should follow these rules so the site stays consistent. All values live as tokens in
`src/styles/tokens.css`; **components must use the tokens, never raw values** (enforced
by `tests/unit/no-hardcoded-values.test.ts`).

---

## 1. Design tokens

### Color (warm editorial)
| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#FAF5E8` | page background |
| `--bg-secondary` | `#F1E9D5` | cards, tinted bands |
| `--ink-primary` | `#1A1410` | headings, primary text |
| `--ink-secondary` / `--ink-tertiary` / `--ink-quaternary` | — | body / muted / faint text |
| `--accent` | `#B93A23` | links, accents, icons, "mine" emphasis |
| `--accent-soft` | accent @ ~8% | hero bento tile, chips, avatars |
| `--rule` / `--rule-soft` | — | hairline borders, dividers |

Functional color always pairs with text/icon — never color alone. Foreground/background
pairs meet WCAG AA (4.5:1 text).

### Typography
- `--font-display` — serif, for titles/headings (weight 500).
- `--font-body` — grotesque, for body (16px base, line-height 1.5–1.6).
- `--font-mono` — for eyebrows, labels, meta, tags, numbers (uppercase, letter-spaced).

### Spacing
`--space-0`…`--space-14` (4px step scale). **Use spacing tokens for all padding /
margin / gap** — the lint forbids raw px in those properties (only `0`, `1px`, `2px`,
or `var()/calc()/clamp()/min()/max()` are allowed).

### Radius — the scale (keep consistent!)
| Token | Value | Applies to |
|---|---|---|
| `--radius-sm` | `4px` | pills, tags, chips, small buttons, the progress drawer items |
| `--radius` | `6px` | **nested media inside a card** (image/visual in a card), diagram inner boxes, screenshot placeholders |
| `--radius-lg` | `12px` | **all cards + all large standalone blocks**: card grids, bento, persona/competitor cards, carousel slides, `ImageShowcase`, hero & home covers, RoleChips, ResearchStats, QuoteCard, ReachMe |
| `50%` | — | circles: avatars, dots, framework nodes |
| `999px` | — | full capsules: carousel controls, gallery pills |

**Rule of thumb:** a card or large block is `--radius-lg` (12px); media *nested inside* a
card steps down to `--radius` (6px); small interactive chips are `--radius-sm` (4px).
Never use a spacing token (`--space-*`) for `border-radius`.

### Layout
- `--max-content` `1080px` (the content frame), `--max-body` `880px` (reading column cap).
- `--pad-page-x` — horizontal page padding.
- Body owns the full content frame; there is **no sidebar TOC** (the top progress bar is
  the section nav at all widths).

---

## 2. Full-bleed pattern (scrollbar-safe)

Showcase bands (`Bento`, `CardGrid`, `CompetitorGrid`, `PersonaGrid`, `ImageShowcase`)
break past the reading column to the viewport edges using a **centered** breakout that
stays symmetric and never causes a horizontal-overflow shift:

```css
.band {
  width: calc(100vw - var(--sbw));                      /* content area, not full vw */
  margin-inline: calc(50% - (100vw - var(--sbw)) / 2);  /* centered on the content area */
}
.band-inner {                         /* content re-capped + re-padded */
  max-width: var(--max-content);
  margin-inline: auto;
  padding-inline: var(--pad-page-x);
}
```

`--sbw` is the **vertical-scrollbar width**, measured by an inline script in `BaseLayout`
(`innerWidth − documentElement.clientWidth`, on load / nav / resize) and defaulting to
`0px` in tokens. Subtracting it makes bands span the content area **exactly** — no
horizontal overflow at any width (raw `100vw` includes the scrollbar and bleeds ~15px).
`html { overflow-x: clip }` is a safety net. Do **not** use raw `100vw` or the old
asymmetric `margin-left: -pad` + `@media` breakout. `ShowcaseCarousel` uses a JS-measured
`--scar-cl` for its peek track **plus** the same `--sbw` width compensation.

---

## 3. Meta strip (case hero) — standard fields

Every case shows the **same four fields, in order: Team · Span · Type · Outcome.**
Set them as front-matter fields; the strip is built in `work/[slug].astro`:

| Field | Source | Notes |
|---|---|---|
| **Team** | `role` (value) + `team` (sub) | The **role is the highlighted value** (weight 500); team context is the lighter sub-line. |
| **Span** | `span` | e.g. "~6 weeks", "2024" |
| **Type** | `type` | product type: "Web app", "Mobile app", "Enterprise web app", "Lifecycle messaging", "UX research", "Strategy & IA" |
| **Outcome** | `outcome.metric` (+ `outcome.context`) | the headline result |

Absent fields are omitted but the order is preserved. A case may pass an explicit `meta`
array to override, but it should still produce these four labels (with `sub` for Team).

---

## 4. Icons

One inline line-icon family — **no text-glyph or emoji icons** (no `←`, `▾`, `↓` as UI).
- UI chrome icons: `src/components/chrome/Icon.astro` (`arrow-left/right/up-right/down`,
  `download`, `chevron-down`). Stroke **2**, round caps, `currentColor`, `aria-hidden`
  by default (pass `label` to expose to AT). Sized via `size` prop.
- Content line-icons (in `CardGrid`, `Bento`, `PersonaGrid`): stroke **1.6–1.7**,
  24-viewBox, `currentColor` (accent), defined inline per component.
- Typographic arrows in prose/data ("Gemini → Dify", "3 → 1") and diagram flow
  connectors are **content, not icons** — leave them.

---

## 5. Case-study structure (card-forward)

- **Spine:** numbered `PartHeader` per Part ("● Part 0N / Title"); use `kicker="Context"`
  + `noRule` for the first section so it sits flush under the hero (no double divider).
- **Prefer cards over prose:** `CardGrid` (icon point-cards), `Bento` (feature grid,
  icon- or image-led), `PersonaGrid` (research personas), `CompetitorGrid` (named
  competitors rated on shared axes), `ShowcaseCarousel` (autoplay demo slides).
- **Bento images fill at their own ratio** — image cells are content-sized: the `<img>`
  is `width:100%; height:auto` at its natural aspect ratio (no crop, no letterbox), and
  the cell sizes to it. The grid uses `grid-auto-rows: auto`; the 2×2 hero aligns because
  one hero ≈ two stacked small cards + gap (verify when the mix of footprints/ratios
  changes). Two presentation modes:
  - **Framed** (default) — the card pads the image (rounded inside the card). Use for
    real product screenshots that have their own chrome (`bento-*.png`, the Context bento).
  - **`bleed`** — the image runs edge-to-edge to the card border (text-only padding).
    Use for SVG illustrations whose own background matches the card (the principle cards).

  Export mockups from Figma at high res; give SVG illustrations a `viewBox` whose ratio
  ≈ the card footprint. The hero takes **no colored wash** — scale carries the hierarchy,
  terracotta stays an accent.
- **Concept illustrations** (when no good screenshot exists, e.g. the Part 04 principle
  cards, `principles/*.svg`): bespoke inline-SVG vignettes in the warm palette — cream
  (`#FAF5E8`) surface, white UI panels, muted-ink skeleton bars, warm-gray image blocks
  (`#E4DAC6`), and **one** terracotta (`#B93A23`) focal per card. Shapes-only (no web
  fonts to fail in `<img>` context; numerals like "12"/"0" use a `Georgia, serif` stack).
  Set the SVG `viewBox` ratio to the card's visual ratio (no letterbox) and include
  explicit `width`/`height` so `object-fit` is deterministic cross-browser. Palette is
  hardcoded (external SVGs can't read CSS vars; light-theme only) but matches the tokens.
- **Progress bar:** fixed top bar, hidden over the hero, slides in once the hero is
  scrolled past (`.is-visible` toggled in `toc-scrollspy.ts`); a 2-column drawer is the
  section nav.
- **Section headings — one hierarchy, two components (keep consistent!):**
  | Level | Component | Renders | Use |
  |---|---|---|---|
  | Part title | `PartHeader` | `<h2 class="part-title">` + eyebrow | one per Part |
  | Sub-section (a beat within a Part) | `SectionH small` | `<h3>`, 22px, accent rule | every sub-heading inside a Part |
  | Top-level / scrolly Act headline | `SectionH` (default) | `<h2>`, 30px, accent rule | non-Part section statements only |

  A Part is `<h2>`; its sub-sections are `<h3>` — never two `<h2>`s in one Part. **Do not
  title a section with a showcase component's built-in heading** (e.g. the old `Bento`
  `heading`/`deck`): it renders its own style and breaks the h2/h3 hierarchy. Showcase
  components (`Bento`, `CardGrid`, `PersonaGrid`, `CompetitorGrid`, `ShowcaseCarousel`,
  `JourneyStrip`) take a `label` (the accessible / eyebrow name) and are **preceded** by a
  `SectionH small`. (`Bento`'s `heading`/`deck` props were removed to enforce this; card-
  internal headings like `ReflectionCard`/`DualCol`/`Outcome` are not section titles.)
- **Heading → content spacing:** a `PartHeader` opens a Part with ~`space-8` (40px, its
  own bottom margin) before the first block. Content directly under a `SectionH small`
  **hugs it**: floating content (cards/strips like `Bento`, `JourneyStrip`) sits ~`space-7`
  (32px) below; a tinted full-bleed band (`ShowcaseCarousel`) meets the heading at ~16px
  and carries its breathing room as internal padding. Don't give a floating band a large
  standalone top margin when it follows a heading — it leaves an orphaned gap.

---

## 6. Honest-claim conventions (this portfolio)

Case copy must be truthful. Conventions used in `unitpulse-site.mdx` (see its internal
`‹C›` comment block — removed before publish):
- Never fabricate stats, names, quotes, dates, or features — only real, verifiable content.
- State ownership precisely ("built **on top of** the engineering-owned scaffold; never
  claim it"); keep collaborators neutral ("engineering") if names are withheld.
- Metrics are framed honestly (early traction, measurement window stated, zeros reported).
- Personas are research archetypes with AI-generated (synthetic, not real) avatars.
- Competitor screenshots are third-party captures for comparative use; ratings are a
  stated assessment.

---

## 7. Accessibility & motion
- Touch targets ≥ 44px; visible focus rings; `aria-label` on icon-only controls.
- Respect `prefers-reduced-motion` (the progress bar, reveals, carousel honor it).
- Reveal-on-scroll (`[data-reveal]` + `.reveal-enabled`) never hides content without JS.

---

## 8. Verification
- `npx astro build` — must pass (20 pages).
- `npx vitest run` — unit tests incl. the token-only CSS lint must pass.
- Preview gotchas are documented in the session memory (Claude_Preview MCP): periodic
  reload, large-image compositing, `--scar-cl` staleness after a programmatic resize,
  and re-touch-to-HMR for stale `.astro` styles.
