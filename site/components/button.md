# Button

A button **does something**: saves, submits, opens a sheet, deletes. A link **goes somewhere**.
If activating it takes the person to another page, use a link; give it the button's look (an
`href`) only when it is a call to action that must look like one, such as _Read more_ on a card.

## Choosing a variant

Most of a screen's buttons are **secondary** or **ghost**. Emphasis is a budget: spend it on the
one action the person came to do.

| Variant          | Use it for                                                                                 | Not for                                      |
| ---------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **primary**      | The main action of a view, dialog or form: _Save changes_, _Create invoice_. One per area. | Several actions side by side                 |
| **accent**       | A marketing or brand moment: _Upgrade plan_, _Start free trial_. At most one per screen.   | Everyday app actions; use primary            |
| **secondary**    | The alternatives next to a primary: _Cancel_, _Back_, _Export_.                            | The main action                              |
| **ghost**        | Low-emphasis and repeated actions: toolbars, table rows, _Skip_.                           | Anything the person must not miss            |
| **danger**       | Confirming a destructive action, usually in a dialog: _Delete project_, next to _Cancel_.  | The first step of a delete; use danger-ghost |
| **danger-ghost** | A destructive action in a list or row that a confirmation will follow: _Remove_.           | Confirming the deletion itself               |

```blade example
<x-plinth::button>Save changes</x-plinth::button>
<x-plinth::button variant="accent">Start free trial</x-plinth::button>
<x-plinth::button variant="secondary">Cancel</x-plinth::button>
<x-plinth::button variant="ghost">Skip</x-plinth::button>
<x-plinth::button variant="danger">Delete project</x-plinth::button>
<x-plinth::button variant="danger-ghost">Remove</x-plinth::button>
```

### Primary and accent

**Primary** is the quiet default: dark on light, light on dark. A project's brand can colour it,
but in Plinth's own look it stays neutral, so the accent keeps its meaning. **Accent** is the
brand's colour, filled. It pulls the eye harder than anything else on the page, which is exactly
why it is rare: one per screen, for the moment that matters to the business.

### Secondary and ghost

Secondary sits on a raised surface with a hairline; ghost is text until you hover it. Pair a
secondary with a primary; use ghost where many actions repeat, so they don't shout.

```blade example
<x-plinth::button variant="secondary">Cancel</x-plinth::button>
<x-plinth::button>Create invoice</x-plinth::button>
```

### Danger and danger-ghost

Solid red is for the last, deliberate step of something that can't be undone. Earlier steps, and
destructive actions in rows, use danger-ghost: red text, no fill.

```blade example
<x-plinth::button variant="secondary">Cancel</x-plinth::button>
<x-plinth::button variant="danger">Delete project</x-plinth::button>
```

### Why there is no success or warning button

Status colours describe an **outcome**, not an action. _Approve_ or _Confirm_ is the main action,
so it is primary; success is shown afterwards, with a badge or a message. A green or yellow button
also makes colour carry the meaning, which the label should carry.

## Sizes

**md** (32px) is the default. Use **sm** (28px) in dense places such as table rows and toolbars,
and **lg** (40px) for the main action on a touch-first screen or a marketing page. On a touch
screen every size keeps a 40px touch target, so a small button is still easy to tap.

```blade example
<x-plinth::button size="sm">Small</x-plinth::button>
<x-plinth::button>Medium</x-plinth::button>
<x-plinth::button size="lg">Large</x-plinth::button>
```

## Labels and icons

- Start with a verb and say what happens: _Save changes_, not _OK_; _Delete project_, not _Yes_.
- Sentence case, two or three words.
- A leading icon (the `icon` slot) helps a familiar action be found; a trailing icon (`trailing`)
  is for direction, such as an arrow on _Next_. Set `mirror-trailing` on arrows so they flip in
  right-to-left text.
- A button with only an icon is the [icon button](icon-button.md); it needs an accessible name.

