<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Resources\V1\Master\CitiesResource;
use App\Models\Master\Cities;
use App\Services\BaseCrud\BaseCrud;

class CityController extends BaseCrud
{

    public $model = Cities::class;
    public $resource = CitiesResource::class;
    // public $storeValidator = ApiSparepartRequest::class;
    // public $updateValidator = ApiSparepartRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

}
