<?php

use App\Http\Controllers\Api\V1\Base\ActivityLogController;
use App\Http\Controllers\Api\V1\Base\MenuController;
use App\Http\Controllers\Api\V1\Base\SettingController;
use App\Http\Controllers\Api\V1\Sailfish\FcmController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Dolphin;
use App\Http\Middleware\CmsAccess;
use App\Http\Controllers\Api\V1\Base\UserController;
use App\Http\Controllers\Api\V1\Base\RoleController;
use App\Http\Controllers\Api\V1\Base\HarshWordController;
use App\Http\Controllers\Api\V1\Base\UserMobileUsageController;
use App\Http\Controllers\Api\V1\Base\UserProgressController;
use App\Http\Controllers\Api\V1\Dolphin\PasswordController;
use App\Http\Controllers\Api\V1\Training\DashboardController;
use App\Http\Controllers\Api\V1\Training\UserFilesController;
use App\Http\Middleware\MobileAccess;

Route::prefix("base")->group(function () {

    Route::prefix("dashboard")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
        Route::get('/statistics', [DashboardController::class, 'statisticCards']);
        Route::get('/progress', [DashboardController::class, 'progress']);
    });

    Route::prefix("filter")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
        Route::get('/users', [UserController::class, 'filter']);
        Route::get('/roles', [RoleController::class, 'filter']);
    });
    Route::prefix("users")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/remove-file/{file_id}', [UserController::class, 'deleteFileUser']);
        Route::get('/export', [UserController::class, 'export']);
        Route::get('/export/interview', [UserController::class, 'exportInterview']);
        Route::get('/progress', [UserProgressController::class, 'index']);
        Route::get('/export/progress', [UserProgressController::class, 'exportProgress']);
        Route::get('/progress/{id}', [UserController::class, 'detailProgress']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix("roles")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });

    Route::prefix("user-files")->middleware([Dolphin::class])->group(function () {
        Route::get('download/{file_id}', [UserFilesController::class, 'downloadFileUser']);
        Route::get('/', [UserFilesController::class, 'index']);
        Route::get('/{id}', [UserFilesController::class, 'show']);
        Route::post('/', [UserFilesController::class, 'store']);
        Route::put('/{id}', [UserFilesController::class, 'update']);
        Route::post('/{file_id}', [UserFilesController::class, 'deleteFileUser']);
    });

    Route::prefix("menus")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
        Route::get('/', [MenuController::class, 'index']);
    });

    Route::prefix("activity-log")->middleware(Dolphin::class)->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']);
    });

    Route::prefix("harsh-words")->middleware(Dolphin::class)->group(function () {
        Route::post('/detect', [HarshWordController::class, 'detectWords']);
        Route::get('/', [HarshWordController::class, 'index']);
        Route::get('/{id}', [HarshWordController::class, 'show']);
        Route::post('/', [HarshWordController::class, 'store']);
        Route::put('/{id}', [HarshWordController::class, 'update']);
        Route::delete('/{id}', [HarshWordController::class, 'destroy']);
    });

    Route::prefix("settings")->group(function () {
        Route::post('/change-password', [PasswordController::class, 'changePassword'])->middleware([Dolphin::class, CmsAccess::class]);
        Route::post('/update-profile', [UserController::class, 'updateProfile'])->middleware([Dolphin::class, CmsAccess::class]);
        Route::post('/update', [SettingController::class, 'updateSetting'])->middleware([Dolphin::class, CmsAccess::class]);

        Route::get('/', [SettingController::class, 'index']);
        Route::get('/{id}', [SettingController::class, 'show']);
        Route::post('/', [SettingController::class, 'store'])->middleware(CmsAccess::class);
        Route::put('/{id}', [SettingController::class, 'update'])->middleware(CmsAccess::class);
        // Route::delete('/{id}', [HarshWordController::class, 'destroy']);
    });
});

Route::prefix("mobile")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
    Route::prefix("base")->group(function () {
        Route::prefix("users")->group(function () {
            Route::post('/update-profile', [UserController::class, 'updateProfileMobile']);
            Route::prefix("user-files")->group(function () {
                Route::get('/', [UserFilesController::class, 'getUserFileStudent']);
                Route::post('/', [UserFilesController::class, 'storeUserFileMobile']);
                Route::get('download/{file_id}', [UserFilesController::class, 'downloadFileUser']);

                Route::prefix('payment')->group(function () {
                    Route::get('training-document-check', [UserFilesController::class, 'checkTrainingPaymentDocumentRequirement']);
                });
            });
            Route::post('/screentime-usage', [UserMobileUsageController::class, 'updateUserScreentimeUsage']);
            Route::post('/change-password', [PasswordController::class, 'userChangePassword']);
            Route::post('/inactivate-account', [UserController::class, 'userInactivateAccount']);
            Route::get('/progress/level', [UserProgressController::class, 'detailProgressLevel']);
        });
    });
});

Route::prefix("sailfish")->group(function () {
    Route::post('/fcm-token', [FcmController::class, 'updateFcmToken']);
    Route::post('/push-notifications', [FcmController::class, 'pushNotification']);
});
