/*
 * The site's few behaviours, as Alpine components: the theme switch, the copy buttons, the
 * header that sits over the hero and the components' playground. Everything works without them except what they add.
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

/*
 * A component's playground: each choice is a link to the page with a query string. This loads it
 * and swaps the playground in place, keeping the tab of code that shows and the focus, instead of
 * loading the whole page.
 */
Alpine.data('playground', () => ({
    init() {
        this.$el.addEventListener('click', (event) => {
            const link = event.target.closest('a.plinth-pill');
            if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            this.load(link);
        });
    },

    async load(link) {
        const url = new URL(link.href);
        const key = `${link.closest('.plinth-pill-row').getAttribute('aria-labelledby')} ${link.textContent.trim()}`;
        const tabs = [...this.$el.querySelectorAll('.plinth-code-block-tab-input')];
        const tab = tabs.findIndex((input) => input.checked);
        this.$el.setAttribute('aria-busy', 'true');

        let next;
        try {
            const response = await fetch(url, { headers: { Accept: 'text/html' } });
            if (!response.ok) throw new Error(response.statusText);
            const page = new DOMParser().parseFromString(await response.text(), 'text/html');
            next = page.getElementById('playground');
        } catch {
            next = null;
        }

        if (!next) {
            window.location.assign(url);
            return;
        }

        this.$el.removeAttribute('aria-busy');
        for (const part of ['.site-playground-stage', '.site-playground-controls', '.site-demo-code']) {
            this.$el.querySelector(part).replaceWith(document.importNode(next.querySelector(part), true));
        }
        history.replaceState(history.state, '', url);

        const inputs = this.$el.querySelectorAll('.plinth-code-block-tab-input');
        if (inputs[tab]) inputs[tab].checked = true;
        const pills = this.$el.querySelectorAll('a.plinth-pill');
        [...pills]
            .find(
                (pill) =>
                    `${pill.closest('.plinth-pill-row').getAttribute('aria-labelledby')} ${pill.textContent.trim()}` ===
                    key,
            )
            ?.focus();
    },
}));

Alpine.start();
