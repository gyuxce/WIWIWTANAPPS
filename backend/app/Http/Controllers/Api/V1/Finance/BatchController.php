<?php

namespace App\Http\Controllers\Api\V1\Finance;

use App\Models\Finance\Batch;
use App\Http\Resources\V1\Finance\BatchResource;
use App\Http\Requests\Api\V1\Finance\ApiBatchRequest;
use App\Services\BaseCrud\BaseCrud;

class BatchController extends BaseCrud {

public $model = Batch::class;
public $resource = BatchResource::class;
public $storeValidator = ApiBatchRequest::class;
public $updateValidator = ApiBatchRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}