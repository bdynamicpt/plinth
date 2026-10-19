/**
 * Stylelint for the site's own CSS: the repository's component rules (tokens only, logical
 * properties, mobile first, no !important), with site-* classes instead of plinth-* ones, and
 * --site-* custom properties for the site's own values.
 */
import base from '../stylelint.config.js';

/** @type {import('stylelint').Config} */
export default {
    ...base,
    rules: {
        ...base.rules,
        'selector-class-pattern': [
            '^(site-[a-z0-9]+(-[a-z0-9]+)*|is-[a-z0-9]+(-[a-z0-9]+)*)$',
            { message: 'Use site-part or an is-* state class' },
        ],
        'custom-property-pattern': [
            '^(plinth|site)-[a-z0-9]+(-[a-z0-9]+)*$',
            { message: 'Custom properties start with --plinth- (tokens) or --site-' },
        ],
    },
};
