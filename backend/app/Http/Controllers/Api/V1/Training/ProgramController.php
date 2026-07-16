<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Program;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Requests\Api\V1\Training\ApiProgramRequest;
use App\Services\BaseCrud\BaseCrud;

class ProgramController extends BaseCrud {

public $model = Program::class;
public $resource = ProgramResource::class;
public $storeValidator = ApiProgramRequest::class;
public $updateValidator = ApiProgramRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}