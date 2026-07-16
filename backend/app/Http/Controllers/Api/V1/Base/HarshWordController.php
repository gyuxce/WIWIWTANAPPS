<?php

namespace App\Http\Controllers\Api\V1\Base;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Services\BaseCrud\Traits\HasLogHelper;
use App\Models\Base\HarshWord;
use App\Http\Resources\V1\Base\HarshWordResource;
use App\Http\Requests\Api\V1\Base\ApiHarshWordRequest;
use App\Services\BaseCrud\BaseCrud;
use App\Services\HarshLibrary\HarshLibrary;

class HarshWordController extends BaseCrud
{
    use HasLogHelper;
    public $model = HarshWord::class;
    public $resource = HarshWordResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiHarshWordRequest::class;
    public $updateValidator = ApiHarshWordRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    private $harshLibrary;

    public function __construct()
    {
        $this->harshLibrary = new HarshLibrary();
    }

    public function __prepareDataStore($data)
    {
        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data["created_by"]);

        return $data;
    }

    public function __beforeDestroy()
    {  
         # insert to log
         $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
         $this->__insertLog($dataLog, "deleted", null);
    }

    public function detectWords(Request $request)
    {  
        $detect = $this->harshLibrary->detectHarshWord($request->sentence);
        return response()->json([
            "status" => "success",
            "result" => $detect
        ], 200);
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
}