```blade example
<x-plinth::button variant="secondary">
    <x-slot:icon><x-site.glyph name="plus" /></x-slot:icon>
    New invoice
</x-plinth::button>
<x-plinth::button variant="ghost" mirror-trailing>
    Next
    <x-slot:trailing><x-site.glyph name="arrow-right" /></x-slot:trailing>
</x-plinth::button>
```

## States

**Disabled**: prefer keeping the button enabled and explaining what is missing when it is pressed;
a disabled button doesn't say why. When you must disable it, a `<button>` gets `disabled`, and a
link loses its `href` and gets `aria-disabled`.

**Busy**: while the action runs, the button shows a spinner and keeps focus. Change the label too
(_Saving_), since screen readers announce the busy state unreliably, and ignore further presses
yourself: a busy submit button still submits its form.

```blade example
<x-plinth::button disabled>Save changes</x-plinth::button>
<x-plinth::button busy>Saving</x-plinth::button>
```

## Props

The same names in every layer. Blade writes a camelCase prop in kebab-case (`mirror-icon`), as Vue
can; React takes the Vue props, with the label as `children` and the slots as props that take a
node.

| Prop           | Blade                                             | Vue                        | React                 | Default   |
| -------------- | ------------------------------------------------- | -------------------------- | --------------------- | --------- |
| variant        | `variant="secondary"` (or a `ButtonVariant` case) | `variant="secondary"`      | `variant="secondary"` | `primary` |
| size           | `size="sm"` (or a `Size` case)                    | `size="sm"`                | `size="sm"`           | `md`      |
| href           | `href="/invoices"`, makes it a link               | `href="/invoices"`         | `href="/invoices"`    | none      |
| disabled       | `disabled` or `:disabled="$locked"`               | `disabled`                 | `disabled`            | off       |
| busy           | `busy` or `:busy="$saving"`                       | `busy` or `:busy="saving"` | `busy={saving}`       | off       |
| mirrorIcon     | `mirror-icon`                                     | `mirror-icon`              | `mirrorIcon`          | off       |
| mirrorTrailing | `mirror-trailing`                                 | `mirror-trailing`          | `mirrorTrailing`      | off       |
| leading icon   | `<x-slot:icon>`                                   | `#icon` slot               | `icon={<Icon />}`     | none      |
| trailing icon  | `<x-slot:trailing>`                               | `#trailing` slot           | `trailing={<Icon />}` | none      |
| label          | the slot                                          | the default slot           | `children`            | none      |

`class`, `type`, `wire:*`, `x-*` and `@click` reach the button itself; in React, `className`
(added to Plinth's classes), `type`, `onClick`, `ref` and every other prop do.

```blade tab="Blade"
<x-plinth::button variant="secondary" wire:click="cancel">Cancel</x-plinth::button>
<x-plinth::button type="submit" :busy="$saving">Save changes</x-plinth::button>
```

```vue tab="Vue"
<PlinthButton variant="accent" href="/upgrade">Upgrade plan</PlinthButton>
<PlinthButton type="submit" :busy="saving" @click="save">Save changes</PlinthButton>
```

```tsx tab="React"
import { PlinthButton } from '@bdynamic/plinth/react';

<PlinthButton type="submit" busy={saving} icon={<SaveIcon />}>
    Save changes
</PlinthButton>;
```

## Accessibility

- A native `<button>` with `type="button"` by default, so it never submits a form by accident;
  set `type="submit"` on the one that should.
- Busy sets `aria-busy` and `aria-disabled` but keeps the button focusable, so focus isn't lost
  while the action runs.
- A disabled link has no `href`, `role="link"` and `aria-disabled="true"`.
- The focus ring shows on `:focus-visible`, offset on the filled variants.
- Every size keeps a 40 × 40px touch target on a touch screen.
- Checked with axe in light and dark at 390, 768 and 1440px on every pull request.

The markup contract is at the top of
[`packages/css/src/components/button.css`](../../packages/css/src/components/button.css).
