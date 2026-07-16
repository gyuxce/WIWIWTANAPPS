<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Constants\CertificationStatusConstant;
use App\Http\Requests\Api\V1\Master\ApiCertificationRequest;
use App\Http\Resources\V1\Master\CertificationResource;
use App\Models\Master\Certification;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;

class CertificationController extends BaseCrud
{
    use HasLogHelper;
    public $model = Certification::class;
    public $resource = CertificationResource::class;
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;
    public $searchAble = ["name"];

    public $storeValidator = ApiCertificationRequest::class;
    public $updateValidator = ApiCertificationRequest::class;
    

    public function __beforeDestroy()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "deleted", null);
    }

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
            $ress->status_label = CertificationStatusConstant::LIST[$row->status] ?? "-";
            return $ress;
        });

        $fields = [
            "name",
            "description",
            "detail",
            "link",
            "status_label",
            "created_at",
        ];

        $headings = [
            "Nama Sertifikasi",
            "Deskripsi",
            "Detail",
            "Link",
            "Status",
            "Dibuat"
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

}