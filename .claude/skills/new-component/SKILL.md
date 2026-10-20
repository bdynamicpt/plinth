---
name: new-component
description: Adds a component to Plinth across every layer (CSS with its markup contract, Storybook story and docs, Blade component, Vue component, React component, Pest, Vitest and parity tests) and checks it against the component rules. Use when asked to add, create or scaffold a Plinth component.
---

# A new Plinth component

A component is one markup contract printed by five things that must agree: the story's markup
function, the CSS that styles it, the Blade component, the Vue component and the React component
(docs/adr/0006). The rules are in
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
- which props Blade, Vue and React take (React has Vue's names), and what goes in the slot;
- any token that is missing. Add a semantic (or component) token in `packages/tokens/tokens/`
  first, built from primitives, in light and dark where it changes with the theme (see
  `docs/adr/0001`). Components never use primitives (`--plinth-ref-*`).

## 2. Scaffold and wire up

```bash
node .claude/skills/new-component/scaffold.ts <name>   # kebab case
```

It writes a minimal component in every layer, all printing `<div class="plinth-<name>">…</div>`:

| File                                                         | Holds                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `packages/css/src/components/<name>.css`                     | the contract comment and `@layer plinth`                                       |
| `storybook/stories/components/<name>.ts`                     | the markup function (the contract itself)                                      |
| `storybook/stories/components/<Name>.stories.ts`             | the stories, the docs description and the import of the component's source CSS |
| `storybook/stories/components/<Name>.mdx`                    | the docs page, in the shape of `Badge.mdx`                                     |
| `packages/blade/resources/views/components/<name>.blade.php` | `<x-plinth::<name>>`                                                           |
| `packages/blade/tests/Feature/<Name>Test.php`                | Pest tests                                                                     |
| `packages/vue/src/Plinth<Name>.vue`                          | the Vue component                                                              |
| `packages/vue/test/Plinth<Name>.test.ts`                     | Vitest tests                                                                   |
| `packages/react/src/Plinth<Name>.tsx`                        | the React component                                                            |
| `packages/react/test/Plinth<Name>.test.tsx`                  | Vitest and Testing Library tests                                               |

Then by hand:

- `packages/vue/src/index.ts`: export `Plinth<Name>` and register it in the `Plinth` plugin;
  add it to the plugin test in `packages/vue/test/index.test.ts`.
- `packages/react/src/index.ts`: export `Plinth<Name>` and its `Plinth<Name>Props` type.
- `storybook/test/parity.test.ts`: import the stories and the markup function, add a
  `storyArgs<<Name>Args>(…)` block mapping each story's args to Vue and Blade props, a case with
  extra attributes (like `badgeWithAttributes`: a class, an id, `data-*`, `aria-*`), a case with
  an attribute that clashes with one the root sets (the project's value wins), and every
  case's name to the "has a case for every story" list. Add the Vue and React components to
  `reactComponents`, so every case also renders the React component with the Vue props
  (attributes with `class` as `className`, the default slot as `children`, named slots as node
  props). See docs/adr/0002 on forwarding and docs/adr/0006 on React.
- A component's choices are a list in Vue (`packages/vue/src/`) and a backed enum in Blade
  (`packages/blade/src/Enums/`, using `ResolvesToDefault`, with a `default()` case), the story
  importing Vue's list; the Blade view resolves the prop with `Enum::resolve($prop)->value`, so a
  project can pass the enum or its string. **Sizes don't get their own enum:** use the shared
  `Size` (xs to xl, icons included) and pass the sizes the component supports,
  `Size::resolve($size, [Size::Small, …])`, with `sizes` and `resolveSize()` on the Vue side.
  Add new enums to the list check in `packages/blade/tests/Feature/EnumsTest.php`. React keeps
  the same list in `packages/react/src/` (it cannot import Vue's), checked against Vue's in
  `packages/react/test/lists.test.ts`. PHP classes are `final`.

## 3. Shape it into the real component

Change all five together so they keep printing the same markup:

- **Markup function** (`<name>.ts`): the contract as code. Escape every piece of text.
- **CSS:** the contract in the top comment, in the same shape as the badge's. Mobile first, the
  phone in the base rules, `@media (min-width: 768px)` and `(min-width: 1280px)` only adding.
  Tokens only, logical properties, touch targets at least `--plinth-touch-target`, transitions on
  `--plinth-duration-*`, the focus ring on every focusable element (`:focus-visible` with the
  `--plinth-focus-ring-*` tokens, see CONTRIBUTING), and a `forced-colors` rule for any edge or
  dot that is only a colour.
- **Blade:** `@props` with defaults, `$attributes->merge(['class' => …])` on the root, fallback
  to the default for an unknown variant, `{{ }}` (escaped) output. No styles, and no element or
  attribute the story does not print.
- **Vue:** `withDefaults(defineProps<…>())`, the same defaults and fallback as Blade, the root
  as the single element so classes and attributes fall through. No `<style>`.
- **React:** a function component typed as `ComponentProps<'<root element>'>` plus Vue's props,
  with the same defaults and fallback. Spread the remaining props onto the root after Plinth's
  own, so the project's win (`ref` included, React 19 needs no `forwardRef`), and merge
  `className` with `classNames()`. The default slot is `children`, a named slot is a prop that
  takes a node (`hasContent()` tells an empty one), and a Vue event is an `on…` callback. Nothing reads `window` or `document` while rendering;
  behaviour goes in an effect. No styles.
- **Stories:** one for every variant and state, each with args (the parity test covers stories
  without their own `render`); galleries such as `AllTones` may have a `render`. The
  `docs.description.component` says what it is, when to use it, and anything a user must add
  (an accessible name, `aria-controls`, …).
- **Docs page:** `<Name>.mdx` next to the story, in the shape of `Badge.mdx` (the scaffold writes
  its headings): the intro and a canvas with controls, then **`<AtEveryWidth of={…} />`** with
  the same story (the phone, tablet and desktop frames, in dark and light; pass `height` when
  the story opens a sheet or dialog, which takes no room in the page), **Markup contract** (the markup, a table
  of parts, a table of attributes and states with values and defaults), a section per variant or
  state with its canvas, **Accessibility**, and **In Blade, Vue and React** (a props table for
  all three, an example in each, what is forwarded where, the events Vue emits and React's
  callbacks). Every story appears in a canvas.
- **Tests:** Blade, Vue and React each cover the full markup, defaults, every variant, the
  fallback, escaping and extra attributes (React: the `ref` too), at 100% coverage.

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
