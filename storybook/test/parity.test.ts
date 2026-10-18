import { PlinthBadge } from '@bdynamic/plinth-vue';
import { h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import * as badgeStories from '../stories/components/Badge.stories.ts';
import { badge, type BadgeArgs } from '../stories/components/badge.ts';
import { normalize, renderBlade } from './markup.ts';

/**
 * Parity: for every story of a component, the Blade and the Vue output must match the story's
 * markup (ignoring whitespace and attribute order). If a layer drifts from the contract, this
 * fails. Stories with their own render (galleries such as AllTones) are not single cases.
 */
interface ParityCase {
  story: string;
  markup: string;
  vue: { component: Component; props: Record<string, unknown>; slot: string };
  blade: { component: string; props: Record<string, unknown>; slot: string };
}

function storyArgs<Args>(stories: Record<string, unknown>): [string, Args][] {
  const { default: meta, ...exports } = stories as {
    default: { args?: Partial<Args> };
  } & Record<string, { args?: Partial<Args>; render?: unknown }>;
  return Object.entries(exports)
    .filter(([, story]) => !story.render)
    .map(([name, story]) => [name, { ...meta.args, ...story.args } as Args]);
}

const cases: ParityCase[] = [
  ...storyArgs<BadgeArgs>(badgeStories).map(([story, args]) => ({
    story: `Badge/${story}`,
    markup: badge(args),
    vue: { component: PlinthBadge, props: { tone: args.tone, dot: args.dot }, slot: args.label },
    blade: { component: 'badge', props: { tone: args.tone, dot: args.dot }, slot: args.label },
  })),
];

describe('parity with the stories', () => {
  const blade = renderBlade(cases.map((c) => c.blade));

  it('has a case for every story', () => {
    expect(cases.map((c) => c.story)).toEqual([
      'Badge/Neutral',
      'Badge/Success',
      'Badge/Warning',
      'Badge/Danger',
      'Badge/WithDot',
    ]);
  });

  describe.each(cases.map((c, i) => [c.story, c, i] as const))('%s', (_story, c, i) => {
    it('Vue prints the story markup', async () => {
      const html = await renderToString(h(c.vue.component, c.vue.props, () => c.vue.slot));
      expect(normalize(html)).toBe(normalize(c.markup));
    });

    it('Blade prints the story markup', () => {
      expect(normalize(blade[i]!)).toBe(normalize(c.markup));
    });
  });
});

describe('normalize', () => {
  it('ignores whitespace, attribute order and comments', () => {
    expect(normalize('<span  b="2" a="1">\n  <!--x--> <i>hi  there</i>\n</span>')).toBe(
      normalize('<span a="1" b="2"><i>hi there</i></span>'),
    );
  });

  it('still tells different markup apart', () => {
    expect(normalize('<span class="a">x</span>')).not.toBe(normalize('<span class="b">x</span>'));
    expect(normalize('<span>x</span>')).not.toBe(normalize('<span><i></i>x</span>'));
  });
});
