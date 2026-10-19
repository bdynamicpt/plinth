# Introduction

Plinth is BDynamic's design system: design tokens, components written as plain HTML and CSS, and
thin Blade, Vue and React layers that print exactly the same markup.

## What it is made of

- **Tokens are the source of truth.** Colour (light and dark), type, spacing, sizes, radii,
  elevation, layers, breakpoints and motion are written once, as DTCG JSON, and built to CSS
  custom properties, a JS and TypeScript export and a Tailwind v4 theme. See
  [Token tiers](token-tiers.md).
- **Components are plain HTML and CSS.** Each one documents its markup contract: its elements,
  classes, states and ARIA. The CSS uses tokens only, starts from the phone and sits in
  `@layer plinth`, so a project's own CSS and utilities win without `!important`.
- **The framework layers are thin.** The Blade components (with a Filament plugin), the Vue 3
  components and the React 19 components print the contract and hold no styles. A parity test
  renders every story's HTML, the Blade component, the Vue component and the React one, and fails
  if they differ.
- **Behaviour comes from the platform.** `<dialog>` for sheets, `popover` for menus, `<details>`
  for disclosure, and `command` and `commandfor` to open and close them. No Plinth JavaScript
  ships ([ADR 2](../../docs/adr/0002-behaviour-state-and-forwarding.md)).
- **Storybook is the workshop.** Every story is checked with axe in light and dark, at 390, 768
  and 1440 px, and every focusable element must show the focus ring. It is published with this
  site, at [/storybook](/storybook/).

## One markup contract

Write a component in whichever layer your project uses; the page gets the same HTML.

```blade tab="Blade"
<x-plinth::button variant="secondary">Save draft</x-plinth::button>
```

```vue tab="Vue"
<PlinthButton variant="secondary">Save draft</PlinthButton>
```

```tsx tab="React"
<PlinthButton variant="secondary">Save draft</PlinthButton>
```

```html tab="HTML"
<button type="button" class="plinth-button" data-variant="secondary" data-size="md">
    <span class="plinth-button-label">Save draft</span>
</button>
```

## Your brand, not a fork

Plinth ships a quiet, neutral default: dense UI text, hairline borders, dark first, Geist and
Geist Mono ([ADR 3](../../docs/adr/0003-visual-direction.md)). A project brings its own brand by
overriding semantic tokens after Plinth's CSS, and never forks a component. See
[Branding your project](branding.md).

## Where to go next

- [Installation](installation.md): the npm and Composer packages, and what each holds.
- [Laravel and Filament](laravel.md), [Vue](vue.md) or [React](react.md), for your stack.
- [Foundations](foundations.md): the tokens every component is built from.
- [Decisions](/docs/decisions): why Plinth is the way it is.
