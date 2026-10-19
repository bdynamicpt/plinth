import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import {
  dataTableCellKind,
  dataTableSort,
  dataTableSortIcon,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
} from '../src/index.ts';

const squish = (html: string) => html.replace(/>\s+</g, '><').replace(/<!--v-if-->/g, '');

describe('PlinthDataTable', () => {
  it('prints the table with its caption, head and body', () => {
    const wrapper = mount(PlinthDataTable, {
      props: { caption: 'Orders' },
      slots: { head: '<th>Order</th>', default: '<tr><td>#1042</td></tr>' },
    });

    expect(squish(wrapper.html())).toBe(
      '<table class="plinth-data-table" role="table"><caption class="plinth-data-table-caption">Orders</caption>' +
        '<thead class="plinth-data-table-head" role="rowgroup"><tr class="plinth-data-table-head-row" role="row"><th>Order</th></tr></thead>' +
        '<tbody class="plinth-data-table-body" role="rowgroup"><tr><td>#1042</td></tr></tbody></table>',
    );
  });

  it('leaves out an empty caption', () => {
    for (const caption of ['', ' ', undefined]) {
      const wrapper = mount(PlinthDataTable, { props: { caption } });
      expect(wrapper.find('caption').exists()).toBe(false);
    }
  });

  it('escapes the caption', () => {
    const wrapper = mount(PlinthDataTable, { props: { caption: '<b>x</b>' } });
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('keeps extra classes and attributes', () => {
    const wrapper = mount(PlinthDataTable, { attrs: { class: 'mt-4', 'aria-label': 'Orders' } });
    expect(wrapper.classes()).toEqual(['plinth-data-table', 'mt-4']);
    expect(wrapper.attributes('aria-label')).toBe('Orders');
  });
});

describe('PlinthDataTableColumn', () => {
  it('prints a column header', () => {
    const wrapper = mount(PlinthDataTableColumn, { slots: { default: 'Order' } });
    expect(wrapper.html()).toBe(
      '<th class="plinth-data-table-column" role="columnheader" scope="col">Order</th>',
    );
  });

  it('marks a numeric column and one hidden on a phone', () => {
    const wrapper = mount(PlinthDataTableColumn, { props: { numeric: true, hideOnPhone: true } });
    expect(wrapper.attributes('data-numeric')).toBe('');
    expect(wrapper.attributes('data-phone')).toBe('hidden');
  });

  it('prints aria-sort on a sortable column, and falls back to none', () => {
    const sort = (value: string | undefined) =>
      mount(PlinthDataTableColumn, { props: { sort: value as 'none' } }).attributes('aria-sort');

    expect(sort('ascending')).toBe('ascending');
    expect(sort('descending')).toBe('descending');
    expect(sort('none')).toBe('none');
    expect(sort('sideways')).toBe('none');
    expect(sort(' ')).toBeUndefined();
    expect(sort(undefined)).toBeUndefined();
    expect(dataTableSort(undefined)).toBe('none');
  });

  it('keeps extra attributes', () => {
    const wrapper = mount(PlinthDataTableColumn, { attrs: { class: 'w-32', 'data-key': 'date' } });
    expect(wrapper.classes()).toEqual(['plinth-data-table-column', 'w-32']);
    expect(wrapper.attributes('data-key')).toBe('date');
  });
});

describe('PlinthDataTableSort', () => {
  it('prints the sort button with its icon', () => {
    const wrapper = mount(PlinthDataTableSort, { slots: { default: 'Date' } });
    expect(squish(wrapper.html())).toBe(
      `<button type="button" class="plinth-data-table-sort"><span class="plinth-data-table-sort-label">Date</span>${dataTableSortIcon}</button>`,
    );
  });

  it('escapes the label and passes listeners to the button', async () => {
    let clicks = 0;
    const wrapper = mount(PlinthDataTableSort, {
      attrs: { onClick: () => clicks++ },
      slots: { default: () => '<b>x</b>' },
    });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    await wrapper.trigger('click');
    expect(clicks).toBe(1);
  });
});

describe('PlinthDataTableRow', () => {
  it('prints a row, and aria-selected only on a row that can be selected', () => {
    expect(mount(PlinthDataTableRow).html()).toBe(
      '<tr class="plinth-data-table-row" role="row"></tr>',
    );
    expect(mount(PlinthDataTableRow, { props: { selected: true } }).attributes()).toMatchObject({
      'aria-selected': 'true',
    });
    expect(mount(PlinthDataTableRow, { props: { selected: false } }).attributes()).toMatchObject({
      'aria-selected': 'false',
    });
  });

  it('keeps extra attributes', () => {
    const wrapper = mount(PlinthDataTableRow, { attrs: { id: 'order-1042' } });
    expect(wrapper.attributes('id')).toBe('order-1042');
  });
});

describe('PlinthDataTableCell', () => {
  it('prints a cell with its label and value', () => {
    const wrapper = mount(PlinthDataTableCell, {
      props: { label: 'Order', kind: 'title' },
      slots: { default: '#1042' },
    });
    expect(squish(wrapper.html())).toBe(
      '<td class="plinth-data-table-cell" role="cell" data-kind="title"><span class="plinth-data-table-label" aria-hidden="true">Order</span>' +
        '<span class="plinth-data-table-value">#1042</span></td>',
    );
  });

  it('is a field by default, without a blank label', () => {
    for (const label of ['', ' ', undefined]) {
      const wrapper = mount(PlinthDataTableCell, { props: { label } });
      expect(wrapper.attributes('data-kind')).toBe('field');
      expect(wrapper.find('.plinth-data-table-label').exists()).toBe(false);
    }
  });

  it('takes a kind, and falls back to field', () => {
    const kind = (value: string) =>
      mount(PlinthDataTableCell, { props: { kind: value as 'field' } }).attributes('data-kind');
    expect(kind('actions')).toBe('actions');
    expect(kind('header')).toBe('field');
    expect(dataTableCellKind(undefined)).toBe('field');
  });

  it('marks a numeric cell and one hidden on a phone, and escapes the label', () => {
    const wrapper = mount(PlinthDataTableCell, {
      props: { numeric: true, hideOnPhone: true, label: '<b>x</b>' },
      attrs: { class: 'truncate' },
    });
    expect(wrapper.attributes('data-numeric')).toBe('');
    expect(wrapper.attributes('data-phone')).toBe('hidden');
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.classes()).toEqual(['plinth-data-table-cell', 'truncate']);
  });
});

describe('PlinthDataTableEmpty', () => {
  it('prints the empty state across the columns', () => {
    const wrapper = mount(PlinthDataTableEmpty, {
      props: { columns: 5 },
      slots: { default: 'No orders yet.' },
    });
    expect(squish(wrapper.html())).toBe(
      '<tr class="plinth-data-table-empty" role="row"><td class="plinth-data-table-empty-cell" role="cell" colspan="5">No orders yet.</td></tr>',
    );
  });

  it('spans at least one whole column', () => {
    const span = (columns?: number | string) =>
      mount(PlinthDataTableEmpty, { props: { columns } }).find('td').attributes('colspan');
    expect(span()).toBe('1');
    expect(span('3')).toBe('3');
    expect(span(2.7)).toBe('2');
    expect(span(0)).toBe('1');
    expect(span(-2)).toBe('1');
    expect(span('many')).toBe('1');
    expect(span(Infinity)).toBe('1');
    expect(span('0x1A')).toBe('1');
    expect(span(' 1e1 ')).toBe('10');
  });

  it('escapes the text and keeps extra attributes', () => {
    const wrapper = mount(PlinthDataTableEmpty, {
      attrs: { id: 'empty' },
      slots: { default: () => h('span', '<b>x</b>') },
    });
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.attributes('id')).toBe('empty');
  });
});
