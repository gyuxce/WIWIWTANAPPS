<?php

use App\Http\Controllers\Api\V1\Base\ConstantController;
use App\Http\Controllers\Api\V1\Dolphin\AuthController;
use App\Http\Controllers\Api\V1\Dolphin\DolphinUserController;
use App\Http\Controllers\Api\V1\Dolphin\PasswordController;
use App\Http\Controllers\Api\V1\Base\UserController;
use App\Http\Middleware\Dolphin;
use Illuminate\Support\Facades\Route;

Route::group([], __DIR__.'/Base/route.php');
Route::group([], __DIR__.'/Master/route.php');
Route::group([], __DIR__.'/Forum/route.php');
Route::group([], __DIR__.'/Training/route.php');
Route::group([], __DIR__.'/Finance/route.php');

Route::prefix("auth")->group(function () {
    Route::post('/sign-up', [AuthController::class, 'signUp']);
    Route::post('/sign-in', [AuthController::class, 'signIn']);
    Route::post('/sign-out', [AuthController::class, 'signOut']);
    Route::post('/{adapter}/verify', [AuthController::class, 'adapterVerify']);
    Route::get('/user/activate/{uuid}', [UserController::class, 'activateAccount']);
    Route::get('/user/me', [DolphinUserController::class, 'profile'])->middleware(Dolphin::class);
    Route::post('/user/connect-account', [UserController::class, 'connectAccount'])->middleware(Dolphin::class);
    Route::post('/social-account', [AuthController::class, 'socialLogin']);
});

Route::prefix("passwords")->group(function () {
    Route::post('/forgot-password', [PasswordController::class, 'forgotPassword']);
    Route::post('/reset-password/{token}', [PasswordController::class, 'resetPassword']);
});

Route::prefix("tokens")->group(function () {
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

Route::prefix("constants")->group(function () {
    Route::get('/', [ConstantController::class, 'getConstants']);
});