<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\TransactionItem;
use App\Http\Resources\V1\Finance\TransactionItemResource;
use App\Http\Requests\Api\V1\Finance\ApiTransactionItemRequest;
use App\Services\BaseCrud\BaseCrud;

class TransactionItemController extends BaseCrud {

public $model = TransactionItem::class;
public $resource = TransactionItemResource::class;
public $storeValidator = ApiTransactionItemRequest::class;
public $updateValidator = ApiTransactionItemRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}