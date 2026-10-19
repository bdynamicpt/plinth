# Tailwind v4

Plinth works next to Tailwind: its components keep their semantic classes, and your page code
gets Plinth's tokens as utilities.

## Order the layers

Plinth's CSS is in `@layer plinth`. Put that layer after Tailwind's reset and before its
utilities, so a utility class can adjust a component without `!important`:

```css label="resources/css/app.css"
@layer theme, base, plinth, components, utilities;
@import 'tailwindcss';
@import '@bdynamic/plinth/fonts.css';
@import '@bdynamic/plinth/css';
@import '@bdynamic/plinth/tailwind.css';
```

The last import is a Tailwind v4 theme, written by the tokens build (v4 has no JS presets). It
maps Plinth's tokens to Tailwind's theme variables, so `bg-surface`, `text-text-muted`, `p-4` and
`rounded-control` use Plinth's values, and a brand's overrides reach them too.

## Utilities around components, not inside them

Use utilities to lay out your own page: the grid, the gaps, a page's width. Leave a component's
own markup alone, with its classes and attributes as the contract says.

```blade
<div class="grid gap-4 md:grid-cols-2">
    <x-plinth::list-card heading="Recent invoices">…</x-plinth::list-card>
    <x-plinth::list-card heading="Projects">…</x-plinth::list-card>
</div>
```

A utility on a component's root wins over Plinth's CSS, because utilities come after the
`plinth` layer. That is for small adjustments, such as a margin; to change how every button
looks, override the tokens instead ([Branding your project](branding.md)).

> [!TIP]
> No `@apply` of Plinth's classes, and no copies of a component's styles in utilities: the
> component then stops following the tokens, and a brand's override no longer reaches it.
