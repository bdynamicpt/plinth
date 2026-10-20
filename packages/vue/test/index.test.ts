import { createApp } from 'vue';
import { describe, expect, it } from 'vitest';
import {
  Plinth,
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthCallout,
  PlinthCodeBlock,
  PlinthConfirmDialog,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
  PlinthDialog,
  PlinthDrawer,
  PlinthHeader,
  PlinthIcon,
  PlinthIconButton,
  PlinthListCard,
  PlinthListRow,
  PlinthMenuSheet,
  PlinthPill,
  PlinthPillRow,
  PlinthSectionMenu,
  PlinthSectionMenuItem,
  PlinthSheet,
} from '../src/index.ts';

describe('the Plinth plugin', () => {
  it('registers every component', () => {
    const app = createApp({});
    app.use(Plinth);

    expect(app.component('PlinthAvatar')).toBe(PlinthAvatar);
    expect(app.component('PlinthBadge')).toBe(PlinthBadge);
    expect(app.component('PlinthButton')).toBe(PlinthButton);
    expect(app.component('PlinthCallout')).toBe(PlinthCallout);
    expect(app.component('PlinthCodeBlock')).toBe(PlinthCodeBlock);
    expect(app.component('PlinthConfirmDialog')).toBe(PlinthConfirmDialog);
    expect(app.component('PlinthDataTable')).toBe(PlinthDataTable);
    expect(app.component('PlinthDataTableCell')).toBe(PlinthDataTableCell);
    expect(app.component('PlinthDataTableColumn')).toBe(PlinthDataTableColumn);
    expect(app.component('PlinthDataTableEmpty')).toBe(PlinthDataTableEmpty);
    expect(app.component('PlinthDataTableRow')).toBe(PlinthDataTableRow);
    expect(app.component('PlinthDataTableSort')).toBe(PlinthDataTableSort);
    expect(app.component('PlinthDialog')).toBe(PlinthDialog);
    expect(app.component('PlinthDrawer')).toBe(PlinthDrawer);
    expect(app.component('PlinthHeader')).toBe(PlinthHeader);
    expect(app.component('PlinthIcon')).toBe(PlinthIcon);
    expect(app.component('PlinthIconButton')).toBe(PlinthIconButton);
    expect(app.component('PlinthListCard')).toBe(PlinthListCard);
    expect(app.component('PlinthListRow')).toBe(PlinthListRow);
    expect(app.component('PlinthMenuSheet')).toBe(PlinthMenuSheet);
    expect(app.component('PlinthPill')).toBe(PlinthPill);
    expect(app.component('PlinthPillRow')).toBe(PlinthPillRow);
    expect(app.component('PlinthSectionMenu')).toBe(PlinthSectionMenu);
    expect(app.component('PlinthSectionMenuItem')).toBe(PlinthSectionMenuItem);
    expect(app.component('PlinthSheet')).toBe(PlinthSheet);
  });
});
