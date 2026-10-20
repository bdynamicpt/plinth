<?php

namespace BDynamic\Plinth\Support;

final class SwipeToClose
{
    /**
     * What a bottom panel on a phone needs beyond the platform (modal.css, docs/adr/0005), as the
     * x-init the dialog, sheet and drawer put on their root when they print a grab handle. It is
     * the Vue and React layers' swipeToClose(): it closes the dialog when the scrolling settles
     * with the panel off the bottom edge, closes it on a tap above the panel when it has
     * closedby="any", and opens a drawer at its data-snap point. It does nothing while the root
     * isn't a scroll-snap container (from 768px up).
     */
    public const ALPINE = '((dialog) => {'
        .' const panel = dialog.firstElementChild;'
        .' const dragging = () => getComputedStyle(dialog).scrollSnapType.startsWith(\'y\');'
        .' dialog.addEventListener(\'onscrollend\' in window ? \'scrollend\' : \'scroll\', () => {'
        .' const off = panel.getBoundingClientRect().top >= dialog.getBoundingClientRect().bottom - 1;'
        .' if (dialog.open && dragging() && off) dialog.close(); });'
        .' dialog.addEventListener(\'click\', (event) => {'
        .' if (event.target === dialog && dragging() && dialog.getAttribute(\'closedby\') === \'any\') dialog.close(); });'
        .' dialog.addEventListener(\'toggle\', (event) => {'
        .' const [handle, header] = panel.children;'
        .' const area = { peek: handle, half: header }[dialog.dataset.snap ?? \'\'];'
        .' if (event.newState !== \'open\' || !area || !dragging()) return;'
        .' const margin = parseFloat(getComputedStyle(area).scrollMarginBlockStart);'
        .' dialog.scrollTop += area.getBoundingClientRect().top - dialog.getBoundingClientRect().top - margin; });'
        .' })($el)';
}
