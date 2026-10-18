import { tokens, type Token } from '@bdynamic/plinth-tokens';
import type { CSSProperties } from 'react';

/** Tokens of a tier whose path starts with the given segments. */
export function group(tier: Token['tier'], ...path: string[]): Token[] {
  return tokens.filter((t) => t.tier === tier && path.every((segment, i) => t.path[i] === segment));
}

/** A preview of a token, drawn with its var(), for the tables on the foundations pages. */
function Preview({ token }: { token: Token }) {
  const v = token.cssVar;
  const [first] = token.path[0] === 'ref' ? token.path.slice(1) : token.path;
  const box: CSSProperties = {
    inlineSize: '4rem',
    blockSize: '2.5rem',
    background: 'var(--plinth-color-surface-sunken)',
    border: '1px solid var(--plinth-color-border-strong)',
  };
  switch (token.type) {
    case 'shadow':
      return <div style={{ ...box, background: '#fff', border: 0, boxShadow: v }} />;
    case 'fontFamily':
      return <span style={{ fontFamily: v }}>The quick brown fox</span>;
    case 'fontWeight':
      return <span style={{ fontWeight: v }}>Plinth</span>;
    case 'dimension':
      if (first === 'radius') return <div style={{ ...box, borderRadius: v }} />;
      if (first === 'font') return <span style={{ fontSize: v, lineHeight: 1.2 }}>Plinth</span>;
      if (first === 'breakpoint' || first === 'focus-ring') return null;
      return (
        <div
          style={{ inlineSize: v, blockSize: '0.75rem', background: 'var(--plinth-color-accent)' }}
        />
      );
    default:
      return null;
  }
}

/** "0.875rem" as "14px", for a second column next to rem values. */
const px = (value: string) =>
  value.endsWith('rem') ? `${parseFloat(value) * 16}px` : value.endsWith('px') ? value : '';

/**
 * The type scale: each size's token, its value in rem and px, and a sample at that size. Samples
 * share one left edge and wrap rather than truncate.
 */
export function TypeScale({ list, family }: { list: Token[]; family?: string }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Size</th>
          <th style={{ textAlign: 'start' }}>Sample</th>
        </tr>
      </thead>
      <tbody>
        {list.map((t) => (
          <tr key={t.name}>
            <td style={{ whiteSpace: 'nowrap' }}>
              <code>{t.name}</code>
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>
              {t.value}
              <br />
              {px(t.value)}
            </td>
            <td style={{ textAlign: 'start' }}>
              <span style={{ fontSize: t.cssVar, lineHeight: 1.25, fontFamily: family }}>
                Plinth design system
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A docs table of tokens: name, preview, value (light and dark when they differ), what it uses. */
export function TokenTable({ list }: { list: Token[] }) {
  const themed = list.some((t) => t.dark !== undefined);
  const previews = list.some((t) => Preview({ token: t }) !== null);
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          {previews && <th>Preview</th>}
          <th>{themed ? 'Light' : 'Value'}</th>
          {themed && <th>Dark</th>}
        </tr>
      </thead>
      <tbody>
        {list.map((t) => (
          <tr key={t.name}>
            <td style={{ whiteSpace: 'nowrap' }}>
              <code>{t.name}</code>
            </td>
            {previews && (
              <td>
                <Preview token={t} />
              </td>
            )}
            <td>
              {t.value}
              {t.ref && (
                <>
                  <br />
                  <code>{t.ref}</code>
                </>
              )}
            </td>
            {themed && (
              <td>
                {t.dark}
                {t.darkRef && (
                  <>
                    <br />
                    <code>{t.darkRef}</code>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
