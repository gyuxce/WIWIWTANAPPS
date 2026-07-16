<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\BankAccount;
use App\Http\Resources\V1\Finance\BankAccountResource;
use App\Http\Requests\Api\V1\Finance\ApiBankAccountRequest;
use App\Services\BaseCrud\BaseCrud;

class BankAccountController extends BaseCrud {

public $model = BankAccount::class;
public $resource = BankAccountResource::class;
public $storeValidator = ApiBankAccountRequest::class;
public $updateValidator = ApiBankAccountRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}