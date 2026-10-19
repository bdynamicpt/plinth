import { useOf } from '@storybook/addon-docs/blocks';
import { siteUrl } from './site-link.ts';

/**
 * Points a component's docs page at its page on Plinth's website, which Storybook is served under
 * (/storybook): what the component is for, the playground, its props in each layer and its
 * accessibility notes are written there, once.
 */
export function SiteLink() {
  const { preparedMeta } = useOf('meta', ['meta']);
  const url = siteUrl(preparedMeta.title);
  if (!url) return null;
  return (
    <p>
      When to use it, the playground, the props in Blade, Vue and React, and the accessibility notes
      are on{' '}
      <a href={url} target="_top">
        its page on Plinth&rsquo;s website
      </a>
      .
    </p>
  );
}
