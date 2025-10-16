<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShortUrlController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{shortCode}', [ShortUrlController::class, 'redirect'])->name('short-url.redirect');
