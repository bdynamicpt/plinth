# Architecture decision records

Each file records one decision that shapes Plinth: the context, the decision and what follows
from it. They are numbered in the order they were made and never renumbered.

| ADR                                                            | Decision                                                                |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [1](0001-design-tokens-in-dtcg-built-with-style-dictionary.md) | Design tokens in DTCG JSON, built with Style Dictionary, in three tiers |
| [2](0002-behaviour-state-and-forwarding.md)                    | Behaviour through native elements, app-owned state, forwarding          |
| [3](0003-visual-direction.md)                                  | Visual direction: a dense, quiet look, dark first                       |
| [4](0004-one-version-released-with-changesets.md)              | One version for npm and Packagist, released with Changesets             |
| [5](0005-dialogs-sheets-and-drawers.md)                        | Dialogs, sheets and drawers: one base, named by what they are for       |

## Writing one

1. Copy [`template.md`](template.md) to `NNNN-short-title.md`, with the next number.
2. Write it in plain words and add it to the table above.
3. Open a pull request titled `docs(adr): record …`, linked to the issue it settles, with the
   status `accepted`: merging the pull request is what accepts it. Use `proposed` only for an
   ADR merged before the decision is made, to collect comments.

An accepted ADR is not rewritten when the decision changes. A new ADR replaces it, and the old
one's status becomes `superseded by [ADR M](…)`. Small corrections (a link, a typo, a detail that
was always meant) are fine in place.
