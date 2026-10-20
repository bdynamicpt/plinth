/*
 * The site's few behaviours, as Alpine components: the theme switch, the copy buttons, the
 * header that sits over the hero, the search, the home page's brand switcher and the components'
 * playground. Everything works without them except what they add.
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

/* The search shortcut, as the keyboard in front of the reader writes it. */
const apple = /Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform ?? navigator.platform);

Alpine.data('shortcut', () => ({
    label: apple ? '⌘K' : 'Ctrl K',
}));

/*
 * The search (⌘K): the index is loaded once, the first time the sheet takes focus; every word of
 * the query must appear in an entry, and a match in the title counts most. Results are grouped by
 * section, the group with the best match first. The arrow keys move between the field and the
 * results, Enter in the field opens the first one, and ⌘K or Ctrl+K opens and closes the sheet.
 */
const perGroup = 6;

Alpine.data('siteSearch', (url) => ({
    query: '',
    entries: null,
    order: [],
    failed: false,

    init() {
        window.addEventListener('keydown', (event) => {
            if (
                !(event.metaKey || event.ctrlKey) ||
                event.altKey ||
                event.key.toLowerCase() !== 'k'
            )
                return;
            event.preventDefault();
            if (this.$root.open) {
                this.$root.close();
            } else {
                this.$root.showModal();
            }
        });
    },

    async load() {
        try {
            const response = await fetch(url, { headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error(response.statusText);
            const index = await response.json();
            this.order = index.groups;
            this.entries = index.entries.map((entry) => ({
                ...entry,
                search: {
                    title: entry.title.toLowerCase(),
                    detail: entry.detail.toLowerCase(),
                    text: entry.text.toLowerCase(),
                },
            }));
        } catch {
            this.failed = true;
        }
    },

    get words() {
        return this.query.toLowerCase().split(/\s+/).filter(Boolean);
    },

    get groups() {
        const words = this.words;
        if (!this.entries || words.length === 0) return [];
        const phrase = words.join(' ');
        const groups = new Map();

        for (const entry of this.entries) {
            const { title, detail, text } = entry.search;
            let score = title === phrase ? 100 : title.startsWith(phrase) ? 40 : 0;

            for (const word of words) {
                if (title.split(/\W+/).includes(word)) score += 14;
                else if (title.includes(word)) score += 10;
                else if (detail.split(/\W+/).includes(word)) score += 12;
                else if (detail.includes(word)) score += 5;
                else if (text.includes(word)) score += 1;
                else {
                    score = 0;
                    break;
                }
            }
            if (score === 0) continue;
            // A page before its own sections, on a tie.
            if (!entry.url.includes('#')) score += 0.5;

            if (!groups.has(entry.group)) groups.set(entry.group, []);
            groups.get(entry.group).push({ ...entry, score });
        }

        return [...groups]
            .map(([name, results]) => {
                results.sort((a, b) => b.score - a.score);
                return { name, results: results.slice(0, perGroup), best: results[0].score };
            })
            .sort(
                (a, b) =>
                    b.best - a.best || this.order.indexOf(a.name) - this.order.indexOf(b.name),
            );
    },

    get status() {
        if (this.failed) return 'The search couldn’t load. Try again later.';
        if (this.words.length === 0) return 'Search the guides, the components and the decisions.';
        if (!this.entries) return 'Loading…';
        const count = this.groups.reduce((total, group) => total + group.results.length, 0);
        if (count === 0) return `Nothing found for “${this.query.trim()}”.`;
        return count === 1 ? '1 result' : `${count} results`;
    },

    links() {
        return [...this.$refs.results.querySelectorAll('a.plinth-list-row')].filter((link) =>
            link.checkVisibility(),
        );
    },

    focus(index) {
        this.links()[index]?.focus();
    },

    open(index) {
        this.links()[index]?.click();
    },

    /* Up from the first result goes back to the field. */
    step(by) {
        const links = this.links();
        const next = links.indexOf(document.activeElement) + by;
        if (next < 0) this.$root.querySelector('input').focus();
        else links[Math.min(next, links.length - 1)].focus();
    },

    /* A result can be on the page that is showing (a section of it): close the sheet on the way. */
    pick(event) {
        if (event.target.closest('a.plinth-list-row')) this.$root.close();
    },
}));

/*
 * The home page's brand switcher: the brand colour and corners picked (each pair's CSS and style
 * come from the server) and the theme, which follows the page's until one is picked.
 */
Alpine.data('brandSwitcher', (pairs, accent, corners) => ({
    accent,
    corners,
    theme: null,
    page: 'dark',

    init() {
        this.sync();
        systemDark.addEventListener('change', () => this.sync());
        new MutationObserver(() => this.sync()).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
    },

    sync() {
        this.page =
            document.documentElement.dataset.theme ?? (systemDark.matches ? 'dark' : 'light');
    },

    get pair() {
        return pairs[`${this.accent} ${this.corners}`];
    },

    get shown() {
        return this.theme ?? this.page;
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
        for (const part of [
            '.site-playground-stage',
            '.site-playground-controls',
            '.site-demo-code',
        ]) {
            this.$el
                .querySelector(part)
                .replaceWith(document.importNode(next.querySelector(part), true));
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
