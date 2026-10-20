# React

The React 19 components print the same markup as the Blade and Vue ones, from the same CSS
([ADR 6](../../docs/adr/0006-a-react-layer.md)). They suit a React app, an Inertia one included, and every
component has one.

```bash
npm install @bdynamic/plinth
```

## Set it up

Load the fonts and the CSS once, then import the components where you use them:

```tsx label="src/main.tsx"
import '@bdynamic/plinth/fonts.css';
import '@bdynamic/plinth/css';
```

```tsx label="InvoiceActions.tsx"
import { PlinthButton } from '@bdynamic/plinth/react';

export function InvoiceActions({ onSave }: { onSave: () => void }) {
    return (
        <PlinthButton variant="secondary" onClick={onSave}>
            Save draft
        </PlinthButton>
    );
}
```

## How the components map to Vue's

The React components take Vue's props by the same names, so the docs for one serve both.

| Vue                                 | React                                         |
| ----------------------------------- | --------------------------------------------- |
| the default slot                    | `children`                                    |
| a named slot (`#icon`, `#trailing`) | a prop that takes a node (`icon`, `trailing`) |
| an event (`@close`)                 | a callback (`onClose`)                        |
| attributes falling through          | other props spread onto the root              |

- **Props reach the root.** `className` is merged with Plinth's classes; `id`, `data-*`,
  `aria-*`, event handlers and `ref` go to the documented root element.
- **No effects while rendering.** Nothing reads `window` or `document` during render, so the
  components render the same on the server, for Inertia's SSR, and in the browser.
- **Native behaviour.** A sheet is a `<dialog>`: open it with a button that has `commandfor` and
  `command="show-modal"`, or call `showModal()` on its `ref`, which is the dialog itself.
  `onClose` is the dialog's close event. React's types don't list `command` and `commandfor` yet
  ([#99](https://github.com/bdynamicpt/plinth/issues/99)):
  they work as they are, but TypeScript wants them spread in.

## Your brand

Override the semantic tokens in a stylesheet loaded after Plinth's. See
[Branding your project](branding.md).
