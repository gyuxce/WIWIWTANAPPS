<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\UserCourse;
use App\Http\Resources\V1\Training\UserCourseResource;
use App\Http\Requests\Api\V1\Training\ApiUserCourseRequest;
use App\Services\BaseCrud\BaseCrud;

class UserCourseController extends BaseCrud {

public $model = UserCourse::class;
public $resource = UserCourseResource::class;
public $storeValidator = ApiUserCourseRequest::class;
public $updateValidator = ApiUserCourseRequest::class;
public $defaultOrder = "id";
public $modelKey = "id";
public $cacheInMinute = 10;




}