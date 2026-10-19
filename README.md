# Plinth

The design system of BDynamic's projects: design tokens, components as plain HTML and CSS, and
thin Blade, Vue and React layers that print the same markup, documented and tested in Storybook.

- **Tokens** are the source of truth: colour (light and dark), type, spacing, radii, layers,
  breakpoints and motion. They are written once and built to CSS custom properties, a JS/TS
  export and a Tailwind v4 theme file.
- **Components are plain HTML and CSS.** Each one has a markup contract (its elements, classes,
  states and ARIA) that every framework layer prints.
- **Blade, Vue and React layers** print that markup and hold no styles of their own.
- **Storybook** documents the plain HTML and tests it: accessibility and parity
  between the story, Blade, Vue and React.
- **Each project brings its brand through the tokens.** Plinth ships neutral defaults; a project
  overrides the custom properties and never forks a component.

## Layout

```
packages/
  tokens/     the tokens in DTCG JSON (tokens/*.json), built with Style Dictionary to CSS custom
              properties, a JS/TS export and a Tailwind theme
  css/        one stylesheet per component, tokens only, mobile first; builds dist/plinth.css
  vue/        Vue 3 components that print the markup contract
  react/      React 19 components that print the same markup contract
  blade/      Composer package: Blade components, a Filament plugin, and the built CSS
storybook/    Storybook (HTML renderer): Branding, Foundations, component stories, parity tests
```

The npm workspaces are private. They are published together as one npm package and one Composer
package (nothing is published yet):

| Package             | Registry  | Holds                                                                                      |
| ------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `@bdynamic/plinth`  | npm       | `./tokens`, `./tokens.css`, `./css`, `./vue`, `./react` and `./tailwind.css`               |
| `bdynamicpt/plinth` | Packagist | `<x-plinth::…>` Blade components, `PlinthPlugin` for Filament, `resources/dist/plinth.css` |

## Working on Plinth

You need Node 22 (see `.nvmrc`), PHP 8.4 and Composer. `npm ci` also runs `composer install` in
`packages/blade`.

```bash
npm ci
npx playwright install chromium   # once, for the Storybook test runner

npm run storybook                 # http://127.0.0.1:6006 (builds the tokens and CSS first)
npm run build-storybook           # static build in storybook/storybook-static
npm run check                     # everything CI runs (turbo run lint test build build-storybook)
```

[Turborepo](https://turborepo.com) runs each task in the order the packages depend on each other
(`tokens` → `css` → `vue`, `react` and `blade` → `storybook`) and caches the results in `.turbo/`, so a
second run with nothing changed is served from the cache. On a small machine, add
`--concurrency=2`.

`turbo.json` passes the `MISE_*`, `__MISE_*` and `LERD_*` variables through to tasks. Turborepo
strips the environment by default, and without those variables lerd's `npm` shim (which runs npm
through mise) finds itself on the `PATH` again and starts copies of itself until the machine runs
out of memory.

What the tests cover:

- `packages/tokens`: Vitest on the build output. The three tiers are there, semantic colours are
  built from primitives in both themes, text colours meet WCAG AA, and the CSS and Tailwind output
  are right (Tailwind itself compiles the theme).
- `packages/vue`: Vitest with Vue Test Utils.
- `packages/react`: Vitest with Testing Library.
- `packages/blade`: Pest with Testbench, including the Filament plugin (`composer test` there).
- `storybook`: Vitest **parity tests** render every story's markup, the Blade component, the
  Vue component and the React one, and compare them ignoring whitespace and attribute order. Then the Storybook
  test runner opens every story in light and dark at 390, 768 and 1440 px and checks it with axe.

