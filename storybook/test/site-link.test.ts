import { describe, expect, it } from 'vitest';
import { siteUrl } from '../blocks/site-link.ts';

describe('siteUrl', () => {
  it("links a component's stories to its page on the website", () => {
    expect(siteUrl('Components/Button')).toBe('/components/button');
    expect(siteUrl('Components/Icon button')).toBe('/components/icon-button');
    expect(siteUrl('Components/Data Table')).toBe('/components/data-table');
  });

  it('has no page for stories that are not a component', () => {
    expect(siteUrl('Foundations/Focus ring')).toBeNull();
  });
});
