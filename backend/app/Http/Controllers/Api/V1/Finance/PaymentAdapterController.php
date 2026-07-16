<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\PaymentAdapter;
use App\Http\Resources\V1\Finance\PaymentAdapterResource;
use App\Http\Requests\Api\V1\Finance\ApiPaymentAdapterRequest;
use App\Services\BaseCrud\BaseCrud;

class PaymentAdapterController extends BaseCrud {

public $model = PaymentAdapter::class;
public $resource = PaymentAdapterResource::class;
public $storeValidator = ApiPaymentAdapterRequest::class;
public $updateValidator = ApiPaymentAdapterRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}