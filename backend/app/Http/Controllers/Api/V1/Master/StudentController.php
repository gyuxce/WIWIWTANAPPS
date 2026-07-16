<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Http\Requests\Api\V1\Master\ApiStudentRequest;
use App\Http\Resources\V1\Master\StudentResource;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Models\Master\Cities;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Str;

class StudentController extends BaseCrud
{
    use HasLogHelper;
    public $model = User::class;
    public $resource = StudentResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiStudentRequest::class;
    public $updateValidator = ApiStudentRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        $filterDate = request('created_at');
        if($filterDate != null) {
            $date = explode(',', $filterDate);
            $this->query = $this->query->where('created_at', '>=', $date[0]." 00:00:00")->where('created_at', '<=', $date[1]." 23:59:59");
        }

        $this->query = $this->query->whereNull('role_id');
    }

    public function __prepareDataStore($data)
    {
        $data['city_id'] = $data['city_id'] != null ? Cities::getId($data['city_id']) : null;
        $data['certificate_id'] = $data['certificate_id'] != null ? File::getId($data['certificate_id']) : null;
        $data['cv_id'] = $data['cv_id'] != null ? File::getId($data['cv_id']) : null;
        // $data['role_id'] = Role::getId($data['role_id']);

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
        $this->row->update([
            "email" => $this->row->email . "-deleted-" . $this->row->id,
            "username" => $this->row->username . "-deleted-" . $this->row->id
        ]);

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "deleted", null);
    }

    public function changeStatus(\Illuminate\Http\Request $request, $uuid)
    {
        if($request->input('is_active') == 1) {
            $val = true;
        } elseif ($request->input('is_active') == 0) {
            $val = false;
        } else {
            abort(400, "Cek inputan anda");
        }

        $user = User::getFirst($uuid);
        
        if (!$user) {
            abort(404, __('messages.user_not_found'));
        }

        $user->update([
            "is_active" => $val,
        ]);

        return $this->__success();
    }
}
