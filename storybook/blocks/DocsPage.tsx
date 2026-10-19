import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import { AtEveryWidth } from './AtEveryWidth.tsx';
import { SiteLink } from './SiteLink.tsx';

/**
 * The page autodocs writes for a story file: Storybook's default page, with a link to the
 * component's page on the website and the main story at every width under the first example.
 */
export function DocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <SiteLink />
      <Primary />
      <Controls />
      <AtEveryWidth of="story" />
      <Stories />
    </>
  );
}
