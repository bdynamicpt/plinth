<?php

use App\Http\Controllers\DecisionsController;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\StorybookController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/storybook', StorybookController::class)->name('storybook');

Route::redirect('/docs', '/docs/introduction')->name('docs');
Route::get('/docs/decisions', [DecisionsController::class, 'index'])->name('decisions.index');
Route::get('/docs/decisions/{slug}', [DecisionsController::class, 'show'])->where('slug', '\d{4}-[a-z0-9-]+')->name('decisions.show');
Route::get('/docs/{slug}', DocsController::class)->where('slug', '[a-z0-9-]+')->name('docs.show');
