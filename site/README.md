# Plinth's website

The Laravel app that is Plinth's public site, built only from Plinth's own components and tokens
([ADR 7](../docs/adr/0007-the-plinth-website.md)). It is not published to npm or Packagist.

It requires `bdynamicpt/plinth` from `../packages/blade` through a Composer path repository,
copied rather than symlinked, so it always shows the components as they are in this repository.
After changing a component, refresh the copy with `composer reinstall bdynamicpt/plinth`.

```bash
npm ci                    # at the repository root; also runs composer install here
cp .env.example .env && php artisan key:generate
npm run build             # or `npm run dev` while working on the CSS and JS
php artisan serve         # http://127.0.0.1:8000
```

The site has no database, sessions or cookies: pages are rendered from files and can be cached.

- `resources/views`: the layout (`components/layouts/site`), the header and footer
  (`components/site`) and the pages. Pages use `<x-plinth::…>` wherever Plinth has a component.
- `resources/css`: Plinth's CSS and fonts, then the site's own CSS, which follows the component
  rules (tokens only, mobile first, logical properties, in a layer) with `site-*` classes.
- `resources/js/site.js`: Alpine for the theme switch, the copy buttons and the header over the
  hero. The pages work without it.
- `resources/snippets`: the code examples the pages show. A test checks that the HTML example is
  what the Blade example prints.
- `docs`: the guides, in Markdown that also reads well on GitHub. `config/docs.php` lists them
  by section, in the sidebar's order; `CONTRIBUTING.md` at the root is rendered as the component
  rules page, so it is written once.
- `app/Docs`: renders the Markdown on the server with `league/commonmark` (GitHub Flavored
  Markdown) and Phiki. Code is Plinth's code block, highlighted with a theme
  (`resources/highlight/plinth.json`) whose colours are Plinth's tokens; `> [!NOTE]` and the other
  GitHub alerts are Plinth's callout; tables are Plinth's data table, so they stack into cards on
  a phone. Links between files (`colour.md`, `../../docs/adr/0003-visual-direction.md`) become
  the site's pages, and any other file in the repository its page on GitHub. Pages are cached by
  their Markdown and by the files that render them.
- `app/Decisions`: reads the ADRs in `../docs/adr` for the home page and the decisions pages.

### Writing a guide

Add a Markdown file to `docs/` and its slug to `config/docs.php`. The first `#` heading is the
page's title and the paragraph after it its lead; each `##` heading is in the table of contents.
Beyond GitHub Flavored Markdown:

````markdown
```css label="resources/css/brand.css"
:root { … }
```

```blade tab="Blade"
<x-plinth::badge tone="success">Paid</x-plinth::badge>
```

```vue tab="Vue"
<PlinthBadge tone="success">Paid</PlinthBadge>
```

> [!WARNING]
> Override semantic tokens, never primitives.

<!-- tokens: semantic color -->
<!-- example: brand -->
````

- `label="…"` names a code block (a file name, say); without it, the language does.
- Code blocks in a row with a `tab="…"` each become one block with tabs.
- `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` and `[!CAUTION]` are callouts.
- `<!-- tokens: tier path… -->` prints a table of tokens from the tokens build (the tier, then the
  start of the token's path), and `<!-- example: name -->` a live example from
  `resources/views/docs/examples/name.blade.php`. GitHub hides both.

Checks, also run by Turborepo with the rest of the repository: `composer lint` (Pint and
PHPStan at `level: max`), `composer test` (Pest at 100% coverage) and Stylelint on the CSS.

## Deploying

The site deploys on [Laravel Cloud](https://cloud.laravel.com) on every push to `main`, with
Storybook's static build at `/storybook` on the same domain
([ADR 7](../docs/adr/0007-the-plinth-website.md), section 5). One script does the build, so Cloud
and the Forge fallback build the same way:
[`deploy/build.sh`](deploy/build.sh). From `site/`, it:

1. runs `npm ci` and Turborepo at the repository root, building the packages, Storybook and the
   site's CSS and JS;
2. copies Storybook into `public/storybook`, the ADRs into `resources/decisions`, the tokens
   build into `resources/tokens.json` and `CONTRIBUTING.md` into `resources/repository`, since
   only `site/` is deployed and the docs read them;
3. runs `composer install --no-dev` and `php artisan optimize` (config, events, routes and views
   cached).

To try it locally, run it in a fresh clone: it swaps `vendor/` for one without the dev tools.

### Laravel Cloud

Set up once by the repository's owner:

- **Application:** created from the GitHub repository `bdynamicpt/plinth`, with `site` as its root
  directory (Cloud lists the top-level directories of a monorepo). The rest of the repository is
  there during the build; only `site/` ships.
- **Environment:** `production`, on the branch `main`, with push to deploy on. PHP 8.4 and Node 22
  or later. No database, cache or other resources: the site has none.
- **Build commands:** `bash deploy/build.sh`
- **Deploy commands:** none (there is nothing to migrate).
- **Environment variables:**

    | Variable              | Value                                                 |
    | --------------------- | ----------------------------------------------------- |
    | `APP_NAME`            | `Plinth`                                              |
    | `APP_ENV`             | `production`                                          |
    | `APP_DEBUG`           | `false`                                               |
    | `APP_KEY`             | generated by Cloud                                    |
    | `APP_URL`             | the site's address, such as `https://plinth.example`  |
    | `CACHE_STORE`         | `file`                                                |
    | `SITE_DECISIONS_PATH` | not set; only to read the ADRs from somewhere else    |
    | `SITE_TOKENS_PATH`    | not set; only to read tokens.json from somewhere else |

    Cloud adds its own logging variables. The site sets no cookies and starts no sessions, so it
    needs no session or database settings.

- **Domain:** the environment's free `laravel.cloud` address until a custom domain is attached
  under the environment's domains, where Cloud gives the DNS records and issues the certificate.
  Update `APP_URL` and redeploy when it changes.

### Forge, the fallback

The same layout deploys on Forge: point the site's web directory at `/site/public`, keep its
`.env` in `site/`, and use this deploy script:

```bash
cd $FORGE_SITE_PATH
git pull origin $FORGE_SITE_BRANCH
cd site
bash deploy/build.sh
$FORGE_PHP_FPM reload
```

The server needs PHP 8.4, Composer and Node 22.18 or later.
