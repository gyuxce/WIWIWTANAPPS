<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Requests\Api\V1\Forum\ApiForumTopicRequest;
use App\Http\Resources\V1\Forum\ForumTopicResource;
use App\Models\Forum\ForumTopic;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;

class ForumTopicController extends BaseCrud
{
    use HasLogHelper;
    public $model = ForumTopic::class;
    public $resource = ForumTopicResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiForumTopicRequest::class;
    public $updateValidator = ApiForumTopicRequest::class;
    public $defaultOrder = "index";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __afterStore()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __beforeDestroy()
    {  
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "deleted", null);
    }

    public function __prepareDataStore($data)
    {
        $data['count_post'] = $this->requestData['count_post'] ?? 0;

        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data['count_post'] = $this->requestData['count_post'] ?? $this->row->count_post;

        return $data;
    }

}