<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\Bank;
use App\Http\Resources\V1\Finance\BankResource;
use App\Http\Requests\Api\V1\Finance\ApiBankRequest;
use App\Services\BaseCrud\BaseCrud;

class BankController extends BaseCrud {

public $model = Bank::class;
public $resource = BankResource::class;
public $storeValidator = ApiBankRequest::class;
public $updateValidator = ApiBankRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}