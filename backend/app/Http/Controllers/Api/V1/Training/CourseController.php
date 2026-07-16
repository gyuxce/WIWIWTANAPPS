<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\Course;
use App\Http\Resources\V1\Training\CourseResource;
use App\Http\Requests\Api\V1\Training\ApiCourseRequest;
use App\Services\BaseCrud\BaseCrud;
use App\Constants\Training\CourseTypeConstant;
use App\Models\Base\File;
use App\Services\BaseCrud\Traits\HasLogHelper;

class CourseController extends BaseCrud
{
    use HasLogHelper;

    public $model = Course::class;
    public $resource = CourseResource::class;
    public $searchAble = ["title"];

    public $storeValidator = ApiCourseRequest::class;
    public $updateValidator = ApiCourseRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareDataStore($data)
    {
        $data['cover_id'] = isset($data['cover_id']) ? File::getId($data['cover_id']) : null;
        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        unset($data["created_by"]);
        $data['cover_id'] = isset($data['cover_id']) ? File::getId($data['cover_id']) : null;
        return $data;
    }

    public function export(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();

        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->type = CourseTypeConstant::LIST[$row->type] ?? null;
            return $ress;
        });

        $fields = [
            "title",
            "type",
        ];

        $headings = [
            "Kategori Modul",
            "Tipe Pembelajaran",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function __afterStore()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->title];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->title];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }
}
