# Confirmation dialog

A [dialog](dialog.md) that asks a person to confirm an action before it happens: archiving
tickets, deleting a project, changing where the invoices go. It asks in one of three ways: a plain
yes or no, a phrase typed exactly, or the person's password.

## When not to use it

- For an action that is easy to undo: do it, and offer Undo in place. A question nobody reads
  before pressing the button protects nothing.
- For a form, details or settings: use a [dialog](dialog.md).
- For a warning the page can show in place: use a [callout](callout.md).

## The parts

The dialogs on this page stay closed until you press their button.

```blade example
<x-plinth::button variant="secondary" commandfor="example-archive" command="show-modal">Archive 3 tickets</x-plinth::button>
<x-plinth::confirm-dialog id="example-archive" title="Archive 3 tickets?" message="They leave the board and the search. You can bring them back from the archive." confirm-label="Archive" />
```

| Part                             | Element    | Required | What it is                                                                 |
| -------------------------------- | ---------- | -------- | -------------------------------------------------------------------------- |
| `.plinth-confirm-dialog`         | `<dialog>` | yes      | The root, with `.plinth-dialog`. Needs an `id`; your attributes land on it |
| `.plinth-confirm-dialog-form`    | `<form>`   | yes      | `method="dialog"`: holds the header, the body and the footer               |
| `.plinth-dialog-title`           | `<h2>`     | yes      | The question, and the dialog's accessible name                             |
| `.plinth-confirm-dialog-message` | `<p>`      | yes      | What happens, and the dialog's accessible description                      |
| `.plinth-confirm-dialog-field`   | `<div>`    | no       | The label and the field, for the type and password kinds                   |
| `.plinth-confirm-dialog-label`   | `<label>`  | no       | The field's label; for the type kind, the phrase in `<strong>`             |
| `.plinth-confirm-dialog-input`   | `<input>`  | no       | The text or password field                                                 |
| `.plinth-confirm-dialog-error`   | `<p>`      | no       | The app's error under the field, `role="alert"`                            |
| `.plinth-confirm-dialog-confirm` | `<button>` | yes      | The confirm button: `type="submit"`, `value="confirm"`, last in the footer |

The header, body and footer are the dialog's (`.plinth-dialog-header`, `-body`, `-footer`), and
the buttons are [buttons](button.md): Cancel is a secondary one with `command="close"`. The
title, message, field and error take the root's `id` with `-title`, `-message`, `-field` and
`-error`. Every layer needs a `title` and a `message`, and throws without one.

## Never dismissible

It is always an alert dialog (`role="alertdialog"`) with `closedby="closerequest"` and no close
button, so a stray tap on the backdrop leaves it open. It closes three ways:

- **Cancel** closes it without submitting anything, whatever is in the field. It has
  `value="cancel"`, so the dialog's `returnValue` is `"cancel"`.
- **Escape** acts as Cancel: the browser fires `cancel`, then `close`, with an empty
  `returnValue`.
- **The confirm button** submits the form, once the browser has checked the field. Enter in the
  field does the same, since it is the form's only submit button. The dialog closes with
  `returnValue` set to `"confirm"`.

When it opens, the browser focuses the first control: the field, or Cancel when there is none.
So the safe choice is where the focus starts.

