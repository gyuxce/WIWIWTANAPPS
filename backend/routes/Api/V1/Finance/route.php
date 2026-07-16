<?php

use Illuminate\Support\Facades\Route;

use App\Http\Middleware\Dolphin;
use App\Http\Middleware\MobileAccess;
use App\Http\Middleware\CmsAccess;
use App\Http\Controllers\Api\V1\Finance\BatchController;
use App\Http\Controllers\Api\V1\Finance\BatchUserController;
use App\Http\Controllers\Api\V1\Finance\TransactionController;
use App\Http\Controllers\Api\V1\Finance\TransactionItemController;
use App\Http\Controllers\Api\V1\Finance\PaymentAdapterController;
use App\Http\Controllers\Api\V1\Finance\PaymentController;
use App\Http\Controllers\Api\V1\Finance\PaymentProofController;
use App\Http\Controllers\Api\V1\Finance\InstallmentController;
use App\Http\Controllers\Api\V1\Finance\BankAccountController;
use App\Http\Controllers\Api\V1\Finance\BankController;
use App\Http\Controllers\Api\V1\Finance\PaymentContentController;
use App\Http\Controllers\Api\V1\Finance\PaymentContentItemController;
use App\Http\Controllers\Api\V1\Finance\PaymentPivotController;
use App\Http\Controllers\Api\V1\Finance\PriceController;

Route::prefix("pg")->group(function () {
    Route::prefix("pivot")->group(function () {
        Route::get('payment-method', [PaymentPivotController::class, 'getPaymentMethod']);
        Route::get('callback', [PaymentPivotController::class, 'callback']);
        Route::get('payment-detail/{id}', [PaymentPivotController::class, 'getPaymentDetails']);
    });
});

