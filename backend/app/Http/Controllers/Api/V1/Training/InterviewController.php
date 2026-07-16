<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\PhaseSettingConstant;
use App\Constants\Training\InterviewTypeConstant;
use App\Constants\Training\PratesStatusConstant;
use App\Http\Requests\Api\V1\Training\ApiInterviewRequest;
use App\Models\Training\Program;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Requests\Api\V1\Training\ApiProgramRequest;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Resources\V1\Master\StudentResource;
use App\Http\Resources\V1\Training\InterviewResource;
use App\Models\Base\User;
use App\Models\Training\Interview;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Facades\Auth;

class InterviewController extends BaseCrud
{
    use HasLogHelper;
    public $model = Interview::class;
    public $resource = InterviewResource::class;
    public $storeValidator = ApiInterviewRequest::class;
    public $updateValidator = ApiInterviewRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $searchAble = ["name", "position", "agency"];

    public function __prepareDataStore($data)
    {
        $data['user_id'] = $data['user_id'] != null ? User::getId($data['user_id']) : null;
        return $data;
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data["created_by"]);

        return $data;
    }

    public function export(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $this->query =
            $this->__prepareQuerySortOrderList();

        $data = $this->query->get();


        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->date = $row->interview_date ? \Carbon\Carbon::parse($row->interview_date)->isoFormat('D MMMM YYYY') : null;
            $ress->type = InterviewTypeConstant::LIST[$ress->type] ?? null;

            return $ress;
        });

        $fields = [
            "date",
            "type",
            "name",
            "agency",
        ];

        $headings = [
            "Tanggal & Waktu",
            "Tujuan",
            "Pewawancara",
            "Instansi",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }
    public function __afterUpdate()
    {
        $this->updateTotalInterview();

        # insert to log
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "updated", $this->logChange);
    }

    public function __afterStore()
    {
        # insert to log
        $this->updateTotalInterview();

        // check apakah dia di phase interview atau bukan
        $check = User::find($this->row->user_id);
        if ($check != null && ($check->last_phase < PhaseSettingConstant::PHASE_INTERVIEW)) {
            $check->last_phase  = PhaseSettingConstant::PHASE_INTERVIEW;
            $check->save();
        }
        $dataLog = ["uuid" => $this->row->uuid, "label" => $this->row->name];
        $this->__insertLog($dataLog, "created", null);
    }

    protected function updateTotalInterview()
    {
        User::where('id', $this->row->user_id)
            ->update([
                'interview_count' => Interview::where('user_id', $this->row->user_id)->count()
            ]);
    }

    public function mobileGetUserInterview()
    {
        try {
            $user = User::with(['interviews' => function ($q) {
                $q->orderBy('interview_date', 'asc');
            }])->findOrFail(Auth::id());

            return response()->json([
                'data' => new StudentResource($user)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
