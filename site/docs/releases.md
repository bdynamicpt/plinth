# Releases

Plinth has one version for npm and Packagist, and one tag for it, so a project that uses Blade in
one place and Vue or React in another asks for the same version of each and gets the same
components ([ADR 4](../../docs/adr/0004-one-version-released-with-changesets.md)).

## Versions

Plinth follows [semantic versioning](https://semver.org). The npm package `@bdynamic/plinth` and
the Composer package `bdynamicpt/plinth` always carry the same version, and the git tag
`v<version>` marks it. A fix in one layer still moves both packages; the changelog says what
moved.

A breaking change is renaming or removing a token, a class, a part, a prop, a slot or an event, or
changing a markup contract in a way a project's CSS or tests would notice. Before 1.0.0 a minor
version may break things, and the changelog says so under **Breaking changes**; from 1.0.0 a
break is a major version.

## What changed

`CHANGELOG.md` at the root of the repository lists every release: breaking changes first, then
what's new, then fixes. It is the same for both registries.

## Adding a changeset

A pull request that changes what Plinth ships (tokens, CSS, Vue, React or Blade) adds a
changeset: which package, the bump, and one line for the changelog. The packages are one fixed
group, so whichever you pick, they all move together.

```bash
npx changeset
```

Pick a patch for a fix, a minor for something new and a major for a breaking change, and write
the line in the same plain words as a commit. Changes to Storybook, the tests, the docs, this site
or the tooling need no changeset.

## Making a release

```bash
npm run release:version          # on a branch: the next version, in every package and the changelog
npm run release -- --dry-run     # what npm and Packagist would get, without tagging or publishing
npm run release                  # on main, after the version pull request merges: tag and publish
```

The version goes to `main` in a pull request titled `chore: release <version>`, like any other
change. CI runs the dry run on every pull request, so the versions can't drift apart unnoticed.
