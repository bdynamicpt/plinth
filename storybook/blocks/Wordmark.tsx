import { styled } from 'storybook/theming';

/**
 * The b.dynamic wordmark on the Branding page, until the logo files arrive. The page stays in
 * Storybook's docs theme whatever the system's colour scheme, so the wordmark takes that theme's
 * text colour, not Plinth's (which follows the system and would be near white on the white page).
 */
export const Wordmark = styled.div(({ theme }) => ({ color: theme.color.defaultText }));
