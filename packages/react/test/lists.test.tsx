import { describe, expect, it } from 'vitest';
import * as vueAvatar from '../../vue/src/avatar.ts';
import * as vueCallout from '../../vue/src/callout.ts';
import * as vueDataTable from '../../vue/src/data-table.ts';
import * as vueDialog from '../../vue/src/dialog.ts';
import * as vueHeading from '../../vue/src/heading.ts';
import * as vueListRow from '../../vue/src/list-row.ts';
import * as vueSheet from '../../vue/src/sheet.ts';
import * as vueButton from '../../vue/src/button.ts';
import * as vueIcon from '../../vue/src/icon.ts';
import * as vueSize from '../../vue/src/size.ts';
import * as vueTones from '../../vue/src/tones.ts';
import { buttonVariant } from '../src/button.ts';
import { classNames, hasContent } from '../src/markup.ts';
import {
  avatarGlyph,
  avatarSizes,
  buttonVariants,
  calloutIcons,
  calloutRole,
  calloutRoles,
  calloutTone,
  calloutTones,
  controlSizes,
  dataTableCellKind,
  dataTableCellKinds,
  dataTableSort,
  dataTableSortIcon,
  dataTableSorts,
  dialogCloseIcon,
  dialogSidePhone,
  dialogSidePhones,
  headingLevel,
  headingLevels,
  iconSizeFor,
  iconSizes,
  listRowChevron,
  resolveSize,
  sheetCloseIcon,
  sheetSide,
  sheetSidePhone,
  sheetSides,
  sizes,
  tones,
} from '../src/index.ts';

describe('the shared lists', () => {
  it('match the Vue layer’s lists, which Blade’s enums and the stories follow', () => {
    expect(tones).toEqual(vueTones.tones);
    expect(buttonVariants).toEqual(vueButton.buttonVariants);
    expect(sizes).toEqual(vueSize.sizes);
    expect(controlSizes).toEqual(vueSize.controlSizes);
    expect(iconSizes).toEqual(vueIcon.iconSizes);
    expect(calloutTones).toEqual(vueCallout.calloutTones);
    expect(calloutRoles).toEqual(vueCallout.calloutRoles);
    expect(calloutIcons).toEqual(vueCallout.calloutIcons);
    expect(avatarSizes).toEqual(vueAvatar.avatarSizes);
    expect(avatarGlyph).toBe(vueAvatar.avatarGlyph);
    expect(dataTableSorts).toEqual(vueDataTable.dataTableSorts);
    expect(dataTableCellKinds).toEqual(vueDataTable.dataTableCellKinds);
    expect(dataTableSortIcon).toBe(vueDataTable.dataTableSortIcon);
    expect(headingLevels).toEqual(vueHeading.headingLevels);
    expect(listRowChevron).toBe(vueListRow.listRowChevron);
    expect(sheetSides).toEqual(vueSheet.sheetSides);
    expect(sheetCloseIcon).toBe(vueSheet.sheetCloseIcon);
    expect(dialogSidePhones).toEqual(vueDialog.dialogSidePhones);
    expect(dialogCloseIcon).toBe(vueDialog.dialogCloseIcon);
  });

  it('fall back the way the Vue layer does', () => {
    expect(buttonVariant('loud')).toBe('primary');
    expect(buttonVariant('danger-ghost')).toBe('danger-ghost');
    expect(resolveSize('xl', controlSizes, 'md')).toBe('md');
    expect(calloutTone('loud')).toBe('neutral');
    expect(calloutTone('info')).toBe('info');
    expect(calloutRole('log')).toBe('note');
    expect(calloutRole('alert')).toBe('alert');
    expect(dataTableSort('sideways')).toBe('none');
    expect(dataTableCellKind('header')).toBe('field');
    expect(headingLevel('h1')).toBe('h2');
    expect(sheetSide('left')).toBe('end');
    expect(sheetSide('top')).toBe('top');
    expect(sheetSidePhone('left')).toBeUndefined();
    expect(sheetSidePhone('bottom')).toBe('bottom');
    expect(dialogSidePhone('top')).toBe('center');
    expect(dialogSidePhone('bottom')).toBe('bottom');
    expect(sizes.map(iconSizeFor)).toEqual(['sm', 'sm', 'md', 'md', 'md']);
  });
});

describe('the markup helpers', () => {
  it('put a project class after Plinth’s, and ignore a blank one', () => {
    expect(classNames('plinth-badge', ' ms-2 ')).toBe('plinth-badge ms-2');
    expect(classNames('plinth-badge', ' ')).toBe('plinth-badge');
    expect(classNames('plinth-badge', undefined)).toBe('plinth-badge');
  });

  it('tell a node that prints something from one that does not', () => {
    expect([null, undefined, false, true, '', '  '].map(hasContent)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(['x', 0].map(hasContent)).toEqual([true, true]);
    expect([[], [false, null, ' '], <></>, <>{false}</>, <>{[]}</>].map(hasContent)).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
    expect([['x'], <>x</>, <i />].map(hasContent)).toEqual([true, true, true]);
  });
});
