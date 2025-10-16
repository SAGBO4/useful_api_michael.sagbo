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