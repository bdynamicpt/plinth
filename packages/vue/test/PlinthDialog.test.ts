import { mount } from '@vue/test-utils';
import { Comment, createStaticVNode, Fragment, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { PlinthDialog, dialogCloseIcon, dialogSidePhone } from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-dialog-close" data-variant="ghost" data-size="md" aria-label="Close" commandfor="project" command="close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${dialogCloseIcon}</span></button>`;

const dialogWith = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(PlinthDialog, {
    props: { id: 'project', title: 'Edit project', ...props },
    slots: { default: '<p>Body</p>', ...slots },
  });

describe('PlinthDialog', () => {
  it('prints the dialog, the header, the body and the footer', () => {
    const wrapper = dialogWith(
      { description: 'The name shows to everyone.' },
      { footer: '<button type="button">Save</button>' },
    );
    const html = wrapper.html().replace(/\n\s*/g, '');

    expect(html).toBe(
      '<dialog id="project" class="plinth-dialog" closedby="any" aria-labelledby="project-title" aria-describedby="project-description">' +
        '<div class="plinth-dialog-header">' +
        '<h2 id="project-title" class="plinth-dialog-title">Edit project</h2>' +
        '<p id="project-description" class="plinth-dialog-description">The name shows to everyone.</p>' +
        close +
        '</div>' +
        '<div class="plinth-dialog-body"><p>Body</p></div>' +
        '<div class="plinth-dialog-footer"><button type="button">Save</button></div>' +
        '</dialog>',
    );
  });

  it('is an alert dialog with no close button when it is not dismissible', () => {
    const wrapper = dialogWith({ dismissible: false });

    expect(wrapper.attributes('role')).toBe('alertdialog');
    expect(wrapper.attributes('closedby')).toBe('closerequest');
    expect(wrapper.find('.plinth-dialog-close').exists()).toBe(false);
  });

  it('leaves out an empty or blank description and a missing footer', () => {
    for (const description of ['', '  ']) {
      const wrapper = dialogWith({ description });

      expect(wrapper.attributes('aria-describedby')).toBeUndefined();
      expect(wrapper.find('.plinth-dialog-description').exists()).toBe(false);
      expect(wrapper.find('.plinth-dialog-footer').exists()).toBe(false);
    }
  });

  it('takes a side on the phone, and falls back to centred, which prints nothing', () => {
    const side = (value: string) => dialogWith({ sidePhone: value }).attributes('data-side-phone');

    expect(side('bottom')).toBe('bottom');
    expect(side('center')).toBeUndefined();
    expect(side('top')).toBeUndefined();
    expect(dialogSidePhone(undefined)).toBe('center');
  });

  it("takes the close button's label", () => {
    const wrapper = dialogWith({ title: 'Editar', closeLabel: 'Fechar' });

    expect(wrapper.find('.plinth-dialog-close').attributes('aria-label')).toBe('Fechar');
  });

  it('generates an id when it has none, and wires the title to it', () => {
    const wrapper = mount(PlinthDialog, { props: { title: 'Edit project' } });
    const id = wrapper.attributes('id')!;

    expect(id).toMatch(/^plinth-dialog-/);
    expect(wrapper.attributes('aria-labelledby')).toBe(`${id}-title`);
    expect(wrapper.find('h2').attributes('id')).toBe(`${id}-title`);
    expect(wrapper.find('.plinth-dialog-close').attributes('commandfor')).toBe(id);
  });

  it('escapes the title and the description', () => {
    const wrapper = dialogWith({ title: '<b>x</b>', description: '<i>y</i>' });

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.find('i').exists()).toBe(false);
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;i&gt;y&lt;/i&gt;');
  });

  it('passes extra attributes to its root, and lets a project replace closedby and role', () => {
    const wrapper = mount(PlinthDialog, {
      props: { id: 'project', title: 'Edit project', dismissible: false },
      attrs: { class: 'is-busy', closedby: 'none', role: 'dialog', 'data-testid': 'project' },
    });

    expect(wrapper.classes()).toEqual(['plinth-dialog', 'is-busy']);
    expect(wrapper.attributes('closedby')).toBe('none');
    expect(wrapper.attributes('role')).toBe('dialog');
    expect(wrapper.attributes('data-testid')).toBe('project');
  });

  it('emits close when the dialog closes', async () => {
    const wrapper = dialogWith();

    await wrapper.trigger('close');

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('close')![0]![0]).toBeInstanceOf(Event);
  });

  it('needs a title', () => {
    expect(() => mount(PlinthDialog, { props: { title: ' ' } })).toThrow('needs a title');
  });

  it('trims the id it is given', () => {
    const wrapper = dialogWith({ id: ' project ' });

    expect(wrapper.attributes('id')).toBe('project');
    expect(wrapper.attributes('aria-labelledby')).toBe('project-title');
  });

  it('leaves out a footer slot with nothing in it, and keeps one with content', () => {
    const footer = (content: () => unknown) =>
      mount(PlinthDialog, {
        props: { id: 'project', title: 'Edit project' },
        slots: { footer: content as () => never },
      })
        .find('.plinth-dialog-footer')
        .exists();

    expect(footer(() => [])).toBe(false);
    expect(footer(() => ' ')).toBe(false);
    expect(footer(() => [h(Comment)])).toBe(false);
    expect(footer(() => [h(Fragment, [h(Comment)])])).toBe(false);
    expect(footer(() => [h(Fragment, [h('button', 'Save')])])).toBe(true);
    expect(footer(() => [createStaticVNode('  ', 1)])).toBe(false);
    expect(footer(() => [createStaticVNode('<b>x</b>', 1)])).toBe(true);
    expect(footer(() => 'Save')).toBe(true);
  });

  it('opens and closes the dialog through showModal() and close()', () => {
    const wrapper = dialogWith();
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();

    wrapper.vm.showModal();
    wrapper.vm.close();

    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.close).toHaveBeenCalledOnce();
  });
});