Route::prefix("cms")->group(function () {
    Route::prefix("finance")->group(function () {
        Route::prefix("batches")->group(function () {
            Route::get('/', [BatchController::class, 'index']);
            Route::get('/{id}', [BatchController::class, 'show']);
            Route::post('/', [BatchController::class, 'store']);
            Route::put('/{id}', [BatchController::class, 'update']);
            Route::delete('/{id}', [BatchController::class, 'destroy']);
        });
    
        Route::prefix("batch-users")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [BatchUserController::class, 'index']);
            Route::get('/export', [BatchUserController::class, 'export']);
            Route::get('/{id}', [BatchUserController::class, 'show']);
            Route::post('/', [BatchUserController::class, 'store']);
            Route::put('/{id}', [BatchUserController::class, 'update']);
            Route::delete('/{id}', [BatchUserController::class, 'destroy']);
        });
    
        Route::prefix("transactions")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [TransactionController::class, 'index']);
            Route::get('/{id}', [TransactionController::class, 'show']);
            Route::post('/', [TransactionController::class, 'store']);
            Route::put('/{id}', [TransactionController::class, 'update']);
            Route::delete('/{id}', [TransactionController::class, 'destroy']);
        });
    
        Route::prefix("transaction-items")->group(function () {
            Route::get('/', [TransactionItemController::class, 'index']);
            Route::get('/{id}', [TransactionItemController::class, 'show']);
            Route::post('/', [TransactionItemController::class, 'store']);
            Route::put('/{id}', [TransactionItemController::class, 'update']);
            Route::delete('/{id}', [TransactionItemController::class, 'destroy']);
        });
    
        Route::prefix("payment-adpaters")->group(function () {
            Route::get('/', [PaymentAdapterController::class, 'index']);
            Route::get('/{id}', [PaymentAdapterController::class, 'show']);
            Route::post('/', [PaymentAdapterController::class, 'store']);
            Route::put('/{id}', [PaymentAdapterController::class, 'update']);
            Route::delete('/{id}', [PaymentAdapterController::class, 'destroy']);
        });
    
        Route::prefix("payments")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [PaymentController::class, 'index']);
            Route::get('/{id}', [PaymentController::class, 'show']);
            Route::post('/', [PaymentController::class, 'store']);
            Route::put('/{id}', [PaymentController::class, 'update']);
            Route::delete('/{id}', [PaymentController::class, 'destroy']);
        });
    
        Route::prefix("payment-proofs")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [PaymentProofController::class, 'index']);
            Route::get('/{id}', [PaymentProofController::class, 'show']);
            Route::post('/', [PaymentProofController::class, 'store']);
            Route::put('/{id}', [PaymentProofController::class, 'update']);
            Route::put('/approval-status/{id}', [PaymentProofController::class, 'updateStatusApproval']);
            Route::delete('/{id}', [PaymentProofController::class, 'destroy']);
        });
    
        Route::prefix("installments")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [InstallmentController::class, 'index']);
            Route::get('/{id}', [InstallmentController::class, 'show']);
            Route::post('/', [InstallmentController::class, 'store']);
            Route::put('/{id}', [InstallmentController::class, 'update']);
            Route::delete('/{id}', [InstallmentController::class, 'destroy']);
        });
    
        Route::prefix("bank-accounts")->group(function () {
            Route::get('/', [BankAccountController::class, 'index']);
            Route::get('/{id}', [BankAccountController::class, 'show']);
            Route::post('/', [BankAccountController::class, 'store']);
            Route::put('/{id}', [BankAccountController::class, 'update']);
            Route::delete('/{id}', [BankAccountController::class, 'destroy']);
        });
    
        Route::prefix("banks")->group(function () {
            Route::get('/', [BankController::class, 'index']);
            Route::get('/{id}', [BankController::class, 'show']);
            Route::post('/', [BankController::class, 'store']);
            Route::put('/{id}', [BankController::class, 'update']);
            Route::delete('/{id}', [BankController::class, 'destroy']);
        });
    
        Route::prefix("prices")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [PriceController::class, 'index']);
            Route::get('/export', [PriceController::class, 'export']);
            Route::get('/{id}', [PriceController::class, 'show']);
            Route::post('/', [PriceController::class, 'store']);
            Route::put('/{id}', [PriceController::class, 'update']);
            Route::delete('/{id}', [PriceController::class, 'destroy']);
        });

        Route::prefix("payment-contents")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::get('/', [PaymentContentController::class, 'index']);
            Route::get('/{id}', [PaymentContentController::class, 'show']);
            Route::post('/', [PaymentContentController::class, 'store']);
            Route::put('/{id}', [PaymentContentController::class, 'update']);
            Route::delete('/{id}', [PaymentContentController::class, 'destroy']);
        });

        Route::prefix("payment-content-items")->middleware([Dolphin::class, CmsAccess::class])->group(function () {
            Route::post('/add/{id}', [PaymentContentItemController::class, 'addContentItem']);
            Route::get('/', [PaymentContentItemController::class, 'index']);
            Route::get('/{id}', [PaymentContentItemController::class, 'show']);
            Route::post('/', [PaymentContentItemController::class, 'store']);
            Route::put('/{id}', [PaymentContentItemController::class, 'update']);
            Route::delete('/{id}', [PaymentContentItemController::class, 'destroy']);
        });
    });
});

Route::prefix("mobile")->group(function () {
    Route::get('prices', [PriceController::class, 'index']);
    Route::prefix("finance")->group(function () {
        Route::prefix("prices")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/detail/{type}', [PriceController::class, 'getDetail']);
            Route::get('/', [PriceController::class, 'index']);
            Route::get('/{id}', [PriceController::class, 'show']);
        });

        Route::prefix("transactions")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/', [TransactionController::class, 'index']);
            Route::get('/detail', [TransactionController::class, 'getDetailPayment']);
            Route::get('/latest', [TransactionController::class, 'latest']);
            Route::get('/test', [TransactionController::class, 'testInstallmentAmountLogic']);
            Route::get('/payment/latest', [PaymentController::class, 'latest']);
            Route::get('/{id}', [TransactionController::class, 'show']);

            Route::post('/', [TransactionController::class, 'store']);            
            Route::post('/initiate', [TransactionController::class, 'initiate']);
            Route::post('/pay', [TransactionController::class, 'pay']);
            Route::post('/payment/confirm', [PaymentController::class, 'confirm']);

            Route::put('/{id}', [TransactionController::class, 'update']);
        });

        Route::prefix("payment-proofs")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::post('/', [PaymentProofController::class, 'store']);
        });

        Route::prefix("batch-users")->middleware([Dolphin::class, MobileAccess::class])->group(function () {
            Route::get('/detail', [BatchUserController::class, 'getDetailUserMobile']);
        });

        Route::prefix("payment-contents")->group(function () {
            Route::get('/show', [PaymentContentController::class, 'getDetailPaymentContentMobile']);
        });
    });
});

