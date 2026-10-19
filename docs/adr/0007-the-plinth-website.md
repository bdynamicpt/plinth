# 7. The Plinth website: a Laravel app in the repository, built with Plinth

- Status: accepted
- Date: 2026-10-19
- Issue: the website issues linked from this ADR's pull request

## Context

Plinth's documentation lives in Storybook: MDX guides, a docs page per component and the ADRs as
Markdown files. Storybook is the right workshop (every story, both themes, three widths, axe), but
it is not a website: it has no home page, no search across guides and no room for a marketing
voice (ADR 3 gives marketing pages the accent). Plinth needs a public site that explains what it
is, documents it, and shows it working.

The best proof that the components hold up is a real site built with them, and most of Plinth's
projects are Laravel apps, so the site should be one too.

## Decision

### 1. A Laravel app in `site/`, in this repository

The website is a Laravel app (the current release, PHP 8.4) in `site/`. It is Plinth's own site,
not a consumer project, so it lives next to the packages:

- It requires `bdynamicpt/plinth` through a Composer path repository (`../packages/blade`, copied
  rather than symlinked so the deployed directory stands alone) and so always shows the components
  as they are on `main`, not as they were at the last release.
- A pull request that changes a component changes its docs page in the same pull request, and CI
  builds the site, so a change that breaks a real page fails before it merges.
- It is not published: npm and Packagist never ship it.

The site follows the repository's rules: final PHP classes, Pint, PHPStan at `level: max`, Pest at
100% coverage, Conventional Commits with the scope `site`. Turborepo runs its `lint`, `test` and
`build` after the packages and Storybook.

### 2. Built from Plinth's components and tokens, nothing else

Pages use `<x-plinth::…>` components and Plinth's tokens. A pattern the site needs that other
projects would need too (a code block, a callout) becomes a Plinth component first, with every
layer, story and test. Only what is truly the site's own (the docs layout, the table of contents,
the marketing sections) is site CSS, and that CSS follows the component rules: tokens only, mobile
first, logical properties, `@layer`, no utilities in the markup.

Sample content on the site is neutral and made up (invoices, projects, a team). It never comes
from a consumer project.

### 3. Docs are Markdown files in the repository

- Guides (introduction, installation, Laravel and Filament, Vue, React, Tailwind, branding, dark
  mode, the token tiers, foundations, contributing, releases) are Markdown in `site/docs/`,
  rendered on the server with `league/commonmark` and highlighted on the server with Phiki. No
  JavaScript is needed to read a page.
- Each component has a page: what it is for, live examples (the real Blade components), the
  variants, the props in Blade, Vue and React, accessibility notes, and a link to its stories.
- The ADRs stay in `docs/adr/` and the site renders them, so they are written in one place.
- Search (⌘K) uses an index built at deploy time and a small Alpine component; no hosted search
  service.

The guides and component narrative move out of Storybook's MDX into the site. Storybook keeps the
stories, the controls, the "at every width" block and a short page per component that links to
the site, so nothing is written twice.

### 4. Storybook is published with the site

The static Storybook build is served at `/storybook` on the same domain, built in the same deploy.

### 5. Hosted on Laravel Cloud

Laravel Cloud deploys the app from `site/` as its root directory (sibling directories are available
during the build, so the packages build first), on every push to `main`. Pages are cached; the site
needs no database at first. Forge remains the fallback: the same layout deploys there with
`cd site` in the deploy script.

## Consequences

- Plinth gains a fifth workspace in CI and a PHP app to keep up to date.
- The MDX guides in Storybook are replaced by the site's pages once those exist; until then both
  are kept and the Storybook ones are not extended.
- Every component's definition of done gains a site page.
- Deploying needs a Laravel Cloud application connected to this repository, set up by the
  repository's owner.
