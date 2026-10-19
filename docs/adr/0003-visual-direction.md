# 3. Visual direction: a dense, quiet look, dark first

- Status: accepted
- Date: 2026-10-18
- Issue: [#34](https://github.com/bdynamicpt/plinth/issues/34)

## Context

The first tokens (#1, #2) were chosen to prove the build, not to look like anything: the system
font stack, Tailwind's zinc greys, a solid blue primary, 40px controls with 14px labels and 16px
body text. Put together, the components read as a generic admin template from fifteen years ago.

The look we want is the one shared by current product UIs such as [Supabase][supabase],
[dev-null.sh][devnull] and [Bento][bento]. Their computed styles have the same pattern:

|          | Supabase                                  | dev-null.sh                                 | Bento                          |
| -------- | ----------------------------------------- | ------------------------------------------- | ------------------------------ |
| Type     | Inter (body weight 450), mono for code    | Geist, Geist Mono for metadata              | Inter, headings at −0.04em     |
| UI text  | 13px, controls 24–26px tall               | 13–15px                                     | 12–14px                        |
| Surfaces | near-black (oklch 0.19), never pure black | near-white `#f6f7f8`                        | near-black                     |
| Lines    | borders at about 7% of the text colour    | hairline `#e1e4e8`                          | hairline                       |
| Text     | three steps (0.95, 0.80, 0.52 lightness)  | default and muted                           | 92%, 64%, 46% of white         |
| Accent   | green, sparingly                          | blue on the active item and the main action | indigo on the main action only |
| Depth    | borders, not shadows; 6px radius          | borders; 8px radius                         | 8px radius                     |

Most of what makes a component look one way or the other is in the tokens, so this is decided at
the token level and the components change very little.

## Decision

### 1. A real typeface with a mono partner

The default families are **Geist** for text and **Geist Mono** for metadata: timestamps, IDs,
counts, keyboard shortcuts and small section labels. Both are open source (SIL OFL) and are
self-hosted from npm, never loaded from a font CDN. The system stack stays as the fallback. A
project changes the families through `font.family.body` and `font.family.mono`, like any token.

Headings use weight 600 with tight tracking (−0.02em, tighter for display sizes); body text uses
weight 400.

### 2. Dense, small UI text

- UI text (labels, controls, table cells, menus) is **14px**, with 13px and 12px steps below it.
- Reading text (descriptions, messages, docs) is 15px.
- Larger sizes are for headings only.
- **Display sizes are for marketing pages only:** 48px (`font.size.5xl`) for section headings
  and the closing call to action, 64px (`font.size.6xl`) for the hero, with
  `font.leading.display` (1.05) and the tighter letter spacing. They step down with the
  breakpoints: 36px on a phone, 48px from 768px, 64px from 1280px, through media queries rather
  than `clamp()`, so every value stays a token. Inside an app the scale still stops at 36px.

### 3. Controls look small, touch stays at 40px

Controls are **28px** (`sm`), **32px** (`md`, the default) and **40px** (`lg`) tall. On a coarse
pointer (`@media (pointer: coarse)`), every control keeps a 40 × 40px hit area through an invisible
extension, as the small button already does. The rule "touch targets at least 40 × 40px" holds;
the visible size no longer has to match it.

### 4. Colour: neutral surfaces, translucent lines, one accent

- The neutral scale is redefined in **oklch** with a very slight cool tint, and **dark is designed
  first**: the page sits around oklch 0.17–0.20, never `#000`; light sits around 0.98, never
  `#fff` for the page (`#fff` is kept for raised surfaces).
- Surfaces step up in small increments: `surface`, `surface-raised`, `surface-sunken`, plus a
  hover step.
- **Borders and dividers are the text colour at low opacity**, so the same token works on every
  surface.
- Text has three levels: `text`, `text-muted` and a new `text-subtle` (placeholders, timestamps,
  disabled labels).
- The **accent is a modern blue** in oklch, around hue 255–260, replacing the hex ramp from #1:
  - on dark, about `oklch(0.72 0.15 255)`;
  - on light, about `oklch(0.54 0.2 260)`.

  A project's brand replaces it.

- Inside an app the **primary button is inverted neutral**: light on dark, dark on light. There
  the accent marks state, never the main action: focus, links, the active nav item, the selected
  row or filter, mentions, progress and the active mode of a switch or tab.
- **Marketing pages use the accent for their primary action** (sign up, start a trial, the
  pricing tier to pick). The button gets an `accent` variant for this, and it is the only place a
  solid accent fill is the default.
- Storybook's example brand shows a coloured accent and primary, so the override is visible.
- Status colours (success, warning, danger) stay, toned down to sit on the new surfaces.

### 5. Depth from borders, not shadows

Components separate themselves with hairline borders and surface steps. Shadows (`elevation.*`)
are only for what floats above the page: sheets, menus, popovers, toasts. The primary button gets
a 1px inner edge instead of a shadow. Radii: **6px** on controls, **10px** on containers, pill for
badges and avatars.

### 6. Quiet motion and hover

Hover is a small surface step, never a colour jump. Transitions stay at the existing fast
duration and respect `prefers-reduced-motion`.

### 7. Storybook opens in dark

Dark is where this look reads best, so Storybook's default theme is dark. Every story still shows
light and dark, and screenshots in pull requests still cover both.

## Consequences

- The token values change, the token names mostly do not: `text-subtle` and a surface hover step
  are added; control sizes and radii change value. Badge, button, icon and the focus ring are
  updated in the same pull request; components in progress pick up the new values.
- Projects load two font files from the package. The Laravel and Vue install docs say how; a
  project that sets its own families loads nothing from Plinth.
- Visual comparison screenshots are re-baselined once, in the pull request that applies this.
- A project that wants a coloured primary inside its app sets it in its overrides, as the example
  brand does. Plinth's own defaults stay neutral in the app and use the accent on marketing pages.
- Amended 2026-10-18: the accent's hue and where a solid accent fill is used (marketing pages,
  through the button's `accent` variant) were settled after reviewing a mood board.
- Amended 2026-10-19: display sizes (48 and 64px) and a display line height were added for
  marketing pages, after the mood board's marketing page showed that 36px gives a hero no more
  weight than an app's page title. The app scale is unchanged.
- The values in the table above are a reference for the feel, not for copying: Plinth takes the
  pattern, not another product's palette or typeface choices beyond what is open source.

[supabase]: https://supabase.com/design-system
[devnull]: https://dev-null.sh/log/following
[bento]: https://bentonow.com
