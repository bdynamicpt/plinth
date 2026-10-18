# 3. Plinth's default look

- Status: accepted
- Date: 2026-10-18
- Issue: [#35](https://github.com/bdynamicpt/plinth/issues/35)

## Context

Plinth's first defaults were neutral in the wrong way: the system font fell back to Arial on many
machines, monospace to the system mono, borders were solid grey, and there were no tinted states.
The result looked like early Bootstrap. The look we want is that of modern developer tools
(Supabase, Bento, /dev/null): a clean sans with a monospace for metadata, hairline borders, an
accent used sparingly, tinted selected states, and tight headings.

Projects still bring their own brand through tokens (ADR 1); this decides what they start from.

## Decision

All of it lives in the tokens; no component markup changes.

- **Typefaces: Geist and Geist Mono** (SIL Open Font Licence), self-hosted. The variable woff2
  files and their `@font-face` rules ship in `fonts/`: in the npm package as
  `@bdynamic/plinth/fonts.css`, and in the Composer package, where the Filament plugin registers
  them with Filament's font asset and `vendor:publish` copies them, so Laravel needs no Node build.
  The files are vendored rather than installed, because the `geist` npm package requires Next.js.
  The sans is for interface text; the mono is for metadata (handles, hashes, times, key hints).
  System fonts follow in each stack.
- **Borders and dividers are translucent** (black at 5 to 20% in light, white at 8 to 20% in
  dark), so they read the same on every surface.
- **The accent stays blue and is used sparingly**: the primary action, links, the focus ring, the
  current tab. Selected states use the new `accent-subtle` surface with `accent-text`, a tint
  rather than a solid fill.
- **Letter spacing tokens**: `tight` (−0.02em) for headings and `tighter` (−0.04em) for display
  type; body text stays normal.
- **A denser control scale**: 28, 36 and 44 px. Controls shorter than the 40px touch target keep it
  through an invisible hit area.
- **Lighter elevation in light mode**; dark keeps stronger shadows, which a dark surface needs.

## Consequences

- Plinth looks current out of the box, and a brand that changes only colours and fonts still
  inherits the hairline borders, tints and spacing.
- Each page that uses Plinth loads about 140KB of fonts (two variable files), cached after the
  first visit. A project that wants system fonts overrides the two font-family tokens and skips
  `fonts.css`.
- Projects that override `accent` should override `accent-subtle` too (and `accent-hover` and
  `accent-active`), or selected states keep Plinth's blue tint.
