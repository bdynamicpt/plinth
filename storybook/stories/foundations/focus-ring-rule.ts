/** The focus ring rule each component repeats, shown on the Focus ring page. */
export const focusRingRule = `/* Most focusable elements: the ring sits on the edge */
.plinth-thing:focus-visible {
  outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
  outline-offset: var(--plinth-focus-ring-offset);
}

/* Solid filled controls: a small gap, so the ring doesn't merge with the fill */
.plinth-button[data-variant='primary']:focus-visible {
  outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
  outline-offset: var(--plinth-focus-ring-offset-filled);
}`;
