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

**The focus ring.** Every focusable element, links included, shows the ring on `:focus-visible`:
`outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring)` with
`outline-offset: var(--plinth-focus-ring-offset)`, so it sits on the element's edge. Solid filled
controls use `--plinth-focus-ring-offset-filled` instead, so the ring doesn't merge with their fill.
Full-width rows that sit in a scrolling container (list rows) use
`--plinth-focus-ring-offset-inset`, so the container doesn't cut the ring off.
See **Foundations → Focus ring** in Storybook. The test runner tabs through every story and fails
if a focused element doesn't show it.

**Native behaviour first.** Interactive components get their behaviour from the platform:
`<dialog>` for sheets, the `popover` attribute for menus, `<details>` for disclosure, and
`command` / `commandfor` buttons to open and close them. Style the native open state
(`[open]`, `:popover-open`) rather than adding a class. See
[ADR 2](docs/adr/0002-behaviour-state-and-forwarding.md) for what to do when the
platform is not enough.

**The app owns the state.** Components never fetch, route or remember anything. Layout state
(the active nav item, which pane a split view shows on a phone) is an attribute or `is-*` class
the app sets, such as `aria-current="page"` or `data-pane="detail"`; the component only defines
what each state looks like, and its contract lists them.

**Forward attributes and events.** The Blade component merges `$attributes` onto its documented
root (`$attributes->merge(['class' => …])`), so `class`, `wire:*`, `x-*`, `href`, `data-*` and
`aria-*` reach it. The Vue component lets attributes fall through to the same root and emits
documented events (`open`, `close`, `select`) rather than handling them. The React component
spreads every prop it doesn't use (`id`, `data-*`, `aria-*`, handlers, `ref`) onto the same root
and merges `className` with Plinth's classes; its events are `on…` callbacks (`onClose`) for the
Vue ones ([ADR 6](docs/adr/0006-a-react-layer.md)). When the element an app needs to reach is
inside another (the link in a nav item), it becomes the root of its own component. Each component
has a parity case with extra attributes, so Blade, Vue and React forward the same ones.

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
   (`<x-plinth::name>`), with Pest tests. Its choices (variants,
   tones) are backed enums in `packages/blade/src/Enums/`, resolved with `Enum::resolve()`. Sizes
   share one scale, `Size` (xs to xl, icons included); a component passes the sizes it supports
   (`Size::resolve($size, Size::controls())`). PHP classes are `final` (Pint checks).
4. **Vue**: `packages/vue/src/Plinth<Name>.vue`, exported from `src/index.ts` and registered by
   the plugin, with Vitest tests.
5. **React**: `packages/react/src/Plinth<Name>.tsx`, exported from `src/index.ts`, with Vitest and
   Testing Library tests. The same names and props as Vue; the default slot is `children`, a named
   slot is a prop that takes a node, and nothing reads `window` or `document` while rendering.
6. **Parity test**: cases in `storybook/test/parity.test.ts`, one per story and one with extra
   attributes, so the Blade, Vue and React output must match the story's markup.
7. **Docs**: an MDX page next to the story, `storybook/stories/components/<Name>.mdx`, in the
   shape of `Badge.mdx`: what it is and when to use it, its first example with
   **`<AtEveryWidth of={…} />`** under it (the story at 390, 768 and 1440 px, in dark and light;
   a story that opens a sheet or dialog passes a `height`), the **markup contract** (the markup, a
   table of its parts and one of its attributes and states), a section with a canvas for each
   variant and state, **accessibility** (accessible name, what is announced, keyboard, what the
   app must add), and **in Blade, Vue and React** (a table of the props in each, an example, and
   which attributes reach which element).
8. **Screenshots** in the pull request, at 390, 768 and 1440 px in light and dark.

The Blade, Vue and React layers only print markup. They hold no styles, and they do not add
elements or attributes that the story does not have.

## Before you open a pull request

If the change reaches what Plinth ships (tokens, CSS, Vue, React, Blade), add a changeset with
`npx changeset`: a patch for a fix, a minor for something new, a major for a breaking change,
and one line for the changelog. See `.changeset/README.md`.

```bash
npm run format
npx turbo run lint test build build-storybook
```

If you changed CSS, commit the rebuilt `packages/blade/resources/dist/plinth.css` too. CI fails
when it is out of date.