The browser doesn't empty the field when the dialog closes. Call `reset()` on its form on `close`,
so the phrase is typed afresh the next time and a password doesn't stay in the page (the examples
under [Confirming](#confirming) do).

## Three kinds

**`kind`** says what it asks for. An unknown kind falls back to `simple`.

| Kind               | Asks for                                         | Use it for                                      |
| ------------------ | ------------------------------------------------ | ----------------------------------------------- |
| `simple` (default) | a yes: the question, the message and the buttons | an action that matters but can be undone        |
| `type`             | a phrase, typed exactly                          | an action that destroys something for good      |
| `password`         | the person's password, which your app checks     | a change to an account, its money or its access |

### Type to confirm

**`phrase`** is what the person types, such as the project's name; the type kind needs one. The
field has `required` and a `pattern` made from the phrase (its pattern characters escaped), so the
browser blocks the submit until the text matches exactly. Until then the form is `:invalid` and
the confirm button looks disabled, through CSS alone, with no script. It isn't disabled: pressing
it shows the browser's message and puts the focus in the field.

```blade example
<x-plinth::button variant="secondary" commandfor="example-delete" command="show-modal">Delete project</x-plinth::button>
<x-plinth::confirm-dialog id="example-delete" kind="type" phrase="harbour" tone="danger" title="Delete this project?" message="Its tickets, files and history go with it, and this cannot be undone." confirm-label="Delete project" />
```

The label reads "Type **harbour** to confirm". Write your own with **`field-label`**, with
`:phrase` where the phrase goes: `field-label="Escreva :phrase para confirmar"`. Keep `:phrase` in
it: the label is the only place that shows the phrase, and the browser's message doesn't.

### Password

A password field (`type="password"`, `name="password"`, `autocomplete="current-password"`,
`required`), so the browser's password manager can fill it in. **Plinth never checks the
password**: your app does, on the server. The field is required, so the confirm button looks
disabled until something is typed. While it checks, set **`busy`**, which makes the confirm
button busy; then close the dialog, or set **`error`**.

```blade example
<x-plinth::button variant="secondary" commandfor="example-billing" command="show-modal">Change billing email</x-plinth::button>
<x-plinth::confirm-dialog id="example-billing" kind="password" title="Change the billing email?" message="Invoices go to the new address from the next one. Enter your password to go on." confirm-label="Change email" />
```

The label is "Password"; set your own with `field-label`.

## Error and busy

**`error`** is a message under the field, in `--plinth-color-danger-text`. The field gets
`aria-invalid="true"`, a thick danger edge and `aria-describedby` pointing at the message, and
the message has `role="alert"`, so a screen reader announces it as it appears. A dialog with no
field shows no error. After a wrong password, put the focus back in the field.

**`busy`** is the confirm button's busy state (`aria-busy`, `aria-disabled` and a spinner): your
app is checking. Ignore another submit while it is busy.

```blade example
<x-plinth::button variant="secondary" commandfor="example-wrong" command="show-modal">Show the error</x-plinth::button>
<x-plinth::confirm-dialog id="example-wrong" kind="password" error="That password isn’t right. Try again." title="Change the billing email?" message="Invoices go to the new address from the next one. Enter your password to go on." confirm-label="Change email" />
```

## Tone

**`tone="danger"`** makes the confirm button the danger variant, for an action that destroys
something: deleting, removing someone, revoking access. `neutral` (the default) makes it the
primary button. Danger is for the action, not for the importance of the question.

## On a phone

As on the dialog, **`side-phone="bottom"`** makes it a bottom sheet below 768px; from 768px up it
is centred. The footer's buttons share its width on a phone. A field's text is 16px on a phone
(`--plinth-font-size-field`), so iOS doesn't zoom the page in when the field takes the focus, and
the field is 40px tall on a touch screen.

## Confirming

The confirm button submits the form, and the form's `submit` event bubbles to the dialog: listen
for it there, in every layer. It fires only for the confirm, after the browser has checked the
field; Cancel and Escape never submit. For the simple and type kinds, let the dialog close and do
the action. For the password kind, call `preventDefault()` so the dialog stays open while your
app checks, then call `close('confirm')` on the dialog, or set `error`.

**In Livewire,** put `wire:ignore.self` on the dialog, so a re-render doesn't drop its `open`
attribute, and always pass an `id`. Listen with Alpine, which doesn't prevent the submit unless
you ask it to. A Livewire component can set `busy` only once its request is back, so an Alpine
flag is what keeps a second Enter from submitting again while the password is checked:

```blade tab="Blade"
<x-plinth::button variant="secondary" commandfor="archive" command="show-modal">Archive</x-plinth::button>

<x-plinth::confirm-dialog id="archive" title="Archive 3 tickets?" message="…"
    confirm-label="Archive" wire:ignore.self x-on:submit="$wire.archive()" />

<x-plinth::confirm-dialog id="billing" kind="password" title="Change the billing email?"
    message="…" confirm-label="Change email" :error="$errors->first('password')"
    wire:ignore.self x-data="{ checking: false }"
    x-on:submit.prevent="if (checking) return; checking = true;
        $wire.changeEmail(new FormData($event.target).get('password'))
            .then((changed) => { checking = false; changed && $el.close('confirm') })"
    x-on:close="$el.querySelector('form').reset()" />

```

```vue tab="Vue"
<PlinthConfirmDialog
    ref="billing"
    id="billing"
    kind="password"
    title="Change the billing email?"
    message="…"
    confirm-label="Change email"
    :busy="checking"
    :error="error"
    @submit.prevent="check"
    @close="($event.target as HTMLDialogElement).querySelector('form')?.reset()"
/>

<script setup lang="ts">
const billing = ref();
const checking = ref(false);
const error = ref<string>();

async function check(event: SubmitEvent) {
    if (checking.value) return;
    checking.value = true;
    const changed = await changeEmail(
        new FormData(event.target as HTMLFormElement).get('password'),
    );
    checking.value = false;
    if (changed) billing.value.close('confirm');
    else error.value = 'That password isn’t right. Try again.';
}
</script>
```

```tsx tab="React"
import { useRef, useState } from 'react';
import { PlinthConfirmDialog } from '@bdynamic/plinth/react';

const billing = useRef<HTMLDialogElement>(null);
const [checking, setChecking] = useState(false);
const [error, setError] = useState<string>();

<PlinthConfirmDialog
    ref={billing}
    id="billing"
    kind="password"
    title="Change the billing email?"
    message="…"
    confirmLabel="Change email"
    busy={checking}
    error={error}
    onSubmit={async (event) => {
        event.preventDefault();
        if (checking) return;
        setChecking(true);
        const changed = await changeEmail(
            new FormData(event.target as HTMLFormElement).get('password'),
        );
        setChecking(false);
        if (changed) billing.current?.close('confirm');
        else setError('That password isn’t right. Try again.');
    }}
    onClose={() => billing.current?.querySelector('form')?.reset()}
/>;
```

Open it as any dialog: a button with `commandfor="<id>" command="show-modal"`, or `showModal()`.
In Vue, the component exposes **`showModal()`** and **`close(returnValue)`**, and emits
**`close`** whenever the dialog closes; a listener such as `@submit` falls through to the
dialog. In React, the **`ref`** is the `<dialog>` itself, and **`onSubmit`** and **`onClose`**
are its events.

## Props

The same names in every layer. It has no slots.

| Prop         | Blade                                         | Vue                      | React                   | Default   |
| ------------ | --------------------------------------------- | ------------------------ | ----------------------- | --------- |
| id           | `id="delete"`                                 | `id="delete"`            | `id="delete"`           | generated |
| title        | `title="Delete this project?"` (required)     | `title="…"`              | `title="…"`             | none      |
| message      | `message="…"` (required)                      | `message="…"`            | `message="…"`           | none      |
| kind         | `kind="type"` (or a `ConfirmDialogKind` case) | `kind="type"`            | `kind="type"`           | `simple`  |
| phrase       | `phrase="harbour"` (the type kind needs it)   | `phrase="harbour"`       | `phrase="harbour"`      | none      |
| fieldLabel   | `field-label="…"`                             | `field-label="…"`        | `fieldLabel="…"`        | by kind   |
| confirmLabel | `confirm-label="Delete"`                      | `confirm-label="Delete"` | `confirmLabel="Delete"` | `Confirm` |
| cancelLabel  | `cancel-label="Cancel"`                       | `cancel-label="Cancel"`  | `cancelLabel="Cancel"`  | `Cancel`  |
| tone         | `tone="danger"` (or a `ConfirmDialogTone`)    | `tone="danger"`          | `tone="danger"`         | `neutral` |
| error        | `:error="$errors->first('password')"`         | `:error="error"`         | `error={error}`         | none      |
| busy         | `:busy="true"`                                | `:busy="checking"`       | `busy={checking}`       | `false`   |
| sidePhone    | `side-phone="bottom"`                         | `side-phone="bottom"`    | `sidePhone="bottom"`    | `center`  |

Extra attributes reach the `<dialog>`, and a project's own `role` or `closedby` replaces
Plinth's. The labels are English by default: pass them in the page's language.

## Accessibility

- An `alertdialog`: the title names it and the message describes it, so assistive technology
  reads the question and what happens.
- A native modal dialog: focus is trapped inside, the page behind is inert, and focus returns to
  the button that opened it. It starts on the field, or on Cancel.
- Escape cancels it, so a keyboard user is never stuck; Cancel is there for a touch screen.
- The field has a visible label; an error is tied to it and announced when it appears, and its
  edge is thick, not only red.
- The confirm button that looks disabled keeps its contrast, and still explains itself when
  pressed.
- Every control keeps a 40 × 40px touch target, and motion drops to nothing under
  `prefers-reduced-motion`.

The markup contract is at the top of
[`packages/css/src/components/confirm-dialog.css`](../../packages/css/src/components/confirm-dialog.css).
