<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\CourseItem;
use App\Models\Training\Event;
use App\Models\Base\File;
use App\Http\Resources\V1\Training\EventResource;
use App\Http\Requests\Api\V1\Training\ApiEventRequest;
use App\Services\BaseCrud\BaseCrud;

class CourseItemVirtualClassController extends BaseCrud
{

    public $model = Event::class;
    public $resource = EventResource::class;
    public $searchAble = ["title"];

    public $storeValidator = ApiEventRequest::class;
    public $updateValidator = ApiEventRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        if ($parent_id = $this->requestData->get('parent')) {
            $this->query = $this->query->whereHas('courseItem', function ($qq) use ($parent_id) {
                $qq->where('parent_id', CourseItem::getId($parent_id));
            });
        }
        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        $data['recording_file_id'] = isset($data['recording_file_id']) ? File::getId($data['recording_file_id']) : null;
        $data['cover_file_id'] = isset($data['cover_file_id']) ? File::getId($data['cover_file_id']) : null;
        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data["created_by"]);

        return $data;
    }

    public function __afterStore()
    {
        $parent = CourseItem::where('uuid', $this->requestData->get("parent_id"))->first();
        $courseItem = CourseItem::query();
        $courseItemInsert = $courseItem->create([
            "parent_id" => $parent->id,
            "event_id" => $this->row->id,
            "title" => $this->row->title,
            "course_id" => $parent->course_id,
            "is_header" => null,
            "group" => 2,
            "description" => $this->row->description,
        ]);
    }

    public function __afterUpdate()
    {
        $parentId = CourseItem::getId($this->requestData->get("parent_id"));
        $courseItem = CourseItem::where('event_id', $this->row->id)->where('parent_id', $parentId)->first();
        $courseItem->update([
            "parent_id" => $parentId,
            "event_id" => $this->row->id,
            "course_id" => $courseItem->course_id,
            "is_header" => null,
            "title" => $this->row->title,
            "description" => $this->row->description,
        ]);
    }

    public function __beforeDestroy()
    {
        $courseItem = CourseItem::where('event_id', $this->row->id)->first();
        $courseItem->delete();
    }
}
