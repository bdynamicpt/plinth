import { act, fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkedTab, codeBlockText } from '../src/code-block.ts';
import { PlinthCodeBlock } from '../src/index.ts';

const tabs = [
  { label: 'Blade', code: '<x-plinth::badge />' },
  { label: 'Vue', code: '<PlinthBadge />' },
];

const copyButton =
  '<button type="button" data-variant="ghost" data-size="sm" hidden="" class="plinth-button plinth-code-block-copy"><span class="plinth-button-label">Copy</span></button>' +
  '<span class="plinth-code-block-status" role="status"></span>';

describe('PlinthCodeBlock', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('prints the label, the copy button (hidden until mounted) and the code', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCodeBlock label="brand.css">{':root {\n  --a: 1;\n}'}</PlinthCodeBlock>,
      ),
    ).toBe(
      '<div class="plinth-code-block"><div class="plinth-code-block-header">' +
        '<span class="plinth-code-block-label">brand.css</span>' +
        copyButton +
        '</div>' +
        '<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>:root {\n  --a: 1;\n}</code></pre>' +
        '</div>',
    );
  });

  it('shows the copy button once mounted, where the clipboard is there', () => {
    const { container } = render(<PlinthCodeBlock>x</PlinthCodeBlock>);

    expect(container.querySelector('.plinth-code-block-copy')!.hasAttribute('hidden')).toBe(false);
  });

  it('keeps the copy button hidden without a clipboard', () => {
    Reflect.deleteProperty(navigator, 'clipboard');
    const { container } = render(<PlinthCodeBlock>x</PlinthCodeBlock>);

    expect(container.querySelector('.plinth-code-block-copy')!.hasAttribute('hidden')).toBe(true);
  });

  it('prints language tabs and a <pre> for each, the first checked', () => {
    expect(renderToStaticMarkup(<PlinthCodeBlock id="badge" tabs={tabs} />)).toBe(
      '<div id="badge" class="plinth-code-block"><div class="plinth-code-block-header">' +
        '<div class="plinth-code-block-tabs" role="radiogroup" aria-label="Language">' +
        '<label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="badge-language" checked=""/><span class="plinth-code-block-tab-label">Blade</span></label>' +
        '<label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="badge-language"/><span class="plinth-code-block-tab-label">Vue</span></label>' +
        '</div>' +
        copyButton +
        '</div>' +
        '<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>&lt;x-plinth::badge /&gt;</code></pre>' +
        '<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>&lt;PlinthBadge /&gt;</code></pre>' +
        '</div>',
    );
  });

  it('checks the selected tab, and falls back to the first', () => {
    const checked = (selected?: string) =>
      [
        ...render(<PlinthCodeBlock tabs={tabs} selected={selected} />).container.querySelectorAll(
          'input',
        ),
      ].map((input) => input.checked);

    expect(checked('Vue')).toEqual([false, true]);
    expect(checked('Svelte')).toEqual([true, false]);
    expect(checked()).toEqual([true, false]);
    expect(checkedTab(tabs, 'Vue')).toBe(1);
  });

  it('shows at most six tabs', () => {
    const { container } = render(
      <PlinthCodeBlock
        tabs={Array.from({ length: 7 }, (_, i) => ({ label: `T${i}`, code: `c${i}` }))}
      />,
    );

    expect(container.querySelectorAll('input')).toHaveLength(6);
    expect(container.querySelectorAll('pre')).toHaveLength(6);
  });

  it('prints a tab’s highlighted markup as it is', () => {
    const html = renderToStaticMarkup(
      <PlinthCodeBlock
        tabs={[{ label: 'PHP', code: 'echo', html: '<span class="line">echo</span>' }, tabs[1]!]}
      />,
    );

    expect(html).toContain('<code><span class="line">echo</span></code>');
    expect(html).toContain('<code>&lt;PlinthBadge /&gt;</code>');
  });

  it('takes selected as the starting tab only, as the browser keeps the reader’s choice', () => {
    const { container, rerender } = render(<PlinthCodeBlock tabs={tabs} selected="Vue" />);
    rerender(<PlinthCodeBlock tabs={tabs} selected="Blade" />);

    expect([...container.querySelectorAll('input')].map((input) => input.checked)).toEqual([
      false,
      true,
    ]);
  });

  it('takes the tabs’ accessible name', () => {
    expect(renderToStaticMarkup(<PlinthCodeBlock tabs={tabs} tabsLabel="Framework" />)).toContain(
      'role="radiogroup" aria-label="Framework"',
    );
  });

  it('generates the tabs’ name when it has no id', () => {
    const { container } = render(<PlinthCodeBlock tabs={tabs} id="  " />);
    const names = [...container.querySelectorAll('input')].map((input) => input.name);

    expect(names[0]).toMatch(/^plinth-code-block-.+-language$/);
    expect(names[1]).toBe(names[0]);
    expect(container.firstElementChild!.hasAttribute('id')).toBe(false);
  });

  it('leaves out a blank label and the copy button when copy is off', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCodeBlock label=" " copy={false}>
          npm run build
        </PlinthCodeBlock>,
      ),
    ).toBe(
      '<div class="plinth-code-block"><div class="plinth-code-block-header"></div>' +
        '<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>npm run build</code></pre></div>',
    );
  });

  it('takes a label with markup', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCodeBlock
          label={
            <>
              HTML <b>Parity</b>
            </>
          }
        >
          x
        </PlinthCodeBlock>,
      ),
    ).toContain('<span class="plinth-code-block-label">HTML <b>Parity</b></span>');
  });

  it('prints a highlighter’s markup as it is', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCodeBlock html='<span class="line">const</span>'>ignored</PlinthCodeBlock>,
      ),
    ).toContain('<code><span class="line">const</span></code>');
  });

  it('escapes the label, the tabs and the code', () => {
    const html = renderToStaticMarkup(
      <PlinthCodeBlock label="<b>x</b>" tabs={[{ label: '<i>y</i>', code: '<u>z</u>' }]} />,
    );

    expect(html).not.toMatch(/<(b|i|u)>/);
    expect(html).toContain('&lt;u&gt;z&lt;/u&gt;');
  });

  it('copies the code that shows, says so for two seconds, and calls onCopied', async () => {
    vi.useFakeTimers();
    const onCopied = vi.fn();
    const { container, unmount } = render(
      <PlinthCodeBlock tabs={tabs} copyLabel="Copiar" copiedLabel="Copiado" onCopied={onCopied} />,
    );
    const button = container.querySelector('.plinth-code-block-copy')!;
    const label = () => button.querySelector('.plinth-button-label')!.textContent;
    const status = () => container.querySelector('[role="status"]')!.textContent;

    fireEvent.click(container.querySelectorAll('input')[1]!);
    await act(async () => fireEvent.click(button));

    expect(writeText).toHaveBeenCalledWith('<PlinthBadge />');
    expect(onCopied).toHaveBeenCalledWith('<PlinthBadge />');
    expect(label()).toBe('Copiado');
    expect(status()).toBe('Copiado');

    await act(async () => fireEvent.click(button));
    act(() => vi.advanceTimersByTime(2000));

    expect(label()).toBe('Copiar');
    expect(status()).toBe('');
    unmount();
  });

  it('copies without an onCopied', async () => {
    const { container } = render(<PlinthCodeBlock>npm ci</PlinthCodeBlock>);
    await act(async () => fireEvent.click(container.querySelector('.plinth-code-block-copy')!));

    expect(writeText).toHaveBeenCalledWith('npm ci');
  });

  it('does nothing when the clipboard refuses', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    const onCopied = vi.fn();
    const { container } = render(<PlinthCodeBlock onCopied={onCopied}>x</PlinthCodeBlock>);
    await act(async () => fireEvent.click(container.querySelector('.plinth-code-block-copy')!));

    expect(onCopied).not.toHaveBeenCalled();
    expect(container.querySelector('.plinth-button-label')!.textContent).toBe('Copy');
  });

  it('finds the code of the only <pre>, or nothing outside a code block', () => {
    document.body.innerHTML =
      '<div class="plinth-code-block"><button></button><pre class="plinth-code-block-code"><code>a</code></pre></div><button id="lone"></button>';

    expect(codeBlockText(document.querySelector('.plinth-code-block button')!)).toBe('a');
    expect(codeBlockText(document.getElementById('lone')!)).toBe('');
    document.body.innerHTML = '';
  });

  it('keeps extra classes, attributes and the ref on its root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <PlinthCodeBlock ref={ref} className="ms-2" data-testid="install" aria-describedby="help">
        x
      </PlinthCodeBlock>,
    );
    const root = container.firstElementChild!;

    expect(root.className).toBe('plinth-code-block ms-2');
    expect(root.getAttribute('data-testid')).toBe('install');
    expect(root.getAttribute('aria-describedby')).toBe('help');
    expect(ref.current).toBe(root);
  });
});
