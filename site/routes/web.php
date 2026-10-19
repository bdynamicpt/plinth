<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\StorybookController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/storybook', StorybookController::class)->name('storybook');
