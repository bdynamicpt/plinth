# Plinth

The design system of BDynamic's projects: design tokens, components as plain HTML and CSS, and
thin Blade and Vue layers that print the same markup, documented and tested in Storybook.

- **Tokens** are the source of truth: colour (light and dark), type, spacing, radii, layers,
  breakpoints and motion. They are written once and built to CSS custom properties, a JS/TS
  export and a Tailwind preset.
- **Components are plain HTML and CSS.** Each one has a markup contract (its elements, classes,
  states and ARIA) that every framework layer prints.
- **Blade and Vue layers** print that markup and hold no styles of their own.
- **Storybook** documents the plain HTML and tests it: accessibility, screenshots, and parity
  between the story, Blade and Vue.
- **Each project brings its brand through the tokens.** Plinth ships neutral defaults; a project
  overrides the custom properties and never forks a component.

## Layout

```
packages/
  tokens/     the tokens (src/tokens.ts); builds CSS custom properties, a JS/TS export, a Tailwind preset
  css/        one stylesheet per component, tokens only, mobile first; builds dist/plinth.css
  vue/        Vue 3 components that print the markup contract
  blade/      Composer package: Blade components, a Filament plugin, and the built CSS
storybook/    Storybook (HTML renderer): Branding, Foundations, component stories, parity tests
```

The npm workspaces are private. They are published together as one npm package and one Composer
package (nothing is published yet):

| Package             | Registry  | Holds                                                                                      |
| ------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `@bdynamic/plinth`  | npm       | `./tokens`, `./tokens.css`, `./css`, `./vue`, `./tailwind` and `./tailwind.css`            |
| `bdynamicpt/plinth` | Packagist | `<x-plinth::…>` Blade components, `PlinthPlugin` for Filament, `resources/dist/plinth.css` |

## Working on Plinth

You need Node 22 (see `.nvmrc`), PHP 8.4 and Composer. `npm ci` also runs `composer install` in
`packages/blade`.

```bash
npm ci
npx playwright install chromium   # once, for the Storybook test runner

npm run storybook                 # http://127.0.0.1:6006 (builds the tokens and CSS first)
npm run build-storybook           # static build in storybook/storybook-static
npx turbo run lint test build build-storybook   # everything CI runs
```

[Turborepo](https://turborepo.com) runs each task in the order the packages depend on each other
(`tokens` → `css` → `vue` and `blade` → `storybook`) and caches the results in `.turbo/`, so a
second run with nothing changed is served from the cache. On a small machine, add
`--concurrency=2`.

`turbo.json` passes the `MISE_*`, `__MISE_*` and `LERD_*` variables through to tasks. Turborepo
strips the environment by default, and without those variables lerd's `npm` shim (which runs npm
through mise) finds itself on the `PATH` again and starts copies of itself until the machine runs
out of memory.

What the tests cover:

- `packages/tokens`: Vitest. Every reference resolves, light and dark have the same names, text
  colours meet WCAG AA in both themes, and the CSS and Tailwind output are right.
- `packages/vue`: Vitest with Vue Test Utils.
- `packages/blade`: Pest with Testbench, including the Filament plugin (`composer test` there).
- `storybook`: Vitest **parity tests** render every story's markup, the Blade component and the
  Vue component, and compare them ignoring whitespace and attribute order. Then the Storybook
  test runner opens every story in light and dark at 390, 768 and 1440 px and checks it with axe.

### Screenshots

Screenshots depend on the fonts and renderer of the machine, so the baselines in
`storybook/__screenshots__/` are made in Playwright's container image, the same one CI uses. Run
the comparison with Podman or Docker (after `npm run build-storybook`):

```bash
npm run test:visual -w @bdynamic/plinth-storybook               # compare
npm run test:visual -w @bdynamic/plinth-storybook -- --update   # write new baselines
```

Locally, `npx turbo run test` skips the pixel comparison (it still renders and checks every
story); CI sets `PLINTH_VISUAL=1` and compares.

## Using Plinth from a project while you work on it

Link your local checkout instead of a published version. Build Plinth first
(`npx turbo run build`) and rebuild when you change it.

**Laravel**: add a Composer path repository to the project's `composer.json`:

```json
{
  "repositories": [
    { "type": "path", "url": "../plinth/packages/blade", "options": { "symlink": true } }
  ],
  "require": {
    "bdynamicpt/plinth": "@dev"
  }
}
```

Then `composer update bdynamicpt/plinth`. In a Filament panel, add the plugin and publish its
CSS:

```php
use BDynamic\Plinth\Filament\PlinthPlugin;

$panel->plugin(PlinthPlugin::make());
```

```bash
php artisan filament:assets
```

Outside Filament, publish the CSS with `php artisan vendor:publish --tag=plinth-assets` and link
`vendor/plinth/plinth.css`. Components are then available as `<x-plinth::badge>`.

**Vue**: point npm at the checkout with a `file:` link:

```json
{
  "dependencies": {
    "@bdynamic/plinth": "file:../plinth"
  }
}
```

```ts
import '@bdynamic/plinth/css';
import { PlinthBadge } from '@bdynamic/plinth/vue';
```

For Tailwind v4, `@import '@bdynamic/plinth/tailwind.css';` adds the tokens as theme values
(`bg-plinth-surface`, `p-plinth-4`, `rounded-plinth-md`); for a JS config, use the preset from
`@bdynamic/plinth/tailwind`.

**Your brand**: after Plinth's CSS, override the custom properties:

```css
:root {
  --plinth-palette-brand-600: #0f766e;
  --plinth-font-sans: 'Your Font', system-ui, sans-serif;
}
```

Dark mode follows the system, or `data-theme="dark"` / the `.dark` class on any ancestor;
`data-theme="light"` forces light.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules every component follows.

## Licence

[MIT](LICENSE)
