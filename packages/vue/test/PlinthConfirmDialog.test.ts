import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  PlinthConfirmDialog,
  confirmDialogKind,
  confirmDialogPattern,
  confirmDialogTone,
} from '../src/index.ts';

const cancel =
  '<button type="button" class="plinth-button" data-variant="secondary" data-size="md" commandfor="archive" command="close" value="cancel">' +
  '<span class="plinth-button-label">Cancel</span></button>';

const confirm = (variant = 'primary') =>
  `<button type="submit" class="plinth-button plinth-confirm-dialog-confirm" data-variant="${variant}" data-size="md" value="confirm">` +
  '<span class="plinth-button-label">Archive</span></button>';

const dialogWith = (props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) =>
  mount(PlinthConfirmDialog, {
    props: {
      id: 'archive',
      title: 'Archive 3 tickets?',
      message: 'You can bring them back.',
      confirmLabel: 'Archive',
      ...props,
    },
    attrs,
  });

const html = (props: Record<string, unknown> = {}) =>
  dialogWith(props)
    .html()
    .replace(/\n\s*/g, '')
    .replace(/<!--v-if-->/g, '');

describe('PlinthConfirmDialog', () => {
  it('prints the simple kind: the question, the message, Cancel and the action', () => {
    expect(html()).toBe(
      '<dialog id="archive" class="plinth-dialog plinth-confirm-dialog" role="alertdialog" closedby="closerequest" aria-labelledby="archive-title" aria-describedby="archive-message">' +
        '<form method="dialog" class="plinth-confirm-dialog-form">' +
        '<div class="plinth-dialog-header">' +
        '<h2 id="archive-title" class="plinth-dialog-title">Archive 3 tickets?</h2>' +
        '</div>' +
        '<div class="plinth-dialog-body">' +
        '<p id="archive-message" class="plinth-confirm-dialog-message">You can bring them back.</p>' +
        '</div>' +
        `<div class="plinth-dialog-footer">${cancel}${confirm()}</div>` +
        '</form>' +
        '</dialog>',
    );
  });

  it('asks for a phrase, typed exactly, with the phrase in its label', () => {
    expect(html({ kind: 'type', phrase: ' harbour ' })).toContain(
      '<div class="plinth-confirm-dialog-field">' +
        '<label for="archive-field" class="plinth-confirm-dialog-label">Type <strong>harbour</strong> to confirm</label>' +
        '<input id="archive-field" class="plinth-confirm-dialog-input" type="text" name="confirmation" required="" pattern="harbour" autocomplete="off" autocapitalize="none" spellcheck="false">' +
        '</div>',
    );
  });

  it('asks for the password, and leaves checking it to the app', () => {
    expect(html({ kind: 'password' })).toContain(
      '<div class="plinth-confirm-dialog-field">' +
        '<label for="archive-field" class="plinth-confirm-dialog-label">Password</label>' +
        '<input id="archive-field" class="plinth-confirm-dialog-input" type="password" name="password" required="" autocomplete="current-password">' +
        '</div>',
    );
  });

  it('falls back to the simple kind and the neutral tone', () => {
    expect(confirmDialogKind('pin')).toBe('simple');
    expect(confirmDialogKind('type')).toBe('type');
    expect(confirmDialogTone('loud')).toBe('neutral');
    expect(confirmDialogTone('danger')).toBe('danger');
    expect(html({ kind: 'pin', tone: 'loud' })).not.toContain('plinth-confirm-dialog-field');
  });

  it("escapes the phrase's pattern characters", () => {
    expect(confirmDialogPattern('a.b*c (d) [e] {f} |g\\h/i^$+?')).toBe(
      'a\\.b\\*c \\(d\\) \\[e\\] \\{f\\} \\|g\\\\h\\/i\\^\\$\\+\\?',
    );
    const input = dialogWith({ kind: 'type', phrase: 'a.b' }).find('input');
    expect(input.attributes('pattern')).toBe('a\\.b');
    expect(new RegExp(`^(?:${input.attributes('pattern')})$`, 'v').test('a.b')).toBe(true);
    expect(new RegExp(`^(?:${input.attributes('pattern')})$`, 'v').test('axb')).toBe(false);
  });

  it('takes its own field label, with :phrase where the phrase goes', () => {
    const label = (props: Record<string, unknown>) =>
      dialogWith(props)
        .find('label')
        .element.innerHTML.replace(/<!--v-if-->/g, '');

    expect(
      label({ kind: 'type', phrase: 'harbour', fieldLabel: 'Escreva :phrase <b>já</b>' }),
    ).toBe('Escreva <strong>harbour</strong> &lt;b&gt;já&lt;/b&gt;');
    expect(label({ kind: 'password', fieldLabel: 'Palavra-passe' })).toBe('Palavra-passe');
    expect(label({ kind: 'password', fieldLabel: '  ' })).toBe('Password');
  });

  it("shows the app's error under the field, and ties the field to it", () => {
    const wrapper = dialogWith({ kind: 'password', error: "That password isn't right." });

    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('archive-error');
    expect(wrapper.find('.plinth-confirm-dialog-error').html()).toBe(
      '<p id="archive-error" class="plinth-confirm-dialog-error" role="alert">That password isn\'t right.</p>',
    );
  });

  it('ties the phrase field to the error too', () => {
    const input = dialogWith({ kind: 'type', phrase: 'harbour', error: 'Not the name.' }).find(
      'input',
    );

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('archive-error');
  });

  it('leaves out a blank error, and an error with no field', () => {
    expect(html({ kind: 'password', error: '  ' })).not.toContain('error');
    expect(html({ error: 'Gone wrong' })).not.toContain('Gone wrong');
  });

  it('makes the confirm button busy while the app checks', () => {
    const button = dialogWith({ kind: 'password', busy: true }).find(
      '.plinth-confirm-dialog-confirm',
    );

    expect(button.attributes('aria-busy')).toBe('true');
    expect(button.attributes('aria-disabled')).toBe('true');
    expect(button.find('.plinth-button-spinner').exists()).toBe(true);
  });

  it('makes the confirm button the danger variant for the danger tone', () => {
    expect(html({ tone: 'danger' })).toContain(confirm('danger'));
  });

  it('takes the labels of its buttons, and has defaults for them', () => {
    const labels = (props: Record<string, unknown>) =>
      dialogWith(props)
        .findAll('.plinth-button-label')
        .map((label) => label.text());

    expect(labels({ confirmLabel: 'Arquivar', cancelLabel: 'Cancelar' })).toEqual([
      'Cancelar',
      'Arquivar',
    ]);
    expect(labels({ confirmLabel: undefined })).toEqual(['Cancel', 'Confirm']);
  });

  it('takes a side on the phone, and falls back to centred, which prints nothing', () => {
    const side = (value: string) => dialogWith({ sidePhone: value }).attributes('data-side-phone');

    expect(side('bottom')).toBe('bottom');
    expect(side('center')).toBeUndefined();
    expect(side('top')).toBeUndefined();
  });

  it('generates an id when it has none, and trims the one it is given', () => {
    const generated = dialogWith({ id: undefined, kind: 'password' });
    const id = generated.attributes('id')!;

    expect(id).toMatch(/^plinth-confirm-dialog-/);
    expect(generated.attributes('aria-describedby')).toBe(`${id}-message`);
    expect(generated.find('label').attributes('for')).toBe(`${id}-field`);
    expect(dialogWith({ id: ' archive ' }).attributes('id')).toBe('archive');
  });

  it('takes a kind that changes after it is created, and the phrase with it', async () => {
    const wrapper = dialogWith();
    await wrapper.setProps({ kind: 'type' });

    expect(wrapper.find('input').attributes('pattern')).toBe('');
    await wrapper.setProps({ phrase: 'harbour' });
    expect(wrapper.find('input').attributes('pattern')).toBe('harbour');
  });

  it('needs a title, a message, and a phrase to type', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => dialogWith({ title: ' ' })).toThrow('needs a title');
    expect(() => dialogWith({ message: undefined })).toThrow('needs a message');
    expect(() => dialogWith({ kind: 'type' })).toThrow('needs a phrase');
    vi.restoreAllMocks();
  });

  it('escapes the title, the message and the error', () => {
    const out = html({
      title: '<b>x</b>',
      message: '<i>y</i>',
      kind: 'password',
      error: '<u>z</u>',
    });

    expect(out).not.toMatch(/<[biu]>/);
    expect(out).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(out).toContain('&lt;i&gt;y&lt;/i&gt;');
    expect(out).toContain('&lt;u&gt;z&lt;/u&gt;');
  });

  it('passes attributes and listeners to its root, and lets a project replace role and closedby', async () => {
    const submit = vi.fn((event: Event) => event.preventDefault());
    const wrapper = dialogWith(
      {},
      {
        class: 'is-busy',
        role: 'dialog',
        closedby: 'any',
        'data-testid': 'archive',
        onSubmit: submit,
      },
    );

    expect(wrapper.attributes('class')).toBe('plinth-dialog plinth-confirm-dialog is-busy');
    expect(wrapper.attributes('role')).toBe('dialog');
    expect(wrapper.attributes('closedby')).toBe('any');
    expect(wrapper.attributes('data-testid')).toBe('archive');

    // The form's submit bubbles to the dialog, where the app listens.
    await wrapper.find('form').trigger('submit');
    expect(submit).toHaveBeenCalledOnce();
  });

  it('opens and closes through its exposed methods, and emits close', async () => {
    const wrapper = dialogWith();
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();
    const exposed = wrapper.vm as unknown as {
      showModal: () => void;
      close: (value?: string) => void;
    };

    exposed.showModal();
    exposed.close('confirm');
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.close).toHaveBeenCalledWith('confirm');

    await wrapper.trigger('close');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});
