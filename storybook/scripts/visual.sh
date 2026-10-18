#!/bin/sh
# Runs the story tests with screenshot comparison inside Playwright's image, the same one CI
# uses, so the screenshots match whatever machine you are on. Needs Podman or Docker, and a
# built Storybook (npm run build-storybook).
#
#   npm run test:visual               compare against storybook/__screenshots__
#   npm run test:visual -- --update   write new baselines (review them before committing)
set -eu

cd "$(dirname "$0")/../.."
version=$(node -p "require('playwright/package.json').version")
engine=${CONTAINER_ENGINE:-$(command -v podman || command -v docker)}
update=""
[ "${1:-}" = "--update" ] && update="-u"

exec "$engine" run --rm --ipc=host \
  -v "$PWD:/work" -w /work/storybook \
  -e PLINTH_VISUAL=1 -e CI=1 \
  "mcr.microsoft.com/playwright:v$version-noble" \
  npx concurrently --kill-others --success first --names serve,test \
  "http-server storybook-static --port 6007 --silent" \
  "wait-on tcp:127.0.0.1:6007 && test-storybook --url http://127.0.0.1:6007 $update"
