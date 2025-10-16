<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModuleController;



Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/user/{user}/module/{module}', [ModuleController::class, 'toggleModule'])->middleware('auth:sanctum');

Route::get('/protected-route', function () {
    return response()->json(['message' => 'Accès autorisé']);
})->middleware(['auth:sanctum', 'checkModule:URL_Shortener']);

use App\Http\Controllers\ShortUrlController;

Route::middleware(['auth:sanctum', 'checkModule:url_shortener'])->group(function () {
    Route::post('/short-url', [ShortUrlController::class, 'create']);
    Route::get('/short-url/{shortCode}/stats', [ShortUrlController::class, 'stats']);
});

use App\Http\Controllers\WalletController;

Route::middleware(['auth:sanctum', 'checkModule:wallet'])->group(function () {
    Route::get('/wallet/balance', [WalletController::class, 'balance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/transfer', [WalletController::class, 'transfer']);
    Route::get('/wallet/history', [WalletController::class, 'history']);
});