---
name: new-component
description: Adds a component to Plinth across every layer (CSS with its markup contract, Storybook story and docs, Blade component, Vue component, Pest, Vitest and parity tests) and checks it against the component rules. Use when asked to add, create or scaffold a Plinth component.
---

# A new Plinth component

A component is one markup contract printed by four things that must agree: the story's markup
function, the CSS that styles it, the Blade component and the Vue component. The rules are in
`AGENTS.md` and `CONTRIBUTING.md`; `badge` is the worked example in every layer.

## 1. Decide the contract first

Before writing code, settle and write down:

- the elements, native first (`<button>`, `<a href>`, `<input>`, `<dialog>`, `<details>`), and
  the ARIA pattern if there is one (WAI-ARIA Authoring Practices);
- the classes: `plinth-<name>` on the root, `plinth-<name>-<part>` on the parts;
- variants the author picks, as `data-*` attributes (`data-tone`, `data-size`), with a default
  that also applies when the attribute is missing;
- states, as ARIA attributes (`aria-expanded`, `aria-current`, `aria-invalid`), or `is-*` only
  when no ARIA attribute fits;
- which props Blade and Vue take, and what goes in the slot;
- any token that is missing. Add it to `packages/tokens/src/tokens.ts` first (light and dark).

## 2. Scaffold and wire up

```bash
node .claude/skills/new-component/scaffold.ts <name>   # kebab case
```

It writes a minimal component in every layer, all printing `<div class="plinth-<name>">…</div>`:

| File                                                         | Holds                                     |
| ------------------------------------------------------------ | ----------------------------------------- |
| `packages/css/src/components/<name>.css`                     | the contract comment and `@layer plinth`  |
| `storybook/stories/components/<name>.ts`                     | the markup function (the contract itself) |
| `storybook/stories/components/<Name>.stories.ts`             | the stories and the docs description      |
| `packages/blade/resources/views/components/<name>.blade.php` | `<x-plinth::<name>>`                      |
| `packages/blade/tests/Feature/<Name>Test.php`                | Pest tests                                |
| `packages/vue/src/Plinth<Name>.vue`                          | the Vue component                         |
| `packages/vue/test/Plinth<Name>.test.ts`                     | Vitest tests                              |

Then by hand:

- `packages/vue/src/index.ts`: export `Plinth<Name>` and register it in the `Plinth` plugin;
  add it to the "registers every component" test in `packages/vue/test/PlinthBadge.test.ts`.
- `storybook/test/parity.test.ts`: import the stories and the markup function, add a
  `storyArgs<<Name>Args>(…)` block mapping each story's args to Vue and Blade props, and add
  every story's name to the "has a case for every story" list.
- If Blade and Vue share a list of variants (as `tones` does), keep it in one place: Vue's in
  `packages/vue/src/`, Blade's in `packages/blade/src/Plinth.php`, the story importing Vue's.

## 3. Shape it into the real component

Change all four together so they keep printing the same markup:

- **Markup function** (`<name>.ts`): the contract as code. Escape every piece of text.
- **CSS:** the contract in the top comment, in the same shape as the badge's. Mobile first, the
  phone in the base rules, `@media (min-width: 768px)` and `(min-width: 1280px)` only adding.
  Tokens only, logical properties, touch targets at least `--plinth-size-touch`, transitions on
  `--plinth-duration-*`, a visible `:focus-visible`, and a `forced-colors` rule for any edge or
  dot that is only a colour.
- **Blade:** `@props` with defaults, `$attributes->merge(['class' => …])` on the root, fallback
  to the default for an unknown variant, `{{ }}` (escaped) output. No styles, and no element or
  attribute the story does not print.
- **Vue:** `withDefaults(defineProps<…>())`, the same defaults and fallback as Blade, the root
  as the single element so classes and attributes fall through. No `<style>`.
- **Stories:** one for every variant and state, each with args (the parity test covers stories
  without their own `render`); galleries such as `AllTones` may have a `render`. The
  `docs.description.component` says what it is, when to use it, and anything a user must add
  (an accessible name, `aria-controls`, …). Write an MDX page next to the story only when the
  docs need more than that.
- **Tests:** Blade and Vue each cover the full markup, defaults, every variant, the fallback,
  escaping and extra attributes.

No consumer project's names, colours or copy anywhere, story labels included.

## 4. Check

```bash
npm run format
npx turbo run lint test build build-storybook
```

That runs Stylelint, the Pest, Vitest and parity tests, and the Storybook test runner with axe
on every story in light and dark at 390, 768 and 1440 px. Commit the rebuilt
`packages/blade/resources/dist/plinth.css` with the change.

Then hand the component to the `component-reviewer` subagent (or read
`.claude/agents/component-reviewer.md` and go through its list yourself) and fix what it finds.

## 5. Open the pull request

From a branch off `main`. The body says in plain words what the component is and how its
contract was chosen, and includes screenshots of its stories at 390, 768 and 1440 px in light
and dark (`npm run storybook`, then the viewport and theme switches).
