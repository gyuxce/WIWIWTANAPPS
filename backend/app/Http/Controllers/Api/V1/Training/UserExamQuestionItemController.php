<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\UserExamQuestionItem;
use App\Http\Resources\V1\Training\UserExamQuestionItemResource;
use App\Http\Requests\Api\V1\Training\ApiUserExamQuestionItemRequest;
use App\Services\BaseCrud\BaseCrud;

class UserExamQuestionItemController extends BaseCrud {

public $model = UserExamQuestionItem::class;
public $resource = UserExamQuestionItemResource::class;
public $storeValidator = ApiUserExamQuestionItemRequest::class;
public $updateValidator = ApiUserExamQuestionItemRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}