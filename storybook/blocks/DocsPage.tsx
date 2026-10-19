import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import { AtEveryWidth } from './AtEveryWidth.tsx';

/**
 * The page autodocs writes for a story file without its own MDX page: Storybook's default page,
 * with the main story at every width under the first example, as on the MDX pages.
 */
export function DocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <AtEveryWidth of="story" />
      <Stories />
    </>
  );
}
