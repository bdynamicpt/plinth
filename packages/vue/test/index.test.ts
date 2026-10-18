import { createApp } from 'vue';
import { describe, expect, it } from 'vitest';
import {
  Plinth,
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthIcon,
  PlinthIconButton,
  PlinthListRow,
  PlinthPill,
  PlinthPillRow,
} from '../src/index.ts';

describe('the Plinth plugin', () => {
  it('registers every component', () => {
    const app = createApp({});
    app.use(Plinth);

    expect(app.component('PlinthAvatar')).toBe(PlinthAvatar);
    expect(app.component('PlinthBadge')).toBe(PlinthBadge);
    expect(app.component('PlinthButton')).toBe(PlinthButton);
    expect(app.component('PlinthIcon')).toBe(PlinthIcon);
    expect(app.component('PlinthIconButton')).toBe(PlinthIconButton);
    expect(app.component('PlinthListRow')).toBe(PlinthListRow);
    expect(app.component('PlinthPill')).toBe(PlinthPill);
    expect(app.component('PlinthPillRow')).toBe(PlinthPillRow);
  });
});
