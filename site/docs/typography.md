# Typography

Geist and Geist Mono by default, self-hosted: load `@bdynamic/plinth/fonts.css`, or let the
Composer package and the Filament plugin bring them. A project sets its own typefaces by
overriding `--plinth-font-family-body` and `--plinth-font-family-mono`.

## Families

Use the sans for interface text and the mono for metadata: handles, hashes, times, counts and key
hints.

<!-- tokens: semantic font family -->

## Scale

UI text is 14 px (`md`), with 13 and 12 px below it, and reading text is 15 px (`lg`). Larger sizes
are for headings.

<!-- tokens: semantic font size -->

> [!NOTE]
> `5xl` and `6xl` are display sizes for marketing pages only
> ([ADR 3](../../docs/adr/0003-visual-direction.md#2-dense-small-ui-text)): inside an app the
> scale stops at `4xl` (36 px). Pair them with the `display` line height and the `tighter`
> letter spacing, and step them down on smaller screens: `4xl` on a phone, `5xl` from 768 px,
> `6xl` from 1280 px.

## Weights

Headings use semibold; body text uses regular.

<!-- tokens: semantic font weight -->

## Line heights

<!-- tokens: semantic font leading -->

## Letter spacing

Tight for headings, tighter for large display type; body text stays normal.

<!-- tokens: semantic font tracking -->

## Built from

<!-- tokens: primitive ref font -->
