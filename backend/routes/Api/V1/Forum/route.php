<?php

use App\Http\Controllers\Api\V1\Forum\ForumCommentController;
use App\Http\Controllers\Api\V1\Forum\ForumReportController;
use App\Http\Controllers\Api\V1\Forum\ForumTopicController;
use App\Http\Controllers\Api\V1\Forum\ForumPostController;
use App\Http\Controllers\Api\V1\Forum\ForumLikeController;
use App\Http\Controllers\Api\V1\Forum\MyForumPostController;
use App\Http\Middleware\Dolphin;
use App\Http\Middleware\MobileAccess;
use App\Http\Middleware\CmsAccess;
use Illuminate\Support\Facades\Route;

Route::prefix("mobile")->group(function () {
    Route::prefix("forum")->group(function () {

        Route::prefix("topics")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/', [ForumTopicController::class, 'index']);
        });

        Route::prefix("my-posts")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/', [MyForumPostController::class, 'index']);
        });

        Route::prefix("posts")->group(function () {
            Route::get('/{id}', [ForumPostController::class, 'show'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::get('/', [ForumPostController::class, 'index'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::post('/', [ForumPostController::class, 'store'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::put('/{id}', [ForumPostController::class, 'update'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::delete('/{id}', [ForumPostController::class, 'destroy'])->middleware([Dolphin::class, MobileAccess::class]);
        });

        Route::prefix("comments")->group(function () {
            Route::get('/', [ForumCommentController::class, 'index'])->middleware([Dolphin::class, MobileAccess::class]);;
            Route::get('/childs', [ForumCommentController::class, 'getChild'])->middleware([Dolphin::class, MobileAccess::class]);;
            Route::get('/{id}', [ForumCommentController::class, 'show'])->middleware([Dolphin::class, MobileAccess::class]);;
            Route::post('/', [ForumCommentController::class, 'store'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::put('/{id}', [ForumCommentController::class, 'update'])->middleware([Dolphin::class, MobileAccess::class]);
            Route::delete('/{id}', [ForumCommentController::class, 'destroy'])->middleware([Dolphin::class, MobileAccess::class]);
        });

        Route::prefix("likes")->middleware([Dolphin::class, MobileAccess::class])-> group(function(){
            Route::post('/', [ForumLikeController::class, 'store']);
            Route::delete('/{id}', [ForumLikeController::class, 'destroy']);
        });

        Route::prefix("reports")->middleware([Dolphin::class, MobileAccess::class])-> group(function(){
            Route::get('/{id}', [ForumReportController::class, 'show']);
            Route::post('/', [ForumReportController::class, 'store']);
        });

    });
});

Route::prefix("cms")->group(function () {
    Route::prefix("forum")->group(function () {

        Route::prefix("topics")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [ForumTopicController::class, 'index']);
            Route::post('/', [ForumTopicController::class, 'store']);
            Route::put('/{id}', [ForumTopicController::class, 'update']);
        });

        Route::prefix("posts")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [ForumPostController::class, 'index']);
            Route::get('/myposts', [ForumPostController::class, 'myPosts']);
            Route::get('/{id}', [ForumPostController::class, 'show']);
            Route::post('/', [ForumPostController::class, 'store']);
            Route::put('/{id}', [ForumPostController::class, 'update']);
            Route::post('/{id}', [ForumPostController::class, 'destroy']);
        });

        Route::prefix("comments")->group(function () {
            Route::get('/', [ForumCommentController::class, 'index']);
            Route::get('/childs', [ForumCommentController::class, 'getChild']);
            Route::get('/{id}', [ForumCommentController::class, 'show']);
            Route::post('/', [ForumCommentController::class, 'store'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::put('/{id}', [ForumCommentController::class, 'update'])->middleware([Dolphin::class, CmsAccess::class]);
            Route::delete('/{id}', [ForumCommentController::class, 'destroy'])->middleware([Dolphin::class, CmsAccess::class]);
        });

        Route::prefix("likes")->middleware([Dolphin::class, CmsAccess::class])-> group(function(){
            Route::post('/', [ForumLikeController::class, 'store']);
            Route::delete('/{id}', [ForumLikeController::class, 'destroy']);
        });

        Route::prefix("reports")->middleware([Dolphin::class, CmsAccess::class])-> group(function(){
            Route::get('/', [ForumReportController::class, 'index']);
            Route::get('/export', [ForumReportController::class, 'export']);
            Route::get('/{id}', [ForumReportController::class, 'show']);
            Route::delete('/{id}', [ForumReportController::class, 'destroy']);
            Route::post('/warn', [ForumReportController::class, 'reportWarn']);
        });

    });
});

Route::prefix("public")->group(function () {
    Route::prefix("forum")->group(function () {
        Route::prefix("posts")->group(function () {
            Route::get('/', [ForumPostController::class, 'index']);
            Route::get('/{id}', [ForumPostController::class, 'show']);
        });
    });
});
