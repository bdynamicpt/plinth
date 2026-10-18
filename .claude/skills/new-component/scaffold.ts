import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Writes the starting files of a new Plinth component, one per layer, all printing the same
 * minimal markup: a root element with the content in it. Shape them into the real component
 * afterwards (see SKILL.md). Refuses to overwrite a file that exists.
 *
 *   node .claude/skills/new-component/scaffold.ts <name>   # kebab case, e.g. "text-field"
 */
const name = process.argv[2] ?? '';
if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error('Usage: node .claude/skills/new-component/scaffold.ts <name> (kebab case)');
  process.exit(1);
}

const root = new URL('../../../', import.meta.url);
const Name = name.replace(/(^|-)([a-z0-9])/g, (_, _dash, char: string) => char.toUpperCase());
const camel = Name[0]!.toLowerCase() + Name.slice(1);
const title = Name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

const files: Record<string, string> = {
  [`packages/css/src/components/${name}.css`]: `/*
 * ${title}: TODO one line on what it is.
 *
 * <div class="plinth-${name}">Content</div>
 *
 * TODO every element, class, data-* variant, state and ARIA attribute, and what a user must add.
 */

@layer plinth {
  .plinth-${name} {
    padding: var(--plinth-space-2);
    font-family: var(--plinth-font-sans);
    font-size: var(--plinth-font-size-sm);
    color: var(--plinth-color-text);
  }
}
`,

  [`storybook/stories/components/${name}.ts`]: `export interface ${Name}Args {
  label: string;
}

const escape = (text: string) => text.replace(/[&<>"']/g, (char) => \`&#\${char.charCodeAt(0)};\`);

/** The ${title.toLowerCase()}'s markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function ${camel}({ label }: ${Name}Args): string {
  return \`<div class="plinth-${name}">\${escape(label)}</div>\`;
}
`,

  [`storybook/stories/components/${Name}.stories.ts`]: `import type { Meta, StoryObj } from '@storybook/html-vite';
import { ${camel}, type ${Name}Args } from './${name}.ts';

const meta = {
  title: 'Components/${title}',
  render: ${camel},
  args: { label: 'Content' },
  parameters: {
    docs: {
      description: {
        component: 'TODO what it is, when to use it, and what a user must know.',
      },
    },
  },
} satisfies Meta<${Name}Args>;

export default meta;
type Story = StoryObj<${Name}Args>;

export const Default: Story = {};
`,

  [`packages/blade/resources/views/components/${name}.blade.php`]: `{{-- Markup contract: packages/css/src/components/${name}.css --}}
<div {{ $attributes->merge(['class' => 'plinth-${name}']) }}>{{ $slot }}</div>
`,

  [`packages/blade/tests/Feature/${Name}Test.php`]: `<?php

use Illuminate\\Support\\Facades\\Blade;

it('prints the ${title.toLowerCase()} markup contract', function () {
    expect(squish(Blade::render('<x-plinth::${name}>Content</x-plinth::${name}>')))
        ->toBe('<div class="plinth-${name}">Content</div>');
});

it('escapes the content', function () {
    expect(Blade::render('<x-plinth::${name}>{{ $label }}</x-plinth::${name}>', ['label' => '<b>x</b>']))
        ->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('keeps extra classes and attributes', function () {
    $html = Blade::render('<x-plinth::${name} class="ms-2" id="extra">Content</x-plinth::${name}>');

    expect($html)
        ->toContain('class="plinth-${name} ms-2"')
        ->toContain('id="extra"');
});
`,

  [`packages/vue/src/Plinth${Name}.vue`]: `<script setup lang="ts">
// Markup contract: packages/css/src/components/${name}.css
</script>

<template>
  <div class="plinth-${name}"><slot /></div>
</template>
`,

  [`packages/vue/test/Plinth${Name}.test.ts`]: `import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Plinth${Name} } from '../src/index.ts';

describe('Plinth${Name}', () => {
  it('prints the ${title.toLowerCase()} markup contract', () => {
    const wrapper = mount(Plinth${Name}, { slots: { default: 'Content' } });

    expect(wrapper.html()).toBe('<div class="plinth-${name}">Content</div>');
  });

  it('escapes the content', () => {
    const wrapper = mount(Plinth${Name}, { slots: { default: () => '<b>x</b>' } });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('keeps extra classes and attributes', () => {
    const wrapper = mount(Plinth${Name}, { attrs: { class: 'ms-2', id: 'extra' } });

    expect(wrapper.classes()).toEqual(['plinth-${name}', 'ms-2']);
    expect(wrapper.attributes('id')).toBe('extra');
  });
});
`,
};

const existing = Object.keys(files).filter((path) => existsSync(new URL(path, root)));
if (existing.length > 0) {
  console.error(`These exist already, so nothing was written:\n  ${existing.join('\n  ')}`);
  process.exit(1);
}

for (const [path, content] of Object.entries(files)) {
  const url = new URL(path, root);
  mkdirSync(dirname(fileURLToPath(url)), { recursive: true });
  writeFileSync(url, content);
  console.log(`wrote ${path}`);
}

console.log(`
Still to do by hand (SKILL.md, step 2):
  packages/vue/src/index.ts           export Plinth${Name} and register it in the plugin
  packages/vue/test/PlinthBadge.test.ts  the plugin test checks Plinth${Name} too
  storybook/test/parity.test.ts       a case for every ${Name} story, and its name in the list`);
