# AGENTS.md

Guidance for the coding agents that work in this repository (Codex reads this file; Claude Code
reads it through `CLAUDE.md`, which holds only `@AGENTS.md`). Keep the rules here, once.

## Status

The workspace is set up (issue #1) with one component end to end, `badge`. Commands: `npm ci`
(also runs `composer install` in `packages/blade`), `npm run check` (= `turbo run lint test build
build-storybook`), `npm run storybook`, `npm run build-storybook`, and `composer test` in
`packages/blade`. See README.md for details.

## What Plinth is

The design system of BDynamic's projects. Nothing in Plinth may know about any one consumer project.

- **Tokens are the source of truth:** colour (light and dark), type, spacing, radii, layers
  (z-index), breakpoints, motion. DTCG JSON in `packages/tokens/tokens/`, built with Style
  Dictionary to CSS custom properties, a JS/TS export and a Tailwind v4 `@theme` CSS file (v4 has
  no JS presets). Three tiers (docs/adr/0001): primitives `--plinth-ref-*`, semantic (what
  components use and projects override, light and dark), component (per-component tuning).
- **Components are plain HTML and CSS**, each with a documented markup contract (elements, classes,
  states, ARIA).
- **Blade (with a Filament plugin) and Vue 3 layers are thin:** they print the contract and hold no
  styles. Parity tests compare their output with the story's markup, ignoring whitespace and
  attribute order.
- **Storybook** (`@storybook/html-vite`, not Vue) documents and tests the plain HTML. Addons: docs,
  a11y, viewport (390, 768, 1440 px), a light/dark switch driven by the tokens.
- **Brand per project:** Plinth ships its default look (docs/adr/0003: dense and quiet, dark
  first, Geist and Geist Mono, translucent hairlines, an inverted-neutral primary); a project
  overrides tokens, never forks a component.

## Layout and build

```
packages/
  tokens/   DTCG token source; builds CSS custom properties, JS/TS export, Tailwind `@theme` CSS
  css/      one stylesheet per component, tokens only, mobile first
  vue/      Vue 3 components
  blade/    Composer package: Blade components (<x-plinth::name>) + Filament plugin;
            has a package.json whose scripts run Composer and copy the built CSS in
storybook/  never published
```

- npm workspaces, Node 22, Vite, TypeScript. Not Bun or pnpm.
- Turborepo with no remote cache. Task order: `tokens` → `css` → `vue` and `blade` → `storybook`;
  outputs declared in `turbo.json`.
- Tests: Vitest (tokens build, Vue), Storybook test runner with Playwright and axe (every
  story, both themes, three widths), Pest (Blade). Screenshot comparison is paused until the
  foundations settle (#9).
- Lint: ESLint, Prettier, Stylelint (property order, no `!important`, no raw colours), Pint.
- PHPStan (with Larastan) runs at `level: max` on `packages/blade/src`, as part of
  `composer lint`. Fix the types; no baseline, no `@phpstan-ignore`.
- Test coverage is 100% and the test scripts fail below it: Pest with `--coverage --min=100` for
  the Blade package (needs pcov or Xdebug), Vitest coverage thresholds for the Vue package. New
  code ships with the tests that cover it.
- PHP classes are always `final`; Pint's `final_class` rule enforces it. Abstract base classes
  (such as the tests' `TestCase`) are the only exception.
- CI: `npm ci`, then `turbo run lint test build build-storybook`, `.turbo` kept by the Actions
  cache; pull requests use `--filter=...[origin/main]`.
- Published as npm `@bdynamic/plinth` (subpaths `tokens`, `tokens.css`, `css`, `vue`, `tailwind.css`)
  and Packagist `bdynamicpt/plinth` (Blade, Filament plugin, built CSS so Laravel needs no Node
  build). One version, one tag. Storybook, tests, token sources and tooling are not published.

## Component rules

- Mobile first: base rules are the phone; `@media (min-width: 768px)` and `(min-width: 1280px)` add
  to them.
- Plain CSS with semantic classes, never utility classes in the markup. Component CSS lives in
  `@layer plinth` so a project's utilities can override it; no `@apply`.
- Tokens only: no hex, raw pixel spacing or raw z-index in a component's CSS, and semantic or
  component tokens only, never primitives (`--plinth-ref-*`). No `!important`.
- Classes `plinth-component` and `plinth-component-part`; state is an ARIA attribute or an `is-*`
  class.
- Behaviour comes from native elements first (docs/adr/0002): `<dialog>` for sheets, `popover` for
  menus, `<details>` for disclosure, `command`/`commandfor` to open and close. Open state is the
  native one (`[open]`, `:popover-open`), not a class. Only what the platform can't do goes in a
  layer (Alpine in Blade, state in Vue), and no Plinth JavaScript ships.
- The app owns the state: components never fetch, route or remember; layout state is an
  attribute or `is-*` class the app sets.
- Blade merges `$attributes` onto the documented root and Vue lets attributes fall through to it,
  so `wire:*`, `x-*`, `data-*` and `aria-*` reach it; Vue emits documented events. Each component
  has a parity case with extra attributes.
- Every focusable element shows the focus ring on `:focus-visible` (outline in
  `--plinth-color-focus-ring` at `--plinth-focus-ring-width`, offset `--plinth-focus-ring-offset`,
  `-offset-filled` on solid filled controls, or `-offset-inset` on full-width rows); the test runner checks it.
- Blade: choices are backed enums in `packages/blade/src/Enums/`; sizes use the one shared `Size`
  (xs to xl, icons included) with each component's supported subset. PHP classes are `final`.
- Logical properties; touch targets at least 40 × 40 px; nothing hover-only;
  `prefers-reduced-motion` respected.
- Each component ships its story (every state, three widths, light and dark), Blade and Vue
  layers, a parity test, a clean a11y check and a docs page.

## Agent tooling

- **A new component:** follow `.claude/skills/new-component/SKILL.md` (Claude Code loads it as
  the `new-component` skill). Its script writes the files for every layer; the skill lists what
  to wire up and check.
- **Reviewing a component:** `.claude/agents/component-reviewer.md` checks one against its
  contract (ARIA, states, logical properties, touch targets, reduced motion, Blade and Vue
  parity). It leaves to Stylelint what Stylelint catches.
- **Storybook MCP:** `.mcp.json` registers `@storybook/addon-mcp` at `http://127.0.0.1:6006/mcp`,
  live while `npm run storybook` runs. Use it to find a component's stories and their preview
  URLs. Each story file imports its component's source CSS, so `stories-changed` and
  `stories-find-by-component` follow CSS edits too. Its story-writing instructions are generic
  (play functions, `fn`, Vitest); Plinth's component rules and the `new-component` skill win
  where they differ. The docs tools stay off until the HTML renderer generates a components
  manifest (#7).
- **After an edit:** `.claude/settings.json` runs Prettier on the edited file, and Stylelint on
  component CSS. An agent without that hook runs `npm run format` before committing.

## Working in this repo

- Licence: MIT.
- `main` is protected: no direct pushes, every change goes through a pull request, and the `ci`
  check must pass before it can be merged. Branch from `main` and target `main` (no stacked pull
  requests). Commit and push after each step.
- Commit and PR bodies are plain words explaining the change, with no session links or
  `Claude-Session` trailers.
- Commit messages and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org):
  `type(scope): description`. Pull requests are squash-merged, so the title becomes the commit on
  `main`.
  - Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Scope: the component for component work (`button`, `icon-button`), otherwise the area
    (`tokens`, `css`, `vue`, `blade`, `storybook`, `adr`, `agents`, `deps`). Leave it out when a
    change spans the whole repository.
  - Description: lowercase, imperative, no full stop (`feat(badge): add a dot option`).
  - A breaking change adds `!` after the scope (`feat(tokens)!: rename the surface tokens`) and
    explains it in a `BREAKING CHANGE:` footer.
- UI pull requests include screenshots at 390, 768 and 1440 px, light and dark.
- Problems and ideas become GitHub issues.
- Never touch, share code with, or propose packages shared with uScore (Defero-AS/defero).
