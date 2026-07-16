<?php

use DolphinMicroservice\Http\Controllers\Api\V1\ChangePasswordController;
use DolphinMicroservice\Http\Controllers\Api\V1\LoginController;
use DolphinMicroservice\Http\Controllers\Api\V1\LogoutController;
use DolphinMicroservice\Http\Controllers\Api\V1\ProfileController;
use DolphinMicroservice\Http\Controllers\Api\V1\RefreshController;
use DolphinMicroservice\Http\Controllers\Api\V1\RegisterController;
use DolphinMicroservice\Http\Middleware\DolphinMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1/auth')->group(function () {
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/me', [ProfileController::class, 'index'])->middleware(DolphinMiddleware::class);
    Route::post('/register', [RegisterController::class, 'store']);
    Route::post('/logout', [LogoutController::class, 'store']);
    Route::post('/tokens/refresh-token', [RefreshController::class, 'store']);
    Route::post('/change-password', [ChangePasswordController::class, 'store'])->middleware(DolphinMiddleware::class);
});