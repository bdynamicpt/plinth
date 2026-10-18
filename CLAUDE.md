# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Only the README exists so far. The setup is tracked in https://github.com/bdynamicpt/plinth/issues/1,
which proves the whole path with one component (`badge`). Add the real commands here once the
workspace exists.

Planned commands (from issue #1): `npm ci`, `npx turbo run lint test build build-storybook`,
`npm run storybook`, `npm run build-storybook`, and `composer test` in `packages/blade`.

## What Plinth is

The design system of BDynamic's projects. Nothing in Plinth may know about any one consumer project.

- **Tokens are the source of truth:** colour (light and dark), type, spacing, radii, layers
  (z-index), breakpoints, motion. One source, built to CSS custom properties, a JS/TS export and a
  Tailwind preset.
- **Components are plain HTML and CSS**, each with a documented markup contract (elements, classes,
  states, ARIA).
- **Blade (with a Filament plugin) and Vue 3 layers are thin:** they print the contract and hold no
  styles. Parity tests compare their output with the story's markup, ignoring whitespace and
  attribute order.
- **Storybook** (`@storybook/html-vite`, not Vue) documents and tests the plain HTML. Addons: docs,
  a11y, viewport (390, 768, 1440 px), a light/dark switch driven by the tokens.
- **Brand per project:** Plinth ships neutral defaults; a project overrides tokens, never forks a
  component.

## Layout and build

```
packages/
  tokens/   token source; builds CSS custom properties, JS/TS export, Tailwind preset
  css/      one stylesheet per component, tokens only, mobile first
  vue/      Vue 3 components
  blade/    Composer package: Blade components (<x-plinth::name>) + Filament plugin;
            has a package.json whose scripts run Composer and copy the built CSS in
storybook/  never published
```

- npm workspaces, Node 22, Vite, TypeScript. Not Bun or pnpm.
- Turborepo with no remote cache. Task order: `tokens` → `css` → `vue` and `blade` → `storybook`;
  outputs declared in `turbo.json`.
- Tests: Vitest (tokens build, Vue), Storybook test runner with Playwright (including screenshot
  comparison), Pest (Blade).
- Lint: ESLint, Prettier, Stylelint (property order, no `!important`, no raw colours), Pint.
- CI: `npm ci`, then `turbo run lint test build build-storybook`, `.turbo` kept by the Actions
  cache; pull requests use `--filter=...[origin/main]`.
- Published as npm `@bdynamic/plinth` (subpaths `tokens`, `tokens.css`, `css`, `vue`, `tailwind`)
  and Packagist `bdynamicpt/plinth` (Blade, Filament plugin, built CSS so Laravel needs no Node
  build). One version, one tag. Storybook, tests, token sources and tooling are not published.

## Component rules

- Mobile first: base rules are the phone; `@media (min-width: 768px)` and `(min-width: 1280px)` add
  to them.
- Tokens only: no hex, raw pixel spacing or raw z-index in a component's CSS. No `!important`.
- Classes `plinth-component` and `plinth-component-part`; state is an ARIA attribute or an `is-*`
  class.
- Logical properties; touch targets at least 40 × 40 px; nothing hover-only;
  `prefers-reduced-motion` respected.
- Each component ships its story (every state, three widths, light and dark), Blade and Vue
  layers, a parity test, a clean a11y check and a docs page.

## Working in this repo

- Licence: MIT is proposed but not confirmed. Ask the owner before adding it.
- Commit to `main` directly (no stacked pull requests). Commit and push after each step.
- Commit and PR bodies are plain words explaining the change, with no session links or
  `Claude-Session` trailers.
- UI pull requests include screenshots at 390, 768 and 1440 px, light and dark.
- Problems and ideas become GitHub issues.
- Never touch, share code with, or propose packages shared with uScore (Defero-AS/defero).
