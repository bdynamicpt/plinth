# Code block

A block of code with an optional file name or label, a copy button and optional language tabs
(Blade, Vue, React, HTML). Use it for install commands, configuration and examples. The code
keeps its lines and scrolls sideways inside its own box on a phone, never the page.

## When not to use it

- For a word or a short name in a sentence (`npm ci`, a token's name), use inline `<code>`.
- For output the person reads but never copies, such as a log, plain text may be enough; set
  `copy` off if you use the block.
- It doesn't highlight: highlighting is the project's (this site highlights on the server with
  Phiki), and the block styles what it is given.

```blade example layout="stack"
<x-plinth::code-block label="Terminal">composer require bdynamicpt/plinth</x-plinth::code-block>
```

## Language tabs

The tabs are native radio buttons (ADR 2). The browser moves between them with the arrow keys and
keeps the checked one; CSS shows the `<pre>` in the checked tab's place. There is no script, so
the tabs work in the plain HTML too. Every example on this site is a code block with tabs.

- A block has up to six tabs; the layers drop the rest.
- `selected` is the tab that starts checked. After that the browser keeps the reader's choice,
  and a new `selected` doesn't move it.
- The radios share a name: the block's id with `-language`. Blade, Vue and React generate one when
  the block has no id; in plain HTML, give each block on a page its own name, or their tabs become
  one group.
- Inside a `<form>` the radios are part of it: the form sends `<name>=on`, and a reset checks the
  starting tab again.

```blade tab="Blade"
<x-plinth::code-block id="new-invoice" selected="Vue" :tabs="[
    ['label' => 'Blade', 'code' => $blade],
    ['label' => 'Vue', 'code' => $vue],
    ['label' => 'React', 'code' => $react],
]" />
```

```vue tab="Vue"
<PlinthCodeBlock id="new-invoice" :tabs="tabs" selected="Vue" />
```

```tsx tab="React"
<PlinthCodeBlock id="new-invoice" tabs={tabs} selected="Vue" />
```

## Highlighted code

Pass the highlighter's markup: with Phiki or Shiki, the spans inside its `<code>`. The block sets
the font, the size, the spacing and the scrolling; the colours of the code are the highlighter's,
so give it a theme for light and one for dark.

## Long code

A long line scrolls sideways inside the block, and a long label is cut short with an ellipsis.

```blade example layout="stack"
<x-plinth::code-block label="resources/views/invoices/partials/summary-for-the-monthly-email.blade.php">php artisan invoices:send --month=2026-10 --only-overdue --include-drafts --notify=finance@example.com</x-plinth::code-block>
```

## Without a label or the copy button

Without a label, the header holds only the copy button. With `copy` off, the button and its
status are left out, and with neither the header hides.

```blade example layout="stack"
<x-plinth::code-block>npm install @bdynamic/plinth</x-plinth::code-block>
<x-plinth::code-block :copy="false">npm run build</x-plinth::code-block>
```

## A label with markup

The label may hold a little markup, such as a badge: the `label` slot in Blade and Vue, a node in
React.

```blade example layout="stack"
<x-plinth::code-block>
    <x-slot:label>.env <x-plinth::badge tone="warning">Secret</x-plinth::badge></x-slot:label>
    APP_KEY=base64:…
</x-plinth::code-block>
```

## Markup contract

| Part                           | Element                        | Required             | What it is                                                   |
| ------------------------------ | ------------------------------ | -------------------- | ------------------------------------------------------------ |
| `.plinth-code-block`           | `<div>`                        | yes                  | The root; it takes the app's id and attributes               |
| `.plinth-code-block-header`    | `<div>`                        | yes                  | The bar above the code; it hides when it has nothing to show |
| `.plinth-code-block-label`     | `<span>`                       | no                   | A file name or a short label, cut short with an ellipsis     |
| `.plinth-code-block-tabs`      | `<div role="radiogroup">`      | with tabs            | The language tabs, named by `aria-label`                     |
| `.plinth-code-block-tab`       | `<label>`                      | with tabs            | One tab                                                      |
| `.plinth-code-block-tab-input` | `<input type="radio">`         | with tabs            | The radio, covering its tab; `checked` on the one that shows |
| `.plinth-code-block-copy`      | `<button>` (the button)        | unless `copy` is off | Copies the code that shows; printed `hidden`                 |
| `.plinth-code-block-status`    | `<span role="status">`         | unless `copy` is off | Says _Copied_ to a screen reader; not shown                  |
| `.plinth-code-block-code`      | `<pre dir="ltr" tabindex="0">` | yes, one per tab     | The code, in a `<code>`                                      |

| Attribute or state | On               | Values                                           | Default       |
| ------------------ | ---------------- | ------------------------------------------------ | ------------- |
| `name`             | each tab's input | the root's id with `-language`                   | generated     |
| `checked`          | one tab's input  | the tab that shows                               | the first tab |
| `aria-label`       | the radio group  | the tabs' name                                   | _Language_    |
| `hidden`           | the copy button  | removed by the layer when the clipboard is there | printed       |

## Props

| Prop        | Blade                                                | Vue                                | React                 | Default    |
| ----------- | ---------------------------------------------------- | ---------------------------------- | --------------------- | ---------- |
| the code    | the slot                                             | the default slot, or `html`        | `children`, or `html` | none       |
| label       | `label`, or `<x-slot:label>`                         | `label`, or the `label` slot       | `label` (a node)      | none       |
| tabs        | `tabs`: `[['label' => …, 'code' => …, 'html' => …]]` | `tabs`: `{ label, code, html? }[]` | `tabs`                | none       |
| selected    | `selected`                                           | `selected`                         | `selected`            | first tab  |
| tabsLabel   | `tabs-label`                                         | `tabs-label`                       | `tabsLabel`           | _Language_ |
| copy        | `:copy="false"`                                      | `:copy="false"`                    | `copy={false}`        | `true`     |
| copyLabel   | `copy-label`                                         | `copy-label`                       | `copyLabel`           | _Copy_     |
| copiedLabel | `copied-label`                                       | `copied-label`                     | `copiedLabel`         | _Copied_   |
| id          | `id`                                                 | `id`                               | `id`                  | none       |

In Blade the slot is printed as it is given: `{{ $code }}` escapes plain code, and
`{!! $highlighted !!}` prints a highlighter's markup. In Vue and React the code is text, and
`html` takes a highlighter's markup instead. A tab's `code` is text in all three, and its `html`
takes the markup instead (trusted: never pass it what a user typed).

The `<pre>` keeps every space and line break it is given. Pass multi-line code as a string (a
variable in Blade, a bound value in Vue and React): code written straight into a Vue template or
JSX loses its line breaks, and in Blade the template's indentation ends up in the block.

The app's attributes (`class`, `id`, `wire:*`, `x-*`, `data-*`, `aria-*`) reach the root `<div>`.
Blade shows and wires the copy button with Alpine, which Livewire and Filament already load; Vue
and React show it once mounted. Vue emits **`copied`** with the text, and React calls
**`onCopied`**.

```blade tab="Blade"
<x-plinth::code-block label=".env">{{ $env }}</x-plinth::code-block>
```

```vue tab="Vue"
<PlinthCodeBlock label="brand.css" @copied="track">{{ brand }}</PlinthCodeBlock>
```

```tsx tab="React"
import { PlinthCodeBlock } from '@bdynamic/plinth/react';

<PlinthCodeBlock label="Terminal" onCopied={track}>
    composer require bdynamicpt/plinth
</PlinthCodeBlock>;
```

## Accessibility

- The `<pre>` takes `tabindex="0"`, so a keyboard user can reach it and scroll it sideways; it
  shows the focus ring inset. A screen reader reads the code itself; the label above names it for
  a sighted reader.
- The tabs are a radio group named _Language_ (`tabs-label`): Tab reaches the checked one, the
  arrow keys pick another, and a screen reader announces each as a radio button, _1 of 4_. The
  radio covers its tab, so the tab shows the focus ring, and on a touch screen each tab keeps a
  40px touch target.
- The copy button is a real `<button>` with the button's 40px touch target. It is printed
  `hidden`, so it never shows where it can't work. After copying it says _Copied_ for two seconds,
  and the status, a polite live region, says the same to a screen reader.
- The code reads left to right (`dir="ltr"`) on a right-to-left page too.
- In forced colours, the checked tab takes the system highlight.

The markup contract is at the top of
[`packages/css/src/components/code-block.css`](../../packages/css/src/components/code-block.css).
