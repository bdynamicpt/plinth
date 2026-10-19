# Badge

A short label for the status of something: an invoice that is _Paid_, a task that is _Due soon_, a
person who is _Online_. It sits next to what it describes, in a list row, a table cell or a header.

## When not to use it

- As a button or a filter: it does nothing when pressed. Filters are a [pill row](pill-row.md).
- As a count of unread items or a notification number.
- For a sentence. One or two words; a longer message is a [callout](callout.md).

## Tones

The tone says what kind of status it is. Pick it by meaning, not by colour.

| Tone        | Use it for                                       | Examples                       |
| ----------- | ------------------------------------------------ | ------------------------------ |
| **neutral** | A state that is neither good nor bad, or not yet | _Draft_, _Archived_, _Offline_ |
| **success** | Done, healthy, in good standing                  | _Paid_, _Active_, _Online_     |
| **warning** | Needs attention soon, but nothing has gone wrong | _Due soon_, _Expiring_         |
| **danger**  | Something has gone wrong or is blocked           | _Overdue_, _Failed_            |

```blade example
<x-plinth::badge>Draft</x-plinth::badge>
<x-plinth::badge tone="success">Paid</x-plinth::badge>
<x-plinth::badge tone="warning">Due soon</x-plinth::badge>
<x-plinth::badge tone="danger">Overdue</x-plinth::badge>
```

## The dot

The dot adds a second cue to the tone, for statuses that are a live state rather than a stage,
such as presence (_Online_, _Away_). Use it the same way across a screen: all of a list's badges
with a dot, or none.

```blade example
<x-plinth::badge tone="success" dot>Online</x-plinth::badge>
<x-plinth::badge tone="warning" dot>Away</x-plinth::badge>
<x-plinth::badge dot>Offline</x-plinth::badge>
```

## Markup contract

Blade, Vue and React print exactly this markup, and the parity tests hold them to it.

| Part                  | Element  | Required | What it is                                                     |
| --------------------- | -------- | -------- | -------------------------------------------------------------- |
| `.plinth-badge`       | `<span>` | yes      | The root. Takes `data-tone` and any attribute the app forwards |
| `.plinth-badge-dot`   | `<span>` | no       | A dot before the label, in the tone's colour                   |
| `.plinth-badge-label` | `<span>` | yes      | The text. It stays on one line and ends in an ellipsis         |

| Attribute     | On                  | Values                                        | Default   |
| ------------- | ------------------- | --------------------------------------------- | --------- |
| `data-tone`   | `.plinth-badge`     | `neutral`, `success`, `warning`, `danger`     | `neutral` |
| `aria-hidden` | `.plinth-badge-dot` | always `true`: the dot only repeats the label | none      |

The badge has no states of its own: it doesn't open, select or disable. A missing or unknown
`data-tone` looks neutral, and Blade, Vue and React print `neutral` for a tone they don't know.

## Props

The same names in every layer. React takes the Vue props, with the label as `children`.

| Prop  | Blade                                               | Vue                      | React                   | Default   |
| ----- | --------------------------------------------------- | ------------------------ | ----------------------- | --------- |
| tone  | `tone="success"` or `:tone="$tone"` (a `Tone` case) | `tone="success"`         | `tone="success"`        | `neutral` |
| dot   | `dot` or `:dot="$online"`                           | `dot` or `:dot="online"` | `dot` or `dot={online}` | off       |
| label | the slot                                            | the default slot         | `children`              | none      |

Extra attributes reach the root `<span>`: in Blade through `$attributes` (`class`, `id`,
`data-*`, `aria-*`, and Livewire's and Alpine's `wire:key`, `x-show`), in Vue by falling through,
and in React as props (`className`, added to Plinth's class, `id`, `data-*`, `aria-*` and `ref`).
In Blade the tone is a value or a case of `\BDynamic\Plinth\Enums\Tone`; in Vue and React it is a
`Tone`, and the list is exported as `tones`.

```blade tab="Blade"
<x-plinth::badge :tone="$invoice->status->tone()" wire:key="status-{{ $invoice->id }}">
    {{ $invoice->status->label() }}
</x-plinth::badge>
```

```vue tab="Vue"
<PlinthBadge
    :tone="invoice.paid ? 'success' : 'warning'"
    dot
>{{ invoice.statusLabel }}</PlinthBadge>
```

```tsx tab="React"
import { PlinthBadge } from '@bdynamic/plinth/react';

<PlinthBadge tone={invoice.paid ? 'success' : 'warning'} dot className="ms-2">
    {invoice.statusLabel}
</PlinthBadge>;
```

## Accessibility

- **The label carries the meaning.** The tone and the dot only reinforce it, so a person who
  can't tell the colours apart, or a screen reader, still gets the status from the words. Never
  use a badge with an empty or colour-only label.
- **Screen readers read the label as plain text,** in reading order with what's around it. The
  dot is hidden from them (`aria-hidden="true"`). When the label alone is ambiguous out of
  context, say what it is about in the text around it (_Invoice 104 · Paid_).
- **A badge that changes while the page is open** is not announced by itself. If the change
  matters, the app wraps it in a container with `role="status"` that stays on the page while the
  badge inside it is replaced; a live region added along with the change announces nothing.
- **The text meets WCAG AA** in every tone, in light and dark. In forced-colours mode the badge
  keeps its edge and the dot takes the text colour.
- **Keep it short:** one or two words. A long label is cut with an ellipsis when its container is
  narrow.
- It is not focusable and has no touch target, because it does nothing. To make a status
  clickable, put the badge inside a link or a button, which brings its own focus ring.

The markup contract is at the top of
[`packages/css/src/components/badge.css`](../../packages/css/src/components/badge.css).
