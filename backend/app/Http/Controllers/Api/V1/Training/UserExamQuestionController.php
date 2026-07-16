<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\UserExamQuestion;
use App\Http\Resources\V1\Training\UserExamQuestionResource;
use App\Http\Requests\Api\V1\Training\ApiUserExamQuestionRequest;
use App\Services\BaseCrud\BaseCrud;

class UserExamQuestionController extends BaseCrud
{

    public $model = UserExamQuestion::class;
    public $resource = UserExamQuestionResource::class;
    public $storeValidator = ApiUserExamQuestionRequest::class;
    public $updateValidator = ApiUserExamQuestionRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
}
