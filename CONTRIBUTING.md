# Contributing to Plinth

Plinth is shared by several projects, so nothing in it may know about any one of them: no
project names, colours or copy. A project brings its brand by overriding the tokens.

## The rules for every component

**Mobile first.** Base rules are the phone. `@media (min-width: 768px)` and
`@media (min-width: 1280px)` add to them; there are no `max-width` queries.

**Tokens only.** No hex values, named colours or colour functions, no raw lengths for spacing,
font sizes or radii, and no raw z-index in a component's CSS. Use the `--plinth-*` custom
properties, and only **semantic or component** tokens: primitives (`--plinth-ref-*`) are for
building semantic tokens, and Stylelint rejects them in component CSS. The CSS build also rejects
any `var(--plinth-*)` that is not a token. If a value is missing, add a token in
`packages/tokens/tokens/` first (see ADR 1 in `docs/adr/`).

**Class names.** `plinth-component` for the root and `plinth-component-part` for its parts
(`plinth-badge`, `plinth-badge-dot`). State is an ARIA attribute (`aria-expanded`,
`aria-current`, `aria-invalid`) or, when no ARIA attribute fits, an `is-*` class. Variants chosen
by the author, such as a tone, are `data-*` attributes (`data-tone="success"`). A component may
keep its own custom properties, named `--plinth-component-*`.

**Logical properties.** `margin-inline`, `padding-block`, `inset-inline-end`, `inline-size`, and
`text-align: start`, so right-to-left works.

**Usable by everyone.** Touch targets are at least 40 × 40 px (`--plinth-touch-target`). Nothing
depends on hover. Motion uses the `--plinth-duration-*` tokens, which drop to 0ms under
`prefers-reduced-motion`. Colour is never the only signal. Text meets WCAG AA in light and dark.

**In `@layer plinth`.** Wrap a component's rules in `@layer plinth { … }`, so a project's
utilities can override them without `!important`; the CSS build refuses a file that doesn't.
Plain modern CSS, no `@apply`.

**No `!important`.**

Stylelint enforces most of these (`stylelint.config.js`), along with property order.

## What a component ships

Every component ships all of these in the same pull request. An agent (or you) can start with
`node .claude/skills/new-component/scaffold.ts <name>`, which writes the files below for a minimal
component; `.claude/skills/new-component/SKILL.md` walks through the rest.

1. **CSS**: `packages/css/src/components/<name>.css`, with its markup contract in a comment at the
   top.
2. **Story**: `storybook/stories/components/<Name>.stories.ts`, with the markup in a plain
   function (`<name>.ts`) and a story for each state. The test runner checks it in light and dark
   at 390, 768 and 1440 px.
3. **Blade**: `packages/blade/resources/views/components/<name>.blade.php`
   (`<x-plinth::name>`), with Pest tests.
4. **Vue**: `packages/vue/src/Plinth<Name>.vue`, exported from `src/index.ts` and registered by
   the plugin, with Vitest tests.
5. **Parity test**: a case in `storybook/test/parity.test.ts`, so the Blade and Vue output must
   match the story's markup.
6. **Docs**: the story's docs page (description, and anything a user must know).
7. **Screenshots** in the pull request, at 390, 768 and 1440 px in light and dark.

The Blade and Vue layers only print markup. They hold no styles, and they do not add elements or
attributes that the story does not have.

## Before you open a pull request

```bash
npm run format
npx turbo run lint test build build-storybook
```

If you changed CSS, commit the rebuilt `packages/blade/resources/dist/plinth.css` too. CI fails
when it is out of date.
