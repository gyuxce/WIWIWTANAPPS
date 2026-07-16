<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Requests\Api\V1\Master\ApiSeminarRequest;
use App\Http\Resources\V1\Master\SeminarResource;
use App\Models\Base\File;
use App\Models\Master\Seminar;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SeminarController extends BaseCrud
{
    use HasLogHelper;
    public $model = Seminar::class;
    public $resource = SeminarResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiSeminarRequest::class;
    public $updateValidator = ApiSeminarRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        $startedAt = request('started_at');
        $finishedAt = request('finished_at');
        if($startedAt) {
            $this->query = $this->query->where('started_at', '>=', Carbon::parse($startedAt)->startOfDay()->format('Y-m-d H:i:s'));
        }
        if($finishedAt) {
            $this->query = $this->query->where('finished_at', '<=', Carbon::parse($finishedAt)->endOfDay()->format('Y-m-d H:i:s'));
        }
        
        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        $data['cover_id'] = File::getId($data['cover_id']);

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
}
