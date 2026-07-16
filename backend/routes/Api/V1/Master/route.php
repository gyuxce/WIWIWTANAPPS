<?php

use App\Http\Controllers\Api\V1\Master\CertificationController;
use App\Http\Controllers\Api\V1\Master\CertificationStudentController;
use App\Http\Controllers\Api\V1\Master\CityController as CitiesController;
use App\Http\Controllers\Api\V1\Master\ContentNotificationController;
use App\Http\Controllers\Api\V1\Master\ContentNotificationLogController;
use App\Http\Controllers\Api\V1\Master\NotificationController;
use App\Http\Controllers\Api\V1\Master\ProvinceController;
use App\Http\Controllers\Api\V1\Master\StudentController;
use App\Http\Controllers\Api\V1\Master\SeminarController;
use App\Http\Middleware\Dolphin;
use App\Http\Middleware\CmsAccess;
use App\Http\Middleware\MobileAccess;
use Illuminate\Support\Facades\Route;

Route::prefix("master")->group(function () {

    Route::prefix("provinces")->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
    });
    Route::prefix("cities")->group(function () {
        Route::get('/', [CitiesController::class, 'index']);
    });

    Route::prefix("student")->middleware([CmsAccess::class, Dolphin::class])->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('cms.student.list');
        Route::get('/{id}', [StudentController::class, 'show'])->name('cms.student.detail');
        Route::post('/change-status/{id}', [StudentController::class, 'changeStatus']);
        // Route::post('/', [StudentController::class, 'store'])->name('cms.student.store');
        Route::put('/{id}', [StudentController::class, 'update'])->name('cms.student.update');
        Route::delete('/{id}', [StudentController::class, 'destroy'])->name('cms.student.delete');
    });

    Route::prefix("content-notifications")->middleware([Dolphin::class])->group(function () {
        Route::get('/', [ContentNotificationController::class, 'index']);
        Route::get('/{id}', [ContentNotificationController::class, 'show']);
        Route::post('/', [ContentNotificationController::class, 'store']);
        Route::put('/{id}', [ContentNotificationController::class, 'update']);
        Route::delete('/{id}', [ContentNotificationController::class, 'destroy']);
    });

    Route::prefix("content-notification-sent")->group(function () {
        Route::get('/', [ContentNotificationLogController::class, 'index']);
    });

    Route::prefix("notifications")->middleware(Dolphin::class)->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/total', [NotificationController::class, 'totalNotifications']);
        Route::post('/read/{id}', [NotificationController::class, 'read']);
    });
});

Route::prefix("mobile")->group(function () {
    Route::prefix("master")->group(function () {
        Route::prefix("certifications")->group(function () {
            Route::get('/', [CertificationController::class, 'index'])->middleware([Dolphin::class]);
            Route::get('/{id}', [CertificationController::class, 'show'])->middleware([Dolphin::class]);
        });
        Route::prefix("certification-students")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/', [CertificationStudentController::class, 'index']);
            Route::post('/', [CertificationStudentController::class, 'store']);
        });
    });
    Route::prefix("notifications")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/total', [NotificationController::class, 'totalNotifications']);
        Route::post('/read/{id}', [NotificationController::class, 'read']);
    });
});

Route::prefix("cms")->group(function () {
    Route::prefix("master")->group(function () {
        Route::prefix("seminar")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [SeminarController::class, 'index']);
            Route::get('/{id}', [SeminarController::class, 'show']);
            Route::post('/', [SeminarController::class, 'store']);
            Route::put('/{id}', [SeminarController::class, 'update']);
            Route::delete('/{id}', [SeminarController::class, 'destroy']);
        });

        Route::prefix("certifications")->group(function () {
            Route::get('/', [CertificationController::class, 'index'])->middleware([Dolphin::class]);
            Route::get('/export', [CertificationController::class, 'export'])->middleware([Dolphin::class]);
            Route::get('/{id}', [CertificationController::class, 'show'])->middleware([Dolphin::class]);
            Route::post('/', [CertificationController::class, 'store'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::put('/{id}', [CertificationController::class, 'update'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::delete('/{id}', [CertificationController::class, 'destroy'])->middleware([Dolphin::class, CmsAccess::class]);
        });

        Route::prefix("certification-students")->group(function () {
            Route::get('/', [CertificationStudentController::class, 'index'])->middleware([Dolphin::class]);
            Route::get('/export', [CertificationStudentController::class, 'export'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::get('/{id}', [CertificationStudentController::class, 'show'])->middleware([Dolphin::class]);
            Route::post('/change-status/{id}', [CertificationStudentController::class, 'changeStatus'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::delete('/{id}', [CertificationStudentController::class, 'destroy'])->middleware([Dolphin::class, CmsAccess::class]);
        });
    });
});

Route::prefix("public")->group(function () {
    Route::prefix("master")->group(function () {
        Route::prefix("seminar")->group(function () {
            Route::get('/', [SeminarController::class, 'index']);
            Route::get('/{id}', [SeminarController::class, 'show']);
        });
    });
});
