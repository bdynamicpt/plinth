import { useOf, type Of } from '@storybook/addon-docs/blocks';
import { useEffect, useRef, useState } from 'react';
import { fitScale, frameUrl, themes, toTheme, widths, type Theme } from './every-width.ts';
import '@bdynamic/plinth-css/src/components/button.css';
import './every-width.css';

/** The toolbar's globals as the docs page's decorators set them on <html>. */
function readGlobals() {
  const root = document.documentElement;
  return { theme: toTheme(root.dataset.theme), brand: root.dataset.brand, dir: root.dir };
}

/** Follows the toolbar: the decorators rewrite <html>'s attributes when it changes. */
function usePageGlobals() {
  const [globals, setGlobals] = useState(readGlobals);
  useEffect(() => {
    const observer = new MutationObserver(() => setGlobals(readGlobals()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-brand', 'dir'],
    });
    return () => observer.disconnect();
  }, []);
  return globals;
}

interface FrameProps {
  src: string;
  title: string;
  label: string;
  width: number;
  /** The frame's own height in px; measured from the story when left out. */
  height?: number;
}

/** The smallest frame, until the story has rendered and been measured. */
const minHeight = 48;

function Frame({ src, title, label, width, height }: FrameProps) {
  const cell = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [measured, setMeasured] = useState(minHeight);

  // Scale the frame to the width of its cell.
  useEffect(() => {
    const element = cell.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setScale(fitScale(element.clientWidth, width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  // Size the frame to the story: the bottom of its root, plus the body's padding.
  const measure = () => {
    if (height) return;
    const doc = frame.current?.contentDocument;
    const root = doc?.getElementById('storybook-root');
    if (!doc || !root) return;
    const resize = () => {
      const padding = parseFloat(getComputedStyle(doc.body).paddingBlockEnd) || 0;
      setMeasured(Math.max(minHeight, Math.ceil(root.getBoundingClientRect().bottom + padding)));
    };
    new ResizeObserver(resize).observe(root);
  };

  const frameHeight = height ?? measured;

  return (
    <figure className="sb-every-width-frame">
      <figcaption className="sb-every-width-label">
        {label} <span>{width}px</span>
      </figcaption>
      <div
        ref={cell}
        className="sb-every-width-viewport"
        style={{ blockSize: `${frameHeight * scale}px` }}
      >
        <iframe
          ref={frame}
          src={src}
          title={title}
          loading="lazy"
          onLoad={measure}
          style={{
            width: `${width}px`,
            height: `${frameHeight}px`,
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </figure>
  );
}

interface AtEveryWidthProps {
  /** The story to show, as in <Canvas of={…} />. */
  of: Of;
  /**
   * The height of every frame in px. Leave it out and each frame takes its story's height; set
   * it for a story that opens something in the top layer (a sheet, a dialog), which takes no
   * room in the page.
   */
  height?: number;
}

/**
 * One story at the three widths Plinth is checked at (390, 768 and 1440 px), each in its own
 * frame with real media queries, scaled to fit the docs column, in dark or light.
 */
export function AtEveryWidth({ of, height }: AtEveryWidthProps) {
  const { story } = useOf(of, ['story']);
  const globals = usePageGlobals();
  const [theme, setTheme] = useState<Theme>(globals.theme);

  // The toolbar's theme switch moves the block too; its own buttons override it.
  useEffect(() => setTheme(globals.theme), [globals.theme]);

  return (
    <section
      className="sb-every-width sb-unstyled"
      data-theme={theme}
      aria-label={`${story.name} at every width`}
    >
      <div className="sb-every-width-bar">
        <p className="sb-every-width-title">At every width</p>
        <div className="sb-every-width-themes" role="group" aria-label="Theme">
          {themes.map((value) => (
            <button
              key={value}
              type="button"
              className="plinth-button"
              data-variant={value === theme ? 'secondary' : 'ghost'}
              data-size="sm"
              aria-pressed={value === theme}
              onClick={() => setTheme(value)}
            >
              <span className="plinth-button-label">{value === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sb-every-width-grid">
        {widths.map(({ width, label }) => (
          <Frame
            key={width}
            src={frameUrl(story.id, { ...globals, theme })}
            title={`${story.title} / ${story.name}, ${label.toLowerCase()} (${width}px), ${theme}`}
            label={label}
            width={width}
            height={height}
          />
        ))}
      </div>
    </section>
  );
}
