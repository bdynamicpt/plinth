/*
 * The site's few behaviours, as Alpine components: the theme switch, the copy buttons and the
 * header that sits over the hero. Everything works without them except what they add.
 */
import Alpine from 'alpinejs';

const themeKey = 'plinth-theme';
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

/* Dark or light on <html> (data-theme), remembered in localStorage; without a choice, the system's. */
Alpine.data('themeSwitch', () => ({
    dark: false,

    init() {
        this.sync();
        systemDark.addEventListener('change', () => this.sync());
    },

    sync() {
        const chosen = document.documentElement.dataset.theme;
        this.dark = chosen ? chosen === 'dark' : systemDark.matches;
    },

    toggle() {
        const theme = this.dark ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(themeKey, theme);
        } catch {
            // Storage can be blocked; the choice then lasts until the page is left.
        }
        this.dark = theme === 'dark';
    },
}));

/* Copies a command and says so for two seconds. */
Alpine.data('copyCommand', (command) => ({
    copied: false,
    timer: 0,

    async copy() {
        try {
            await navigator.clipboard.writeText(command);
        } catch {
            return;
        }
        this.copied = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.copied = false), 2000);
    },
}));

/* The home page's header has no surface over the hero, and takes one once the page scrolls. */
Alpine.data('siteHeader', () => ({
    scrolled: false,

    init() {
        this.update();
    },

    update() {
        this.scrolled = window.scrollY > 8;
    },
}));

Alpine.start();
