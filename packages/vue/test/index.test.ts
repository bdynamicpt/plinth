import { createApp } from 'vue';
import { describe, expect, it } from 'vitest';
import { Plinth, PlinthBadge, PlinthIcon } from '../src/index.ts';

describe('the Plinth plugin', () => {
  it('registers every component', () => {
    const app = createApp({});
    app.use(Plinth);

    expect(app.component('PlinthBadge')).toBe(PlinthBadge);
    expect(app.component('PlinthIcon')).toBe(PlinthIcon);
  });
});
