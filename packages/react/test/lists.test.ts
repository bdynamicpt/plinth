import { describe, expect, it } from 'vitest';
import * as vueButton from '../../vue/src/button.ts';
import * as vueIcon from '../../vue/src/icon.ts';
import * as vueSize from '../../vue/src/size.ts';
import * as vueTones from '../../vue/src/tones.ts';
import { buttonVariant } from '../src/button.ts';
import { classNames, hasContent } from '../src/markup.ts';
import {
  buttonVariants,
  controlSizes,
  iconSizeFor,
  iconSizes,
  resolveSize,
  sizes,
  tones,
} from '../src/index.ts';

describe('the shared lists', () => {
  it('match the Vue layer’s lists, which Blade’s enums and the stories follow', () => {
    expect(tones).toEqual(vueTones.tones);
    expect(buttonVariants).toEqual(vueButton.buttonVariants);
    expect(sizes).toEqual(vueSize.sizes);
    expect(controlSizes).toEqual(vueSize.controlSizes);
    expect(iconSizes).toEqual(vueIcon.iconSizes);
  });

  it('fall back the way the Vue layer does', () => {
    expect(buttonVariant('loud')).toBe('primary');
    expect(buttonVariant('danger-ghost')).toBe('danger-ghost');
    expect(resolveSize('xl', controlSizes, 'md')).toBe('md');
    expect(sizes.map(iconSizeFor)).toEqual(['sm', 'sm', 'md', 'md', 'md']);
  });
});

describe('the markup helpers', () => {
  it('put a project class after Plinth’s, and ignore a blank one', () => {
    expect(classNames('plinth-badge', ' ms-2 ')).toBe('plinth-badge ms-2');
    expect(classNames('plinth-badge', ' ')).toBe('plinth-badge');
    expect(classNames('plinth-badge', undefined)).toBe('plinth-badge');
  });

  it('tell a node that prints something from one that does not', () => {
    expect([null, undefined, false, true, '', '  '].map(hasContent)).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(['x', 0].map(hasContent)).toEqual([true, true]);
  });
});
