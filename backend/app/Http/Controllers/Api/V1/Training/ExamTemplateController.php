<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\ExamTemplate;
use App\Http\Resources\V1\Training\ExamTemplateResource;
use App\Http\Requests\Api\V1\Training\ApiExamTemplateRequest;
use App\Models\Base\File;
use App\Services\BaseCrud\BaseCrud;

class ExamTemplateController extends BaseCrud {

    public $model = ExamTemplate::class;
    public $resource = ExamTemplateResource::class;
    public $storeValidator = ApiExamTemplateRequest::class;
    public $updateValidator = ApiExamTemplateRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareDataStore($data)
    {
        $data['video_id'] = isset($data['video_id']) ? File::getId($data['video_id']) : null;
        return $data;
    }

}
