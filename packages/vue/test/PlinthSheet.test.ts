import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { PlinthSheet, sheetCloseIcon, sheetPlacement } from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-sheet-close" commandfor="filters" command="close" data-variant="ghost" data-size="md" aria-label="Close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${sheetCloseIcon}</span></button>`;

const sheetWith = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(PlinthSheet, {
    props: { id: 'filters', title: 'Filters', ...props },
    slots: { default: '<p>Body</p>', ...slots },
  });

describe('PlinthSheet', () => {
  it('prints the dialog, the header, the body and the footer', () => {
    const wrapper = sheetWith(
      { description: 'Narrow the list down.' },
      { footer: '<button type="button">Apply</button>' },
    );
    const html = wrapper.html().replace(/\n\s*/g, '');

    expect(html).toBe(
      '<dialog id="filters" class="plinth-sheet" data-placement="center" closedby="any" aria-labelledby="filters-title" aria-describedby="filters-description">' +
        '<div class="plinth-sheet-header">' +
        '<h2 id="filters-title" class="plinth-sheet-title">Filters</h2>' +
        '<p id="filters-description" class="plinth-sheet-description">Narrow the list down.</p>' +
        close +
        '</div>' +
        '<div class="plinth-sheet-body"><p>Body</p></div>' +
        '<div class="plinth-sheet-footer"><button type="button">Apply</button></div>' +
        '</dialog>',
    );
  });

  it('leaves out an empty or blank description and a missing footer', () => {
    for (const description of ['', '  ']) {
      const wrapper = sheetWith({ description });

      expect(wrapper.attributes('aria-describedby')).toBeUndefined();
      expect(wrapper.find('.plinth-sheet-description').exists()).toBe(false);
      expect(wrapper.find('.plinth-sheet-footer').exists()).toBe(false);
    }
  });

  it('takes a placement, and falls back to center', () => {
    const placement = (value: string) =>
      sheetWith({ placement: value }).attributes('data-placement');

    expect(placement('end')).toBe('end');
    expect(placement('start')).toBe('center');
    expect(sheetPlacement(undefined)).toBe('center');
  });

  it("takes the close button's label", () => {
    const wrapper = sheetWith({ title: 'Filtros', closeLabel: 'Fechar' });

    expect(wrapper.find('.plinth-sheet-close').attributes('aria-label')).toBe('Fechar');
  });

  it('generates an id when it has none, and wires the title to it', () => {
    const wrapper = mount(PlinthSheet, { props: { title: 'Filters' } });
    const id = wrapper.attributes('id')!;

    expect(id).toMatch(/^plinth-sheet-/);
    expect(wrapper.attributes('aria-labelledby')).toBe(`${id}-title`);
    expect(wrapper.find('h2').attributes('id')).toBe(`${id}-title`);
    expect(wrapper.find('.plinth-sheet-close').attributes('commandfor')).toBe(id);
  });

  it('escapes the title and the description', () => {
    const wrapper = sheetWith({ title: '<b>x</b>', description: '<i>y</i>' });

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.find('i').exists()).toBe(false);
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;i&gt;y&lt;/i&gt;');
  });

  it('passes extra attributes and listeners to its root, and lets a project replace closedby', async () => {
    const onClose = vi.fn();
    const wrapper = mount(PlinthSheet, {
      props: { id: 'filters', title: 'Filters' },
      attrs: { class: 'is-busy', closedby: 'closerequest', 'data-testid': 'filters', onClose },
    });

    expect(wrapper.classes()).toEqual(['plinth-sheet', 'is-busy']);
    expect(wrapper.attributes('closedby')).toBe('closerequest');
    expect(wrapper.attributes('data-testid')).toBe('filters');
    await wrapper.trigger('close');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('opens and closes the dialog through showModal() and close()', () => {
    const wrapper = sheetWith();
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();

    wrapper.vm.showModal();
    wrapper.vm.close();

    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.close).toHaveBeenCalledOnce();
  });
});
