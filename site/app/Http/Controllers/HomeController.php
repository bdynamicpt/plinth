<?php

namespace App\Http\Controllers;

use App\Decisions\Decisions;
use App\Snippets;
use Illuminate\Contracts\View\View;

final class HomeController
{
    public function __invoke(Decisions $decisions, Snippets $snippets): View
    {
        return view('home', [
            'decisions' => $decisions->latest(4),
            'layers' => [
                'Blade' => $snippets->get('button.blade.php'),
                'Vue' => $snippets->get('button.vue'),
                'React' => $snippets->get('button.jsx'),
            ],
            'html' => $snippets->get('button.html'),
            'brand' => $snippets->get('brand.css'),
        ]);
    }
}
