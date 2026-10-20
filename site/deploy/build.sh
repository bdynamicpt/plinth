#!/usr/bin/env bash
#
# Builds the site for a deploy: Laravel Cloud's build command (`bash deploy/build.sh`, run from
# site/), or Forge's deploy script after `cd site`. The whole repository is there during the build,
# but only site/ is deployed, so everything the site reads from outside it is copied in.

set -euo pipefail

site="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
root="$(dirname "$site")"

export TURBO_TELEMETRY_DISABLED=1 STORYBOOK_DISABLE_TELEMETRY=1

# The packages, Storybook and the site's CSS and JS, built by Turborepo from the repository root.
# `npm ci` also runs `composer install` in packages/blade and here (their postinstall).
cd "$root"
npm ci --no-audit --no-fund

# The Blade package comes from ../packages/blade as a copy (symlink: false), and `composer install`
# keeps the old copy while the lock file is unchanged. Refresh it before the build: the site's
# views use its components and the site's CSS bundles its plinth.css.
(cd "$site" && composer reinstall bdynamicpt/plinth --no-interaction --no-progress)

npx turbo run build build-storybook \
    --filter=@bdynamic/plinth-site... \
    --filter=@bdynamic/plinth-storybook

cd "$site"

# Storybook, served at /storybook.
rm -rf public/storybook
cp -R "$root/storybook/storybook-static" public/storybook

# The ADRs the home page lists (config/site.php reads them here when they are present).
rm -rf resources/decisions
mkdir -p resources/decisions
cp "$root"/docs/adr/[0-9][0-9][0-9][0-9]-*.md resources/decisions/

# The tokens the foundations pages list, and the pages kept elsewhere in the repository
# (config/docs.php reads them here when they are present).
cp "$root/packages/tokens/dist/tokens.json" resources/tokens.json
rm -rf resources/repository
mkdir -p resources/repository
cp "$root/CONTRIBUTING.md" resources/repository/

# The search index, served as public/search.json.
php artisan site:search-index

# PHP without the dev tools, then Laravel's caches (config, events, routes and views).
composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader
php artisan optimize
