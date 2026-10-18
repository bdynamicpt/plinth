# 1. Design tokens in DTCG JSON, built with Style Dictionary, in three tiers

- Status: accepted
- Date: 2026-10-18
- Issue: [#2](https://github.com/bdynamicpt/plinth/issues/2)

## Context

Plinth's tokens are the source of truth for every project that uses it, and each project brings
its brand by overriding tokens rather than forking components. The first version (#1) kept the
tokens in a TypeScript file with a hand-written build. That works, but it is a format only Plinth
understands: design tools can't read it, and the build has to grow by hand with every new type
of token (shadows, easings, typography).

## Decision

**Format.** The tokens are written in the [Design Tokens Community Group format][dtcg] (DTCG):
JSON files with `$value`, `$type` and `$description`, in `packages/tokens/tokens/`. It is the
format design tools are converging on, so Figma variables can import the same files later.

**Build.** [Style Dictionary][sd] reads them and resolves references. A small script
(`packages/tokens/scripts/build.ts`) writes the outputs: CSS custom properties in
`@layer plinth` (light, dark and the system preference), a JS/TS export, the same list as JSON,
and a Tailwind v4 `@theme` file. Issue #2 named Style Dictionary v4; we use v5, the current
major, which keeps the same DTCG support and API.

**Tiers.**

1. **Primitives** (`primitives.json`, custom properties `--plinth-ref-*`): the raw scales, named
   by value: neutrals `0…1000`, one brand ramp, status ramps, spacing on a 4px grid, sizes, radii,
   the type scale, durations and easings.
2. **Semantic** (`semantic.json`, and `semantic.light.json` / `semantic.dark.json` for what
   changes with the theme): named by role (`color.surface`, `radius.pill`, `space.4`,
   `control.md`, `layer.sheet`, `elevation.2`). Components use these, and a project overrides
   these.
3. **Component** (`component.json`): only values a project may need to tune for one component,
   such as `header.height`. Built from semantic tokens.

A semantic token that only points at another token is written as `var()` of it, so changing a
primitive flows through. Components use semantic and component tokens only: Stylelint rejects
`var(--plinth-ref-*)` in component CSS, and the CSS build rejects any `var(--plinth-*)` that is
not a token.

DTCG has no themes, so light and dark are two files with the same names. The build runs Style
Dictionary once per theme and writes the dark values under `[data-theme="dark"]`, `.dark` and
`prefers-color-scheme: dark`.

## Consequences

- Adding a token is editing JSON; the outputs, the Storybook pages and the tests follow.
- Projects override semantic tokens with plain CSS outside any layer. Storybook's example brand
  (`storybook/brands/example.css`) shows how, and a test checks it touches no primitives and no
  component classes.
- Spacing exists in both tiers (`--plinth-ref-space-4` and `--plinth-space-4`). The duplication is
  deliberate: components only ever see the semantic tier, so a project can change density in one
  place.
- Style Dictionary is a build-time dependency of the tokens package only; nothing that projects
  install depends on it.

[dtcg]: https://www.designtokens.org/tr/drafts/format/
[sd]: https://styledictionary.com
