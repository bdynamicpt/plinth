# 6. A React layer, the third thin layer over the markup contract

- Status: accepted
- Date: 2026-10-19
- Issue: [#65](https://github.com/bdynamicpt/plinth/issues/65) (with #66)

## Context

Plinth's components are plain HTML and CSS with a markup contract, printed by two thin layers:
Blade (with the Filament plugin) and Vue 3. Parity tests check that both print each story's
markup. Projects built with Laravel and Inertia use either Vue or React on the front end, so a
React project today has to rewrite the markup by hand, which is exactly the drift the contract
exists to prevent.

## Decision

### 1. A React package, built and tested like the Vue one

`packages/react` (workspace `@bdynamic/plinth-react`) holds React function components, built with
Vite in library mode to ESM with type declarations. It holds no styles: projects load Plinth's
CSS as with every other layer.

It targets **React 19**: `ref` is a plain prop there, so components need no `forwardRef`, and
React 19 is what current Inertia React projects start on. `react` and `react-dom` are peer
dependencies.

### 2. The same contract, the same names

- Components have the Vue names and props: `PlinthButton`, `variant`, `size`, `href`, `busy`.
- Vue's default slot is `children`; named slots are props that take a node (`icon`, `trailing`,
  `leading`, `actions`).
- Choices with a fixed set of values reuse the shared lists and fall back to the default for an
  unknown value, as Vue and Blade do.
- Every other prop, including `className`, `id`, `data-*`, `aria-*` and event handlers, reaches
  the documented root element (ADR 2, section 5), and `ref` reaches the root. `className` is
  merged with Plinth's classes, never replacing them.
- A component's own events are callbacks named `on…` (`onClose`), matching the Vue events.

### 3. Safe on the server

Components render on the server (Inertia's SSR) and on the client with the same output. Nothing
reads `window` or `document` while rendering; the little behaviour a layer may need (ADR 2,
section 6, such as the drawer closing on `scrollend`, ADR 5) runs in an effect.

### 4. Tested to the same bar

Vitest with Testing Library, 100% coverage enforced in the test script. The parity suite renders
each component with `renderToStaticMarkup` and compares it with the story's markup, normalised
as for Blade and Vue. A component is not done until its Blade, Vue and React output all match.

### 5. Published in the one package, at the one version

The build goes out as the `./react` subpath of `@bdynamic/plinth`, next to `./vue`, with `react`
and `react-dom` as optional peer dependencies. The workspace joins the Changesets `fixed` group,
so it carries the same version as everything else (ADR 4). Turborepo builds it after the CSS,
alongside Vue and Blade, and before Storybook.

## Consequences

- Every new component ships three layers. AGENTS.md, CONTRIBUTING, the new-component skill and
  the component reviewer say so.
- The components built before this ADR get their React layer in #65 (badge, icon, button, icon
  button) and #66 (the rest).
- A Svelte layer is wanted as a nice to have, after React and the dialog family (#68). It
  follows these rules with Svelte's own idioms (snippets for slots), in its own ADR.
