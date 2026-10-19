# Dark mode

Every semantic colour has a light and a dark value. Plinth follows the system by default, and a
page can force either theme.

## How a page picks its theme

| On an ancestor                 | Theme                   |
| ------------------------------ | ----------------------- |
| nothing                        | the system's preference |
| `data-theme="dark"` or `.dark` | dark                    |
| `data-theme="light"`           | light                   |

Put the attribute on `<html>` for the whole page, or on any element for one part of it: a
preview in the other theme, say. Plinth also sets `color-scheme` to match, so form controls,
scrollbars and `light-dark()` follow.

```html
<html lang="en" data-theme="dark"></html>
```

## A theme switch

Plinth ships no JavaScript, so a switch is the app's: store the choice, and set the attribute
before the page paints so it doesn't flash. This site does it in its layout's `<head>`:

```html
<script>
    try {
        const theme = localStorage.getItem('plinth-theme');
        if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
    } catch {}
</script>
```

The switch itself is an icon button with `aria-pressed`, which sets `data-theme` and stores it.
Without a stored choice, the page keeps following the system.

## Dark is designed first

Plinth's look is designed in dark and checked in light
([ADR 3](../../docs/adr/0003-visual-direction.md)): surfaces around oklch 0.17 to 0.20, never pure
black, borders that are the text colour at low opacity, and stronger shadows, since a soft one
vanishes on a dark surface. Storybook opens in dark, and every story is tested in both.

> [!IMPORTANT]
> When your brand overrides a colour, override it for dark too. See
> [Branding your project](branding.md#a-dark-value-for-every-colour).
