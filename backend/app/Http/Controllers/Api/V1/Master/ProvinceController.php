<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Resources\V1\Master\ProvinceResource;
use App\Models\Master\Province;
use App\Services\BaseCrud\BaseCrud;

class ProvinceController extends BaseCrud
{

    public $model = Province::class;
    public $resource = ProvinceResource::class;
    // public $storeValidator = ApiSparepartRequest::class;
    // public $updateValidator = ApiSparepartRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

}