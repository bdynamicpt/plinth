# Callout

A note inside a page: something the reader should know before going on. A docs page uses it for a
tip or a warning next to the text it is about; an app uses it for a trial that is ending, a
setting that affects others, or the result of something the person just did.

## When not to use it

- For a message that should float above the page and go away by itself: that is a toast.
- For a decision the person must make before going on: that is a dialog.
- For the status of one item in a list: that is a [badge](badge.md).
- Stacked several to a screen. One callout says _this matters_; three say nothing.

## Tones

The tone says what kind of note it is. Pick it by meaning, not by colour. Each tone has its own
icon shape, so the tone shows without colour too.

| Tone        | Use it for                                       | Examples                                    |
| ----------- | ------------------------------------------------ | ------------------------------------------- |
| **neutral** | A remark or a tip, neither good nor bad          | _Drafts are private_                        |
| **info**    | Something worth knowing about how things work    | _Invoices are sent at 9:00_                 |
| **success** | Something worked                                 | _Invoice sent_                              |
| **warning** | Needs attention soon, but nothing has gone wrong | _Your trial ends in 3 days_                 |
| **danger**  | Something went wrong, or can't be undone         | _The export failed_, _Deleting is for good_ |

```blade example layout="stack"
<x-plinth::callout title="Drafts are private">Only you can see an invoice until you send it.</x-plinth::callout>
<x-plinth::callout tone="info" title="Invoices are sent at 9:00">Anything you schedule today goes out tomorrow morning.</x-plinth::callout>
<x-plinth::callout tone="success" title="Invoice sent">The client gets a copy by email.</x-plinth::callout>
<x-plinth::callout tone="warning" title="Your trial ends in 3 days">Pick a plan to keep your projects.</x-plinth::callout>
<x-plinth::callout tone="danger" title="The export failed">Nothing was changed. Try again in a minute.</x-plinth::callout>
```

## Title, text and actions

The title is optional: a short callout reads better as one sentence. The text may hold links and
inline code; links take the text's colour, underlined, so they read on every tone. Actions are
small buttons or links; keep them to one or two.

```blade example layout="stack"
<x-plinth::callout tone="info">Invoices are sent at 9:00, in the client's time zone.</x-plinth::callout>
<x-plinth::callout tone="warning" title="Your trial ends in 3 days">
    Add a payment method to keep your projects.
    <x-slot:actions>
        <x-plinth::button variant="secondary" size="sm" href="#">Add payment method</x-plinth::button>
    </x-slot:actions>
</x-plinth::callout>
```

## Your own icon

The tone's icon comes with the component. Put your project's SVG in its place when a more specific
picture helps; draw it with `currentColor` so it takes the tone's colour.

```blade example layout="stack"
<x-plinth::callout title="Weekly digest">
    <x-slot:icon><x-site.glyph name="bell" /></x-slot:icon>
    Every Monday, a summary of the week's projects goes to the whole team.
</x-plinth::callout>
```

## Markup contract

Blade, Vue and React print exactly this markup, and the parity tests hold them to it.

| Part                      | Element  | Required | What it is                                                                     |
| ------------------------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `.plinth-callout`         | `<div>`  | yes      | The root. Takes `data-tone`, `role` and any attribute the app forwards         |
| `.plinth-callout-icon`    | `<span>` | yes      | A Plinth icon: the tone's own shape, or the project's SVG in its place         |
| `.plinth-callout-body`    | `<div>`  | yes      | Holds the title, the text and the actions, one under the other                 |
| `.plinth-callout-title`   | `<p>`    | no       | A short title in semibold, printed only when there is one                      |
| `.plinth-callout-text`    | `<div>`  | no       | The text. It may hold paragraphs, links and code; links take the text's colour |
| `.plinth-callout-actions` | `<div>`  | no       | Buttons or links, in a row that wraps                                          |

