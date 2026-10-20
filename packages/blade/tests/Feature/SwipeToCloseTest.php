<?php

use BDynamic\Plinth\Support\SwipeToClose;

it('is the Vue and React layers\' swipeToClose, as an Alpine x-init', function () {
    $vue = (string) file_get_contents(dirname(__DIR__, 3).'/vue/src/swipe.ts');

    // The same steps as the Vue layer: the checks, the listeners and the scroll to a snap point.
    foreach ([
        "getComputedStyle(dialog).scrollSnapType.startsWith('y')",
        'panel.getBoundingClientRect().top >= dialog.getBoundingClientRect().bottom - 1',
        "'onscrollend' in window ? 'scrollend' : 'scroll'",
        'if (dialog.requestClose) dialog.requestClose();',
        'if (dialog.open) dialog.scrollTop = 0;',
        "event.target === dialog && dragging() && dialog.getAttribute('closedby') === 'any'",
        "{ peek: handle, half: header }[dialog.dataset.snap ?? '']",
        'parseFloat(getComputedStyle(area).scrollMarginBlockStart)',
    ] as $step) {
        expect($vue)->toContain($step)
            ->and(SwipeToClose::ALPINE)->toContain($step);
    }

    expect(SwipeToClose::ALPINE)->toStartWith('((dialog) => {')->toEndWith('})($el)');
});
