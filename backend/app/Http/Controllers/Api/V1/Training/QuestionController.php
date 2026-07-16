<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Question;
use App\Http\Resources\V1\Training\QuestionResource;
use App\Http\Requests\Api\V1\Training\ApiQuestionRequest;
use App\Services\BaseCrud\BaseCrud;

class QuestionController extends BaseCrud {

public $model = Question::class;
public $resource = QuestionResource::class;
public $storeValidator = ApiQuestionRequest::class;
public $updateValidator = ApiQuestionRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;


}
