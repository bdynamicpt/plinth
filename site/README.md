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
- `app/Decisions`: reads the ADRs in `../docs/adr` for the home page.

Checks, also run by Turborepo with the rest of the repository: `composer lint` (Pint and
PHPStan at `level: max`), `composer test` (Pest at 100% coverage) and Stylelint on the CSS.
