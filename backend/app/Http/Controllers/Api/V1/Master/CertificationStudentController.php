<?php

namespace App\Http\Controllers\Api\V1\Master;

use App\Constants\CertificationStatusConstant;
use App\Constants\CertificationStudentStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Http\Requests\Api\V1\Master\ApiCertificationRequest;
use App\Http\Requests\Api\V1\Master\ApiCertificationStudentRequest;
use App\Http\Requests\Api\V1\Master\ApiCertificationStudentStatusRequest;
use App\Http\Resources\V1\Master\CertificationStudentResource;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Models\Master\Certification;
use App\Models\Master\CertificationStudent;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Http\Request;

class CertificationStudentController extends BaseCrud
{
    use HasLogHelper;
    public $model = CertificationStudent::class;
    public $resource = CertificationStudentResource::class;
    public $searchAble = ["user.name"];
    public $defaultOrder = "id";
    public $defaultSort = 'desc';
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $storeValidator = ApiCertificationStudentRequest::class;
    public $updateValidator = ApiCertificationStudentRequest::class;
    public $updateCms = ApiCertificationStudentStatusRequest::class;

    public function __prepareQueryList()
    {
        $filterDate = request('cert_date');
        if ($filterDate != null) {
            $date = explode(',', $filterDate);
            $this->query = $this->query->where('cert_date', '>=', $date[0] . " 00:00:00")->where('cert_date', '<=', $date[1] . " 23:59:59");
        }

        if (auth()->user()->role == null) {
            $this->query = $this->query->where('user_id', auth()->user()->id ?? 0);
        }

        return $this->query;
    }

    public function __prepareDataStore($data)
    {
        if (!isset($data['status'])) {
            $data['user_id'] = User::getId($data['user_id']);
            $data['certification_id'] = Certification::getId($data['certification_id']);
            $data['cert_file_id'] = File::getId($data['cert_file_id']);
        }

        return $data;
    }

    public function __beforeStore()
    {
        # check jika tidak lulus / blm submit boleh upload kembali;
        $check = $this->model::where('user_id', auth()->user()->id ?? 0)->orderBy('id', 'desc')->first();

        if ($check != null and (((int) $check->status == CertificationStudentStatusConstant::SUCCESS or (int) $check->status == CertificationStudentStatusConstant::WAITING))) {
            return response()->json(['status' => false, "message" => "Certification anda dalam status " . CertificationStudentStatusConstant::LIST[(int) $check->status]], 400);
        }

        $check_user = User::find(auth()->user()->id);
        if ($check_user != null && ((int) $check_user->last_phase < PhaseSettingConstant::PHASE_JAPANESE_CERTIFICATION)) {
            $check_user->last_phase = PhaseSettingConstant::PHASE_JAPANESE_CERTIFICATION;
            $check_user->save();
        }
    }

    public function __prepareDataUpdate($data)
    {
        return $this->__prepareDataStore($data);
    }

    public function __beforeDestroy()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->user->name . "-" . $this->row->certification->name];
        $this->__insertLog($dataLog, "deleted", null);
    }

    public function __afterStore()
    {

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->user->name . "-" . $this->row->certification->name];
        $this->__insertLog($dataLog, "created", null);
    }

    public function __afterUpdate()
    {
        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->user->name . "-" . $this->row->certification->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function changeStatus(Request $request, $id)
    {
        $this->updateValidator = $this->updateCms;
        return $this->update($request, $id);
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
            "user->name",
            "created_at",
            "status_label",
        ];

        $headings = [
            "Nama Siswa",
            "Pembaruan Terakhir",
            "Status Kelulusan",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }
}
