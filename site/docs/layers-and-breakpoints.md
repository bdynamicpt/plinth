# Layers and breakpoints

## Layers

Stacking order. Components use these, never a raw `z-index` (Stylelint checks). Sheets and
dialogs opened with `showModal()` sit in the browser's top layer anyway
([ADR 2](../../docs/adr/0002-behaviour-state-and-forwarding.md)).

<!-- tokens: semantic layer -->

## Breakpoints

Mobile first: base rules are the phone, and these widths add to them. There are no `max-width`
queries.

<!-- tokens: semantic breakpoint -->

Custom properties can't be used in media queries, so CSS writes the values:

```css
.plinth-thing {
    /* the phone */
}

@media (min-width: 768px) {
    .plinth-thing {
        /* from a tablet up */
    }
}

@media (min-width: 1280px) {
    .plinth-thing {
        /* from a laptop up */
    }
}
```
