# 4. One version for npm and Packagist, released with Changesets

- Status: accepted
- Date: 2026-10-19
- Issue: [#5](https://github.com/bdynamicpt/plinth/issues/5)

## Context

Plinth is published twice: the npm package `@bdynamic/plinth` (tokens, CSS, the Tailwind theme
and the Vue components) and the Composer package `bdynamicpt/plinth` (the Blade components, the
Filament plugin and the built CSS). Both print the same markup contract and ship the same CSS,
so a project that uses Vue in one place and Blade in another must be able to ask for the same
version of each and get the same components.

The repository holds four private npm workspaces (`packages/tokens`, `css`, `vue`, `blade`),
and the root `package.json` is the npm package that bundles them. The Composer package has no
version field: Packagist takes the version from the git tag. Nothing has been released yet.

A project needs to know what changed between two versions, and whether an upgrade can break it,
without reading the commits.

## Decision

### One version, one tag

Plinth has a single version, in [semantic versioning][semver]. The npm package and the Composer
package always carry the same one, and one git tag, `v<version>`, marks it. There are no
per-layer versions: a fix in the Blade layer alone still moves both packages.

Before 1.0.0, a minor version may break things; the changelog says so under **Breaking
changes**. After 1.0.0 a break is a major version. A breaking change is renaming or removing a
token, a class, a part, a prop, a slot or an event, or changing the markup contract in a way
that a project's CSS or tests would notice.

### Changesets records what changed

A pull request that changes what Plinth ships adds a changeset (`npx changeset`): which package,
the bump (patch, minor or major) and one line for the changelog. Changes to Storybook, the
tests, the docs and the tooling don't need one.

The four workspaces are one `fixed` group in `.changeset/config.json`, so Changesets gives them
all the next version whichever one a changeset names. Changesets' per-package changelogs are
off; Plinth keeps one `CHANGELOG.md` at the root, for both registries.

### Releasing

1. `npm run release:version` on a branch: Changesets bumps the workspaces, and the script copies
   the version into the root `package.json` and the lockfile and adds the section to
   `CHANGELOG.md` (breaking changes, then new, then fixes). It goes to `main` in a pull request
   titled `chore: release <version>`, like any other change.
2. `npm run release` on `main` after it merges: it checks that every workspace and the root
   share the version and that `composer.json` has none, builds everything, tags `v<version>`
   and pushes the tag, and publishes the npm package. While the root `package.json` is private,
   it skips npm.

`npm run release -- --dry-run` does the checks and the build and prints what each registry would
get, without tagging or publishing. CI runs it on every pull request, so the versions can't
drift apart unnoticed.

The release is run by hand for now. The Changesets GitHub Action can open the version pull
request later, once the `ci` check runs on pull requests that a workflow opens (the default
token's pull requests don't start other workflows).

## Consequences

- One number answers "which Plinth are you on" for both stacks, and the changelog is the same
  for both.
- A Blade-only fix releases an npm version with no change for Vue projects. That is the price of
  one version, and a cheap one: the changelog says what moved.
- Contributors add a changeset to each pull request that changes the packages; reviewers check
  it is there and that its bump is right.
- Packagist reads `composer.json` at the repository root, and Plinth's is in `packages/blade/`.
  Until that is settled ([#56](https://github.com/bdynamicpt/plinth/issues/56)), the tags carry
  the version Packagist will use, but Packagist can't read the package.
- npm publishing waits for the `@bdynamic` scope; removing `"private": true` from the root
  `package.json` turns it on.

[semver]: https://semver.org
