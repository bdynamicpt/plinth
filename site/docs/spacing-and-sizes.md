# Spacing and sizes

A 4 px grid for space, three control heights, and a touch target that never drops below 40 px.

## Spacing

The key is the number of 4 px steps, so `--plinth-space-4` is 1 rem (16 px). Components use these
for padding, gaps and margins, never raw lengths.

<!-- tokens: semantic space -->

## Controls

Heights for buttons, inputs and other controls: 28, 32 (the default) and 40 px.

<!-- tokens: semantic control -->

## Touch target

The smallest touch target any component may have: 40 × 40 px. A small control keeps it on a
touch screen (`pointer: coarse`) through an invisible extension, so it can look small and still
be easy to tap.

<!-- tokens: semantic touch-target -->

## Icons, avatars and panels

<!-- tokens: semantic size -->

## Built from

<!-- tokens: primitive ref space -->

<!-- tokens: primitive ref size -->
