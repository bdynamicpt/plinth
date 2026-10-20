import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlinthDrawer, drawerCloseIcon, type DrawerDesktop } from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-drawer-close" data-variant="ghost" data-size="md" aria-label="Close" commandfor="route" command="close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${drawerCloseIcon}</span></button>`;

const root = (element: ReactElement) =>
  render(element).container.firstElementChild! as HTMLDialogElement;

describe('PlinthDrawer', () => {
  it('prints the dialog, the panel with its handle, the header, the body and the footer', () => {
    expect(
      renderToStaticMarkup(
        <PlinthDrawer
          id="route"
          title="Route"
          description="12 min by bike."
          snapPoints={['peek', 'half', 'full']}
          snap="peek"
          footer={<button type="button">Start</button>}
        >
          <p>Body</p>
        </PlinthDrawer>,
      ),
    ).toBe(
      '<dialog id="route" data-desktop="dialog" data-snap-points="peek half full" data-snap="peek" closedby="any" aria-labelledby="route-title" aria-describedby="route-description" class="plinth-drawer">' +
        '<div class="plinth-drawer-panel">' +
        '<div class="plinth-drawer-handle" aria-hidden="true"></div>' +
        '<div class="plinth-drawer-header">' +
        '<h2 id="route-title" class="plinth-drawer-title">Route</h2>' +
        '<p id="route-description" class="plinth-drawer-description">12 min by bike.</p>' +
        close +
        '</div>' +
        '<div class="plinth-drawer-body"><p>Body</p></div>' +
        '<div class="plinth-drawer-footer"><button type="button">Start</button></div>' +
        '</div>' +
        '</dialog>',
    );
  });

  it('has no snap points, no description and no footer unless it is given them', () => {
    const drawer = root(<PlinthDrawer title="Route" description=" " footer={[false, null]} />);

    expect(drawer.hasAttribute('data-snap-points')).toBe(false);
    expect(drawer.hasAttribute('data-snap')).toBe(false);
    expect(drawer.hasAttribute('aria-describedby')).toBe(false);
    expect(drawer.querySelector('.plinth-drawer-description')).toBeNull();
    expect(drawer.querySelector('.plinth-drawer-footer')).toBeNull();
  });

  it('takes a presentation from 768px up, and falls back to dialog', () => {
    const desktop = (value?: string) =>
      root(<PlinthDrawer title="Route" desktop={value as DrawerDesktop} />).dataset.desktop;

    expect(desktop('sheet')).toBe('sheet');
    expect(desktop('side')).toBe('dialog');
    expect(desktop()).toBe('dialog');
  });

  it('takes its snap points as a list or a string, and opens at the largest by default', () => {
    const drawer = root(<PlinthDrawer title="Route" snapPoints="full  peek top" />);

    expect(drawer.dataset.snapPoints).toBe('peek full');
    expect(drawer.dataset.snap).toBe('full');
    expect(
      root(<PlinthDrawer title="Route" snapPoints="peek half" snap="half" />).dataset.snap,
    ).toBe('half');
  });

  it('escapes the title and the description', () => {
    const html = renderToStaticMarkup(
      <PlinthDrawer id="route" title="<b>x</b>" description="<i>y</i>" />,
    );

    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).toContain('&lt;i&gt;y&lt;/i&gt;');
  });

  it("takes the close button's label, and generates an id when it has none", () => {
    const drawer = root(<PlinthDrawer title="Rota" closeLabel="Fechar" />);
    const button = drawer.querySelector('.plinth-drawer-close')!;

    expect(drawer.id).toMatch(/^plinth-drawer-/);
    expect(drawer.getAttribute('aria-labelledby')).toBe(`${drawer.id}-title`);
    expect(button.getAttribute('aria-label')).toBe('Fechar');
    expect(button.getAttribute('commandfor')).toBe(drawer.id);
    expect(root(<PlinthDrawer id=" route " title="Route" />).id).toBe('route');
  });

  it('passes other props, onClose and the ref to the dialog, and lets a project attribute win', () => {
    const ref = createRef<HTMLDialogElement>();
    let closed = 0;
    const drawer = root(
      <PlinthDrawer
        id="route"
        title="Route"
        ref={ref}
        className="is-busy"
        closedby="closerequest"
        data-testid="route"
        onClose={() => closed++}
      />,
    );

    fireEvent(drawer, new Event('close'));

    expect(drawer.className).toBe('plinth-drawer is-busy');
    expect(drawer.getAttribute('closedby')).toBe('closerequest');
    expect(drawer.dataset.testid).toBe('route');
    expect(ref.current).toBe(drawer);
    expect(closed).toBe(1);
  });

  it('needs a title', () => {
    expect(() => renderToStaticMarkup(<PlinthDrawer title=" " />)).toThrow('needs a title');
  });
});
