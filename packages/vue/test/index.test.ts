import { createApp } from 'vue';
import { describe, expect, it } from 'vitest';
import { Plinth, PlinthBadge, PlinthButton, PlinthIcon, PlinthIconButton } from '../src/index.ts';

describe('the Plinth plugin', () => {
  it('registers every component', () => {
    const app = createApp({});
    app.use(Plinth);

    expect(app.component('PlinthBadge')).toBe(PlinthBadge);
    expect(app.component('PlinthButton')).toBe(PlinthButton);
    expect(app.component('PlinthIcon')).toBe(PlinthIcon);
    expect(app.component('PlinthIconButton')).toBe(PlinthIconButton);
  });
});
