# Menu sheet

The app shell's menu: a [sheet](sheet.md) with the signed-in user, the navigation and the account
actions. The header's menu button opens it. On a phone it slides up from the bottom; from 768px up
it is a full-height panel on the inline-end edge.

## When not to use it

- For a task such as filters or a short form: use a plain [sheet](sheet.md).
- For a few actions on one item: use a menu of buttons in a popover.
- For the sections of one page: use the [section menu](section-menu.md).

## The menu

The menu stays closed until you press its button.

```blade example
<x-plinth::icon-button label="Menu" variant="secondary" commandfor="example-menu" command="show-modal"><x-site.glyph name="menu" /></x-plinth::icon-button>
<x-plinth::menu-sheet id="example-menu" user-name="Ana Lima" user-detail="ana@example.com" user-href="#">
    <x-plinth::list-card heading-level="h3">
        <li><x-plinth::list-row href="#" current>Projects</x-plinth::list-row></li>
        <li><x-plinth::list-row href="#">Invoices</x-plinth::list-row></li>
        <li><x-plinth::list-row href="#">Team</x-plinth::list-row></li>
    </x-plinth::list-card>
    <x-slot:account>
        <x-plinth::list-card heading-level="h3">
            <li><x-plinth::list-row href="#">Settings</x-plinth::list-row></li>
            <li><x-plinth::list-row button>Sign out</x-plinth::list-row></li>
        </x-plinth::list-card>
    </x-slot:account>
</x-plinth::menu-sheet>
```

| Part                         | Element          | Required | What it is                                                       |
| ---------------------------- | ---------------- | -------- | ---------------------------------------------------------------- |
| `.plinth-menu-sheet`         | `<dialog>`       | yes      | On a sheet's root, always `data-placement="end"`, with no footer |
| `.plinth-menu-sheet-user`    | `<a>` or `<div>` | no       | A list row with a decorative avatar, the name and a detail line  |
| `.plinth-menu-sheet-nav`     | `<nav>`          | yes      | Named by the title; holds list cards of link rows                |
| `.plinth-menu-sheet-account` | `<div>`          | no       | A list card of account actions, on the bottom edge of the panel  |

- Everything the sheet does holds: the browser traps focus, closes it on Escape or a tap on the
  backdrop, and returns focus to the menu button. Give it an **`id`** and point the header's menu
  button at it with `commandfor` and `command="show-modal"`.
- The **title** is _Menu_ by default; set it, and **`close-label`**, in the page's language. It
  names the sheet and the navigation.
- The user row is optional. Give it a **`user-href`** and it links to the profile, with a chevron.
- The navigation holds [list cards](list-card.md) of link rows, one card or several with headings.
  The sheet's title is an `<h2>`, so the cards' headings are `<h3>` (`heading-level="h3"`).

## The current page

The app marks the row of the page being shown as current (`current` on the list row, which prints
`aria-current="page"`) and keeps it up to date. The menu remembers nothing. A link that navigates
closes the menu with the page; one that stays on the page (a Livewire or Vue router link) closes it
with `close()` or `command="close"`.

## Signing out

Signing out changes state, so it is a button row, never a link: one with `wire:click` or `@click`,
or one with `type="submit"` and `form="…"` that posts a form elsewhere on the page.

## Long menus

The body scrolls as one, and the account follows the navigation.

## Props

The same names in Blade and Vue. The React layer is coming in
[#66](https://github.com/bdynamicpt/plinth/issues/66).

| Prop       | Blade                           | Vue                             | Default   |
| ---------- | ------------------------------- | ------------------------------- | --------- |
| id         | `id="menu"`                     | `id="menu"`                     | generated |
| title      | `title="Menu"`                  | `title="Menu"`                  | `Menu`    |
| closeLabel | `close-label="Close"`           | `close-label="Close"`           | `Close`   |
| userName   | `user-name="Ana Lima"`          | `user-name="Ana Lima"`          | none      |
| userDetail | `user-detail="ana@example.com"` | `user-detail="ana@example.com"` | none      |
| userSrc    | `user-src="/avatars/ana.jpg"`   | `user-src="/avatars/ana.jpg"`   | none      |
| userHref   | `user-href="/profile"`          | `user-href="/profile"`          | none      |
| navigation | the slot                        | the default slot                | none      |
| account    | `<x-slot:account>`              | `#account` slot                 | none      |

```blade tab="Blade"
<x-plinth::menu-sheet id="menu" :user-name="$user->name" :user-detail="$user->email" user-href="/profile" wire:ignore.self>
    <x-plinth::list-card heading-level="h3">
        <li><x-plinth::list-row href="/projects" :current="request()->routeIs('projects*')">Projects</x-plinth::list-row></li>
    </x-plinth::list-card>
    <x-slot:account>
        <x-plinth::list-card heading-level="h3">
            <li><x-plinth::list-row button wire:click="signOut">Sign out</x-plinth::list-row></li>
        </x-plinth::list-card>
    </x-slot:account>
</x-plinth::menu-sheet>
```

```vue tab="Vue"
<PlinthMenuSheet id="menu" :user-name="user.name" :user-detail="user.email" @close="onClose">
  <PlinthListCard heading-level="h3">
    <li><PlinthListRow href="/projects" :current="route.name === 'projects'">Projects</PlinthListRow></li>
  </PlinthListCard>
  <template #account>
    <PlinthListCard heading-level="h3">
      <li><PlinthListRow button @click="signOut">Sign out</PlinthListRow></li>
    </PlinthListCard>
  </template>
</PlinthMenuSheet>
```

In Livewire, put `wire:ignore.self` on the menu sheet, as on any sheet, so a re-render keeps it
open. In Vue, a ref's `showModal()` and `close()` open and close it, and it emits `close`.

## Accessibility

- A native modal dialog: focus is trapped inside, the page behind is inert, Escape closes it and
  focus returns to the menu button.
- The title names both the sheet and its `<nav>`; the close button is always there and named in
  the page's language.
- The current page's row says so (`aria-current="page"`).
- The user's avatar is decorative: the name next to it says who it is.
- Every row keeps a 40px touch target.

The markup contract is at the top of
[`packages/css/src/components/menu-sheet.css`](../../packages/css/src/components/menu-sheet.css).
