<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Storybook's static build, which a deploy copies into public/storybook. The web server serves its
 * files; this answers /storybook itself when the server hands it to Laravel, adding the trailing
 * slash Storybook's relative links need.
 */
final class StorybookController
{
    public function __invoke(Request $request): RedirectResponse|BinaryFileResponse
    {
        if (! str_ends_with($request->getPathInfo(), '/')) {
            return new RedirectResponse($request->getUriForPath('/storybook/'), 301);
        }

        $index = public_path('storybook/index.html');

        abort_unless(is_file($index), 404);

        return response()->file($index);
    }
}
