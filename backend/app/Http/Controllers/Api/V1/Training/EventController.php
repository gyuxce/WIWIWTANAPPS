<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Event;
use App\Http\Resources\V1\Training\EventResource;
use App\Http\Requests\Api\V1\Training\ApiEventRequest;
use App\Services\BaseCrud\BaseCrud;

class EventController extends BaseCrud {

public $model = Event::class;
public $resource = EventResource::class;
public $storeValidator = ApiEventRequest::class;
public $updateValidator = ApiEventRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}