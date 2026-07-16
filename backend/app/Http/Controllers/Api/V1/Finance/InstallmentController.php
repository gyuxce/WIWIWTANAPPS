<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\Installment;
use App\Http\Resources\V1\Finance\InstallmentResource;
use App\Http\Requests\Api\V1\Finance\ApiInstallmentRequest;
use App\Services\BaseCrud\BaseCrud;

class InstallmentController extends BaseCrud {

    public $model = Installment::class;
    public $resource = InstallmentResource::class;
    public $storeValidator = ApiInstallmentRequest::class;
    public $updateValidator = ApiInstallmentRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "id";
    public $cacheInMinute = 10;


}