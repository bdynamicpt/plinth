# Changesets

A pull request that changes what Plinth ships (tokens, CSS, Vue, Blade) adds a changeset:

```bash
npx changeset
```

Pick the package the change is in, the kind of bump (patch for a fix, minor for something new,
major for a breaking change) and write one line for the changelog, in the same plain words as a
commit. The four packages share one version, so whichever you pick, they all move together, and
the npm package `@bdynamic/plinth` and the Composer package `bdynamicpt/plinth` get that version.

Changes to Storybook, the tests, the docs or the tooling need no changeset. See
[ADR 4](../docs/adr/0004-one-version-released-with-changesets.md) for how a release is made.
