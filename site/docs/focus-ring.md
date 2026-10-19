# Focus ring

Every focusable element shows the same ring when it is focused from the keyboard (WCAG 2.4.7),
links included. The Storybook test runner tabs through every story and fails if a focused element
doesn't show it.

## See it

Press Tab to move through these: Plinth's own buttons, and links in a sentence.

<!-- example: focus-ring -->

The ring sits on the edge of what is focused and follows its corners; a link in text gets one ring
per line when it wraps. Solid filled controls keep a small gap, so the ring doesn't merge with
their fill.

## The rule

Each component repeats these lines on its focusable elements. It is an outline, so forced-colours
mode keeps it, and it follows the element's border radius.

```css
/* Most focusable elements: the ring sits on the edge */
.plinth-thing:focus-visible {
    outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
    outline-offset: var(--plinth-focus-ring-offset);
}

/* Solid filled controls: a small gap, so the ring doesn't merge with the fill */
.plinth-button[data-variant='primary']:focus-visible {
    outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
    outline-offset: var(--plinth-focus-ring-offset-filled);
}

/* Full-width rows in a scrolling container: the ring inside the edge, so it isn't cut off */
.plinth-list-row:focus-visible {
    outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
    outline-offset: var(--plinth-focus-ring-offset-inset);
}
```

## Tokens

The colour stands out at least 3:1 against every surface, in both themes.

<!-- tokens: semantic color focus-ring -->

<!-- tokens: semantic focus-ring -->
