import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlinthDialog, dialogCloseIcon, type DialogSidePhone } from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-dialog-close" data-variant="ghost" data-size="md" aria-label="Close" commandfor="project" command="close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${dialogCloseIcon}</span></button>`;

const root = (element: ReactElement) =>
  render(element).container.firstElementChild! as HTMLDialogElement;

describe('PlinthDialog', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints the dialog, the header, the body and the footer', () => {
    expect(
      renderToStaticMarkup(
        <PlinthDialog
          id="project"
          title="Edit project"
          description="The name shows to everyone."
          footer={<button type="button">Save</button>}
        >
          <p>Body</p>
        </PlinthDialog>,
      ),
    ).toBe(
      '<dialog id="project" closedby="any" aria-labelledby="project-title" aria-describedby="project-description" class="plinth-dialog">' +
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
    const dialog = root(<PlinthDialog title="Leave?" dismissible={false} />);

    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.getAttribute('closedby')).toBe('closerequest');
    expect(dialog.querySelector('.plinth-dialog-close')).toBeNull();
  });

  it('leaves out a blank description and a footer that prints nothing', () => {
    const dialog = root(<PlinthDialog title="Edit project" description="  " footer=" " />);

    expect(dialog.hasAttribute('aria-describedby')).toBe(false);
    expect(dialog.querySelector('.plinth-dialog-description')).toBeNull();
    expect(dialog.querySelector('.plinth-dialog-footer')).toBeNull();
    expect(
      root(<PlinthDialog title="Edit project" footer={[false, null]} />).querySelector(
        '.plinth-dialog-footer',
      ),
    ).toBeNull();
  });

  it('escapes the title and the description', () => {
    const html = renderToStaticMarkup(
      <PlinthDialog id="x" title="<b>A</b>" description="<i>B</i>" />,
    );

    expect(html).toContain('class="plinth-dialog-title">&lt;b&gt;A&lt;/b&gt;</h2>');
    expect(html).toContain('class="plinth-dialog-description">&lt;i&gt;B&lt;/i&gt;</p>');
  });

  it('takes a side on the phone, and falls back to centred, which prints nothing', () => {
    const side = (value: string) =>
      root(<PlinthDialog title="Edit project" sidePhone={value as DialogSidePhone} />).dataset
        .sidePhone;

    expect(side('bottom')).toBe('bottom');
    expect(side('center')).toBeUndefined();
    expect(side('top')).toBeUndefined();
  });

  it("takes the close button's label", () => {
    const dialog = root(<PlinthDialog title="Editar" closeLabel="Fechar" />);

    expect(dialog.querySelector('.plinth-dialog-close')?.getAttribute('aria-label')).toBe('Fechar');
  });

  it('generates an id when it has none, trims one it is given, and wires the title to it', () => {
    const dialog = root(<PlinthDialog title="Edit project" />);

    expect(dialog.id).toMatch(/^plinth-dialog-/);
    expect(dialog.getAttribute('aria-labelledby')).toBe(`${dialog.id}-title`);
    expect(dialog.querySelector('h2')?.id).toBe(`${dialog.id}-title`);
    expect(dialog.querySelector('.plinth-dialog-close')?.getAttribute('commandfor')).toBe(
      dialog.id,
    );
    expect(root(<PlinthDialog id=" project " title="Edit project" />).id).toBe('project');
  });

  it('needs a title', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PlinthDialog title=" " />)).toThrow('needs a title');
  });

  it('passes other props, onClose and the ref to the dialog, and lets a project attribute win', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    const dialog = root(
      <PlinthDialog
        ref={ref}
        id="project"
        title="Edit project"
        dismissible={false}
        className="is-busy"
        closedby="none"
        role="dialog"
        aria-labelledby="project-heading"
        onClose={onClose}
      />,
    );
    fireEvent(dialog, new Event('close'));

    expect(dialog.className).toBe('plinth-dialog is-busy');
    expect(dialog.getAttribute('closedby')).toBe('none');
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe('project-heading');
    expect(onClose).toHaveBeenCalledOnce();
    expect(ref.current).toBe(dialog);
  });
});
