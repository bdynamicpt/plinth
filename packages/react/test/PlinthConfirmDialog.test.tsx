import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PlinthConfirmDialog,
  type ConfirmDialogKind,
  type ConfirmDialogTone,
  type DialogSidePhone,
  type PlinthConfirmDialogProps,
} from '../src/index.ts';

const cancel =
  '<button type="button" data-variant="secondary" data-size="md" commandfor="archive" command="close" class="plinth-button">' +
  '<span class="plinth-button-label">Cancel</span></button>';

const confirm = (variant = 'primary') =>
  `<button type="submit" data-variant="${variant}" data-size="md" value="confirm" class="plinth-button plinth-confirm-dialog-confirm">` +
  '<span class="plinth-button-label">Archive</span></button>';

const base = {
  id: 'archive',
  title: 'Archive 3 tickets?',
  message: 'You can bring them back.',
  confirmLabel: 'Archive',
};

const markup = (props: Partial<PlinthConfirmDialogProps> = {}) =>
  renderToStaticMarkup(<PlinthConfirmDialog {...base} {...props} />);

const root = (element: ReactElement) =>
  render(element).container.firstElementChild! as HTMLDialogElement;

describe('PlinthConfirmDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints the simple kind: the question, the message, Cancel and the action', () => {
    expect(markup()).toBe(
      '<dialog id="archive" role="alertdialog" closedby="closerequest" aria-labelledby="archive-title" aria-describedby="archive-message" class="plinth-dialog plinth-confirm-dialog">' +
        '<form class="plinth-confirm-dialog-form" method="dialog">' +
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
    expect(markup({ kind: 'type', phrase: ' harbour ' })).toContain(
      '<div class="plinth-confirm-dialog-field">' +
        '<label for="archive-field" class="plinth-confirm-dialog-label">Type <strong>harbour</strong> to confirm</label>' +
        '<input id="archive-field" class="plinth-confirm-dialog-input" type="text" required="" pattern="harbour" autoComplete="off" autoCapitalize="none" spellCheck="false" name="confirmation"/>' +
        '</div>',
    );
  });

  it('asks for the password, and leaves checking it to the app', () => {
    expect(markup({ kind: 'password' })).toContain(
      '<div class="plinth-confirm-dialog-field">' +
        '<label for="archive-field" class="plinth-confirm-dialog-label">Password</label>' +
        '<input id="archive-field" class="plinth-confirm-dialog-input" type="password" required="" autoComplete="current-password" name="password"/>' +
        '</div>',
    );
  });

  it('falls back to the simple kind and the neutral tone', () => {
    const html = markup({ kind: 'pin' as ConfirmDialogKind, tone: 'loud' as ConfirmDialogTone });

    expect(html).not.toContain('plinth-confirm-dialog-field');
    expect(html).toContain(confirm());
  });

  it("escapes the phrase's pattern characters, and the phrase in the label", () => {
    const html = markup({ kind: 'type', phrase: 'a.b*c (d) [e] {f} |g\\h/i^$+? <j>' });

    expect(html).toContain(
      'pattern="a\\.b\\*c \\(d\\) \\[e\\] \\{f\\} \\|g\\\\h\\/i\\^\\$\\+\\? &lt;j&gt;"',
    );
    expect(html).toContain('<strong>a.b*c (d) [e] {f} |g\\h/i^$+? &lt;j&gt;</strong>');
  });

  it('takes its own field label, with :phrase where the phrase goes', () => {
    const label = (props: Partial<PlinthConfirmDialogProps>) =>
      root(<PlinthConfirmDialog {...base} {...props} />).querySelector('label')!.innerHTML;

    expect(
      label({ kind: 'type', phrase: 'harbour', fieldLabel: 'Escreva :phrase <b>já</b>' }),
    ).toBe('Escreva <strong>harbour</strong> &lt;b&gt;já&lt;/b&gt;');
    expect(label({ kind: 'password', fieldLabel: 'Palavra-passe' })).toBe('Palavra-passe');
    expect(label({ kind: 'password', fieldLabel: '  ' })).toBe('Password');
  });

  it("shows the app's error under the field, and ties the field to it", () => {
    const html = markup({ kind: 'password', error: "That password isn't right." });

    expect(html).toContain(
      'autoComplete="current-password" aria-invalid="true" aria-describedby="archive-error" name="password"/></div>' +
        '<p id="archive-error" class="plinth-confirm-dialog-error" role="alert">That password isn&#x27;t right.</p></div>',
    );
  });

  it('leaves out a blank error, and an error with no field', () => {
    expect(markup({ kind: 'password', error: '  ' })).not.toContain('error');
    expect(markup({ error: 'Gone wrong' })).not.toContain('Gone wrong');
  });

  it('makes the confirm button busy while the app checks', () => {
    const button = root(<PlinthConfirmDialog {...base} kind="password" busy />).querySelector(
      '.plinth-confirm-dialog-confirm',
    )!;

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.querySelector('.plinth-button-spinner')).not.toBeNull();
  });

  it('makes the confirm button the danger variant for the danger tone', () => {
    expect(markup({ tone: 'danger' })).toContain(confirm('danger'));
  });

  it('takes the labels of its buttons, and has defaults for them', () => {
    const labels = (props: Partial<PlinthConfirmDialogProps>) =>
      [
        ...root(<PlinthConfirmDialog {...base} {...props} />).querySelectorAll(
          '.plinth-button-label',
        ),
      ].map((label) => label.textContent);

    expect(labels({ confirmLabel: 'Arquivar', cancelLabel: 'Cancelar' })).toEqual([
      'Cancelar',
      'Arquivar',
    ]);
    expect(labels({ confirmLabel: undefined })).toEqual(['Cancel', 'Confirm']);
  });

  it('takes a side on the phone, and falls back to centred, which prints nothing', () => {
    const side = (value: string) =>
      root(<PlinthConfirmDialog {...base} sidePhone={value as DialogSidePhone} />).dataset
        .sidePhone;

    expect(side('bottom')).toBe('bottom');
    expect(side('center')).toBeUndefined();
    expect(side('top')).toBeUndefined();
  });

  it('generates an id when it has none, and trims the one it is given', () => {
    const dialog = root(<PlinthConfirmDialog {...base} id={undefined} kind="password" />);

    expect(dialog.id).toMatch(/^plinth-confirm-dialog-/);
    expect(dialog.getAttribute('aria-describedby')).toBe(`${dialog.id}-message`);
    expect(dialog.querySelector('label')?.htmlFor).toBe(`${dialog.id}-field`);
    expect(root(<PlinthConfirmDialog {...base} id=" archive " />).id).toBe('archive');
  });

  it('needs a title, a message, and a phrase to type', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PlinthConfirmDialog {...base} title=" " />)).toThrow('needs a title');
    expect(() => render(<PlinthConfirmDialog {...base} message="" />)).toThrow('needs a message');
    expect(() => render(<PlinthConfirmDialog {...base} kind="type" />)).toThrow('needs a phrase');
  });

  it('escapes the title, the message and the error', () => {
    const html = markup({
      title: '<b>x</b>',
      message: '<i>y</i>',
      kind: 'password',
      error: '<u>z</u>',
    });

    expect(html).not.toMatch(/<[biu]>/);
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).toContain('&lt;i&gt;y&lt;/i&gt;');
    expect(html).toContain('&lt;u&gt;z&lt;/u&gt;');
  });

  it('passes other props, onSubmit, onClose and the ref to the dialog, and lets a project attribute win', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const dialog = root(
      <PlinthConfirmDialog
        {...base}
        ref={ref}
        className="is-busy"
        closedby="any"
        role="dialog"
        data-testid="archive"
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );
    fireEvent(dialog, new Event('close'));
    // The form's submit bubbles to the dialog, where the app listens.
    fireEvent.submit(dialog.querySelector('form')!);

    expect(dialog.className).toBe('plinth-dialog plinth-confirm-dialog is-busy');
    expect(dialog.getAttribute('closedby')).toBe('any');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.dataset.testid).toBe('archive');
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(ref.current).toBe(dialog);
  });
});