Screenshot comparison is paused until the foundations settle
([#9](https://github.com/bdynamicpt/plinth/issues/9)).

## Tokens

The tokens are in `packages/tokens/tokens/`, in three tiers ([ADR 1](docs/adr/0001-design-tokens-in-dtcg-built-with-style-dictionary.md)):

| Tier      | File                                                 | Custom properties               | Used by                             |
| --------- | ---------------------------------------------------- | ------------------------------- | ----------------------------------- |
| Primitive | `primitives.json`                                    | `--plinth-ref-color-neutral-50` | semantic tokens only                |
| Semantic  | `semantic.json`, `semantic.light.json`, `.dark.json` | `--plinth-color-surface`        | components; projects override these |
| Component | `component.json`                                     | `--plinth-header-height`        | one component                       |

Storybook has a page for each under **Foundations** (colour, typography, spacing, sizes, radii, elevation, layers, breakpoints, motion, the focus ring and component tokens), each showing the semantic tokens and the primitives they are built from.

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

Outside Filament, publish the CSS and fonts with `php artisan vendor:publish --tag=plinth-assets`
and link `vendor/plinth/fonts/index.css` and `vendor/plinth/plinth.css`. The Filament plugin
registers both itself. Components are then available as `<x-plinth::badge>`.

**Vue**: point npm at the checkout with a `file:` link:

```json
{
  "dependencies": {
    "@bdynamic/plinth": "file:../plinth"
  }
}
```

```ts
import '@bdynamic/plinth/fonts.css'; // Geist and Geist Mono, the default typefaces
import '@bdynamic/plinth/css';
import { PlinthBadge } from '@bdynamic/plinth/vue';
```

**React** (an Inertia React app, or any React 19 app): the same `file:` link, then

```tsx
import '@bdynamic/plinth/fonts.css';
import '@bdynamic/plinth/css';
import { PlinthButton } from '@bdynamic/plinth/react';

<PlinthButton variant="secondary" onClick={save}>
  Save
</PlinthButton>;
```

The React components take the Vue props by the same names. Vue's default slot is `children`, and
its named slots are props that take a node (`icon`, `trailing`). Everything else, `className`
and `ref` included, reaches the root element. They render the same on the server (Inertia's SSR)
and in the browser.

**Tailwind v4**: Plinth's CSS is in `@layer plinth`. Place that layer after Tailwind's reset and
before its utilities, so a utility class can adjust a component without `!important`. Then import
the theme file, so page code gets the tokens as utilities (`bg-surface`, `text-text-muted`, `p-4`,
`rounded-md`):

```css
@layer theme, base, plinth, components, utilities;
@import 'tailwindcss';
@import '@bdynamic/plinth/css';
@import '@bdynamic/plinth/tailwind.css';
```

**Your brand**: override the **semantic** tokens after Plinth's CSS, outside any layer (Plinth's
own are inside `@layer plinth`, so yours win). Storybook's example brand,
[`storybook/brands/example.css`](storybook/brands/example.css), is a complete example; switch to
it with **Brand** in the toolbar.

```css
:root {
  --plinth-color-accent: #0f766e;
  --plinth-color-accent-hover: #115e59; /* override these two with accent */
  --plinth-color-accent-active: #134e4a;
  --plinth-radius-pill: 0.25rem;
  --plinth-font-family-body: 'Your Font', system-ui, sans-serif;
}
[data-theme='dark'] {
  --plinth-color-accent: #14b8a6;
}
```

Dark mode follows the system, or `data-theme="dark"` / the `.dark` class on any ancestor;
`data-theme="light"` forces light.

## Releases

Plinth has one version for npm and Packagist, and one tag, `v<version>`
([ADR 4](docs/adr/0004-one-version-released-with-changesets.md)). What changed is in
`CHANGELOG.md` (from the first release on), written by [Changesets](https://github.com/changesets/changesets):

```bash
npx changeset                    # in a pull request that changes a package: the bump and a line for the changelog
npm run release:version          # on a branch: the next version, in every package and the changelog
npm run release -- --dry-run     # what npm and Packagist would get, without tagging or publishing
npm run release                  # on main, after the version pull request merges: tag and publish
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules every component follows.

## Licence

[MIT](LICENSE)
