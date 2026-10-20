# Avatar

A person or an organisation, at a glance: in a list of people, on a comment, in the account menu.
It shows an image when there is one, then initials, then a person glyph.

## When not to use it

- As the only way to tell who someone is in a list: show the name next to it, and set
  `decorative`.
- For a status on its own: a status dot needs the person it belongs to. For the status of a
  thing, use a [badge](badge.md).
- As a button. Put it inside a button or a link, which brings the focus ring and the touch target.

## Image, initials, glyph

Give it an `src` for a photo or logo. Without one it shows **initials**, taken from the `name`:
the first letter of the first and the last word (_Ana Lima_ → _AL_). Pass `initials` when the name
doesn't give good ones, as for an organisation. With neither (an avatar that is decorative and has no name), it shows the glyph.

```blade example
<x-plinth::avatar name="Ana Lima" />
<x-plinth::avatar name="Northwind" initials="NW" />
<x-plinth::avatar decorative />
```

## The name, and when it is decorative

An avatar always says whose it is: the `name` becomes its accessible name, read by screen
readers, with any status after it (_Ana Lima, Online_). Blade refuses to render an avatar without
a name, and Vue and React warn while you develop.

When the name is printed right next to the avatar, as in a list row, set **`decorative`**: the
avatar is then hidden from screen readers, so they don't read the name twice. Its status is hidden
too, so if it has one, say it in the visible text beside it (_Ana Lima · Online_).

```blade example
<span>
    <x-plinth::avatar name="Rui Costa" size="sm" decorative />
    Rui Costa
</span>
```

## Status

A small dot at the bottom corner, in one of the badge's tones: success for online, warning for
away, danger for busy, neutral for offline. Always give it a `status-label` (_Online_): colour
alone doesn't say what it means, and the label joins the accessible name. Blade refuses a status
without a label, and Vue and React warn while you develop. The dot's ring takes the page colour; on a card, set
`--plinth-avatar-ring: var(--plinth-color-surface-raised)` on the card.

```blade example
<x-plinth::avatar name="Ana Lima" status="success" status-label="Online" />
<x-plinth::avatar name="Rui Costa" status="warning" status-label="Away" />
<x-plinth::avatar name="Ines Moreau" status="danger" status-label="Busy" />
<x-plinth::avatar name="Tom Hale" status="neutral" status-label="Offline" />
```

## Sizes

**sm** (24px) inline with text and in dense tables, **md** (32px, the default) in lists and on
comments, **lg** (40px) in headers and the account menu, **xl** (56px) on a profile.

```blade example
<x-plinth::avatar name="Ana Lima" size="sm" />
<x-plinth::avatar name="Ana Lima" />
<x-plinth::avatar name="Ana Lima" size="lg" />
<x-plinth::avatar name="Ana Lima" size="xl" />
```

## Shape

Round by default (`--plinth-radius-pill`). A brand that prefers squares changes that token, and
every avatar follows; see [branding your project](../docs/branding.md).

## Props

The same names in every layer. React takes the Vue props.

| Prop        | Blade                                      | Vue                     | React                  | Default       |
| ----------- | ------------------------------------------ | ----------------------- | ---------------------- | ------------- |
| name        | `name="Ana Lima"` or `:name="$user->name"` | `:name="user.name"`     | `name={user.name}`     | none          |
| src         | `:src="$user->photo_url"`                  | `:src="user.photoUrl"`  | `src={user.photoUrl}`  | none          |
| initials    | `initials="NW"`                            | `initials="NW"`         | `initials="NW"`        | from the name |
| size        | `size="lg"` (or a `Size` case)             | `size="lg"`             | `size="lg"`            | `md`          |
| status      | `status="success"` (or a `Tone` case)      | `status="success"`      | `status="success"`     | none          |
| statusLabel | `status-label="Online"`                    | `status-label="Online"` | `statusLabel="Online"` | none          |
| decorative  | `decorative`                               | `decorative`            | `decorative`           | off           |

Extra attributes reach the root `<span>`: in Blade through `$attributes`, in Vue by falling
through, and in React as props (`className`, added to Plinth's class, `id`, `data-*`, `aria-*` and
`ref`). Vue and React warn in the console, while you develop, about an avatar with no name that isn't
decorative, and about a status without its label.

```blade tab="Blade"
<x-plinth::avatar :name="$user->name" :src="$user->photo_url" status="success" status-label="Online" />

<x-plinth::avatar :name="$user->name" decorative /> {{ $user->name }}
```

```vue tab="Vue"
<PlinthAvatar :name="user.name" :src="user.photoUrl" size="lg" />
```

```tsx tab="React"
import { PlinthAvatar } from '@bdynamic/plinth/react';

<PlinthAvatar name={user.name} src={user.photoUrl} status="success" statusLabel="Online" />;
```

## Accessibility

- The root has `role="img"` and the name (with the status label after a comma) as its
  `aria-label`. The image inside has `alt=""`, and the initials and the dot are hidden.
- A decorative avatar has `aria-hidden="true"` and no role or label.
- A status always has its label, so it doesn't rely on colour.
- It is not focusable and has no touch target; to make it do something, put it in a button or a
  link.

The markup contract is at the top of
[`packages/css/src/components/avatar.css`](../../packages/css/src/components/avatar.css).
