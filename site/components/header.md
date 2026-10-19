# Header

The top bar of the phone shell: a leading action (back or the menu), the page's title, and a few
trailing actions. It sticks to the top of the page while the content scrolls under it.

## When not to use it

- For the site's own top bar on a desktop, with its navigation links: that is the app's layout.
- For a heading inside a page or a card: use a heading. A page has one header.
- For more than two or three actions: put the rest behind a _More_ button that opens a menu.

## The parts

```blade example layout="phone"
<x-plinth::header title="Invoices">
    <x-slot:leading>
        <x-plinth::icon-button label="Menu"><x-site.glyph name="menu" /></x-plinth::icon-button>
    </x-slot:leading>
    <x-slot:actions>
        <x-plinth::icon-button label="Search"><x-site.glyph name="search" /></x-plinth::icon-button>
        <x-plinth::icon-button label="More"><x-site.glyph name="more" /></x-plinth::icon-button>
    </x-slot:actions>
</x-plinth::header>
```

| Part                     | Element    | Required | What it is                                                              |
| ------------------------ | ---------- | -------- | ----------------------------------------------------------------------- |
| `.plinth-header`         | `<header>` | yes      | The root. A project's classes and attributes land on it                 |
| `.plinth-header-leading` | `<div>`    | no       | One action, usually an icon button: back, or the menu                   |
| `.plinth-header-title`   | `<h1>`     | yes      | The page's heading. One line, ending in an ellipsis when it doesn't fit |
| `.plinth-header-actions` | `<div>`    | no       | The trailing actions: two or three icon buttons at most                 |

- At the top of the page, outside `<main>`, `<article>` and `<section>`, the header is the page's
  banner landmark, so a page has one header.
- The leading action is a **back** link (with `mirror`, so its arrow points the other way in
  right-to-left text) or a **menu** button that opens the app's
  [menu sheet](menu-sheet.md) with `commandfor` and `command="show-modal"`.
- The leading part and the actions are printed only when they have content. Every
  [icon button](icon-button.md) needs its own name (`label`) in the page's language.

The header has no variants or states of its own: what its actions do is the app's, through a
link, a `commandfor`, `wire:click` or `@click` on the icon button.

## Back, or nothing

A page further down opens with a back link; a top-level page with nothing to go back to leaves
the leading part out, and a page with no actions shows just its title.

```blade example layout="phone"
<x-plinth::header title="Invoice 1042">
    <x-slot:leading>
        <x-plinth::icon-button label="Back" href="#" mirror><x-site.glyph name="arrow-left" /></x-plinth::icon-button>
    </x-slot:leading>
    <x-slot:actions>
        <x-plinth::icon-button label="Download"><x-site.glyph name="download" /></x-plinth::icon-button>
    </x-slot:actions>
</x-plinth::header>
<x-plinth::header title="Settings" />
```

## Size and the safe area

The header is **`--plinth-header-height`** tall (56px), a component token a project can tune. On a
phone that draws under the status bar and the notch (`viewport-fit=cover` in the viewport meta) it
adds `env(safe-area-inset-top)` above that, and its inline padding clears the notch on a phone held
sideways.

## Sticky

The header is `position: sticky` at the top, on the **`--plinth-layer-sticky`** z-index: above the
page's content, below sheets and menus, which sit in the browser's top layer. It sticks within its
scrolling parent, so put it at the top of the page, not inside a box that scrolls on its own.

Content scrolls under the header, so a focused element or the target of an in-page link can land
behind it. Set `scroll-padding-block-start` on the page's scrolling element to keep them clear:

```css
html {
    scroll-padding-block-start: calc(var(--plinth-header-height) + env(safe-area-inset-top));
}
```

In right-to-left text the leading action and the actions swap sides, and a mirrored back arrow
points right.

## Props

The same names in Blade and Vue. The React layer is coming in
[#66](https://github.com/bdynamicpt/plinth/issues/66).

| Prop    | Blade                         | Vue                | Default |
| ------- | ----------------------------- | ------------------ | ------- |
| title   | `title="Invoices"` (required) | `title="Invoices"` | none    |
| leading | `<x-slot:leading>`            | `#leading` slot    | none    |
| actions | `<x-slot:actions>`            | `#actions` slot    | none    |

Both need a `title` and throw without one. Extra attributes reach the `<header>`.

```blade tab="Blade"
<x-plinth::header title="Message">
    <x-slot:leading>
        <x-plinth::icon-button label="Back" :href="route('inbox')" mirror>…</x-plinth::icon-button>
    </x-slot:leading>
    <x-slot:actions>
        <x-plinth::icon-button label="Archive" wire:click="archive">…</x-plinth::icon-button>
    </x-slot:actions>
</x-plinth::header>
```

```vue tab="Vue"
<PlinthHeader title="Message">
  <template #leading>
    <PlinthIconButton label="Back" href="/inbox" mirror>…</PlinthIconButton>
  </template>
  <template #actions>
    <PlinthIconButton label="Archive" @click="archive">…</PlinthIconButton>
  </template>
</PlinthHeader>
```

## Accessibility

- The title is the page's `<h1>`, and the header is the banner landmark when it sits outside
  `<main>`, `<article>` and `<section>`.
- Every icon button in it has its own accessible name, in the page's language.
- The leading and trailing parts follow the reading order, so they swap sides in right-to-left
  text and a mirrored back arrow points the right way.
- Set `scroll-padding-block-start` so focus and in-page links don't land under the sticky header.
- Every action keeps a 40 × 40px touch target.

The markup contract is at the top of
[`packages/css/src/components/header.css`](../../packages/css/src/components/header.css).
