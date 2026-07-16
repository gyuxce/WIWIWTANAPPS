<?php

use App\Http\Middleware\Dolphin;
use Illuminate\Support\Facades\Route;
use SardineMicroservice\Http\Controllers\Api\V1\FilesController;

// todo
// Route::prefix('api/v1/me')->group(function () {
//     Route::post('/change-avatar', [ProfileController::class, 'store'])->middleware(DolphinMiddleware::class);
// });

Route::prefix('api/v1/files')->group(function () {
    Route::post('/', [FilesController::class, 'store'])->middleware(Dolphin::class);
    Route::get('/{id}', [FilesController::class, 'getFiles']);
});