| Attribute     | On                     | Values                                              | Default   |
| ------------- | ---------------------- | --------------------------------------------------- | --------- |
| `data-tone`   | `.plinth-callout`      | `neutral`, `info`, `success`, `warning`, `danger`   | `neutral` |
| `role`        | `.plinth-callout`      | `note`, `status`, `alert`                           | `note`    |
| `aria-hidden` | `.plinth-callout-icon` | always `true`: the icon only repeats what text says | none      |

The callout has no states of its own: it doesn't open, close or select. To let the reader dismiss
it, the app puts a button in the actions and removes the callout itself.

## Props

The same names in every layer. React takes the Vue props, with the text as `children` and the
slots as props that take a node.

| Prop    | Blade                                                      | Vue                              | React              | Default    |
| ------- | ---------------------------------------------------------- | -------------------------------- | ------------------ | ---------- |
| tone    | `tone="warning"` or `:tone="$tone"` (a `CalloutTone` case) | `tone="warning"`                 | `tone="warning"`   | `neutral`  |
| role    | `role="status"` or `:role="$role"` (a `CalloutRole` case)  | `role="status"`                  | `role="status"`    | `note`     |
| title   | `title="…"`, or `<x-slot:title>` for markup                | `title="…"`, or the `title` slot | `title` (a node)   | none       |
| text    | the slot                                                   | the default slot                 | `children`         | none       |
| actions | `<x-slot:actions>`                                         | the `actions` slot               | `actions` (a node) | none       |
| icon    | `<x-slot:icon>` with your SVG                              | the `icon` slot                  | `icon` (a node)    | the tone's |

Extra attributes reach the root `<div>`: in Blade through `$attributes`, in Vue by falling
through, and in React as props (`className`, added to Plinth's class, `id`, `data-*`, `aria-*` and
`ref`). The tones and roles are exported as `calloutTones` and `calloutRoles`.

```blade tab="Blade"
<x-plinth::callout tone="warning" title="Your trial ends in 3 days">
    Add a payment method to keep your projects.
    <x-slot:actions>
        <x-plinth::button variant="secondary" size="sm" :href="route('billing')">Add payment method</x-plinth::button>
    </x-slot:actions>
</x-plinth::callout>
```

```vue tab="Vue"
<PlinthCallout tone="success" role="status" title="Invoice sent">
  Atlas Studio will get INV-1042 by email.
</PlinthCallout>
```

```tsx tab="React"
import { PlinthButton, PlinthCallout } from '@bdynamic/plinth/react';

<PlinthCallout
    tone="danger"
    role="alert"
    title="The export failed"
    actions={
        <PlinthButton variant="secondary" size="sm" onClick={retry}>
            Try again
        </PlinthButton>
    }
>
    Your projects are safe; try again in a few minutes.
</PlinthCallout>;
```

## Accessibility

- **The words carry the meaning.** The tone and the icon only reinforce it, so the title or the
  text says what kind of note it is (_The export failed_, not just a red box). The icon is hidden
  from screen readers.
- **`role="note"`** (the default) marks content that is part of the page, read in order with what
  is around it and never announced on its own.
- **`role="status"`** is for a message the app adds after something happens (_Invoice sent_):
  screen readers announce it when they are idle. **`role="alert"`** is for an urgent one (_The
  export failed_): it is announced at once, interrupting. Use it sparingly.
- **A live region inserted with its content is often not announced.** For a reliable
  announcement, keep an empty container with `role="status"` (or `role="alert"`) in the page from
  the start, and put the callout in it when the event happens.
- **Don't move focus** to a callout. If it has actions, they come next in the tab order.
- **The text meets WCAG AA** on every tone, in light and dark. The callout keeps its hairline edge
  in forced-colours mode.
- Links in the text show the focus ring; buttons in the actions keep a 40 × 40px touch target on a
  touch screen.

The markup contract is at the top of
[`packages/css/src/components/callout.css`](../../packages/css/src/components/callout.css).
