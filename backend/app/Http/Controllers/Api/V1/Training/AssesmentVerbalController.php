<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\QuestionsConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\UserCourseItemScheduleStatus;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Http\Requests\Api\V1\Training\ApiAssesmentVerbalRequest;
use App\Http\Resources\V1\Training\UserCourseItemResource;
use App\Http\Requests\Api\V1\Training\ApiUserCourseItemRequest;
use App\Http\Resources\V1\Training\StudentReportResource;
use App\Http\Resources\V1\Training\UserExamQuestionResource;
use App\Models\Training\CourseItem;
use App\Models\Training\UserCourseItem;
use App\Models\Training\UserExamQuestion;
use App\Models\Training\UserExamQuestionItem;
use App\Services\BaseCrud\BaseCrud;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AssesmentVerbalController extends BaseCrud
{

    public $model = UserCourseItem::class;
    public $resource = UserCourseItemResource::class;
    public $storeValidator = ApiUserCourseItemRequest::class;
    public $updateValidator = ApiUserCourseItemRequest::class;
    public $updateAssesmentValidator = ApiAssesmentVerbalRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $searchAble = ["user.name"];

    public $cacheInMinute = 10;

    public function indexAssesmentVerbal($id, Request $request)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }

        $courseItemId = CourseItem::getId($id);
        $courseItemData = CourseItem::where('parent_id', $courseItemId)->where('exam_template_id', ExamTemplateConstant::ASSESMENT_CONVERSATION)->first();
        if (!$courseItemData) {
            return response()->json([
                "message" => "Course item data is empty",
                "data" => []
            ], 200);
        }
        
        $data = UserCourseItem::where('item_id', $courseItemData->id)->first();
        if (!$data) {
            return response()->json([
                "message" => "User Course Item data is empty",
                "data" => []
            ], 200);
        }

        $this->requestData = $request;

        $this->query = $this->model::query();

        $this->query = $this->query->where('item_id', $courseItemData->id)
                        ->where(function($query) {
                            $query->where('status', '!=', UserCourseItemStatusConstant::REPEAT)
                                ->orWhereNotNull('status');
                        });

        $startedAt = $request->input('started_at');
        $finishedAt = $request->input('finished_at');
        if($startedAt) {
            $this->query = $this->query->where('working_date', '>=', Carbon::parse($startedAt)->startOfDay()->format('Y-m-d H:i:s'));
        }
        if($finishedAt) {
            $this->query = $this->query->where('working_date', '<=', Carbon::parse($finishedAt)->endOfDay()->format('Y-m-d H:i:s'));
        }
        
        $this->__prepareQueryRelationList();

        $this->__prepareQueryList();

        $this->__prepareQuerySearchAbleList();

        $this->__prepareQueryOptionsList();

        $this->__prepareQuerySortOrderList();

        $this->__prepareQueryLimitList();

        $query = $this->__prepareQueryListType();

        $this->__prepareLoadRelation($query);

        $data = UserCourseItemResource::collection($query)->additional($this->__additionalCollection());

        return $data;
    }

    public function export($id, \Illuminate\Http\Request $request)
    {
        $courseItemId = CourseItem::getId($id);
        $courseItemData = CourseItem::where('parent_id', $courseItemId)->where('exam_template_id', ExamTemplateConstant::ASSESMENT_CONVERSATION)->first();
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->query->where('item_id', $courseItemData->id)
                        ->where(function($query) {
                            $query->where('status', '!=', UserCourseItemStatusConstant::REPEAT)
                                ->orWhereNull('status');
                        });
        $startedAt = $request->input('started_at');
        $finishedAt = $request->input('finished_at');
        if($startedAt) {
            $this->query = $this->query->where('working_date', '>=', Carbon::parse($startedAt)->startOfDay()->format('Y-m-d H:i:s'));
        }
        if($finishedAt) {
            $this->query = $this->query->where('working_date', '<=', Carbon::parse($finishedAt)->endOfDay()->format('Y-m-d H:i:s'));
        }
        $this->__prepareQueryRelationList();
        $this->__prepareQueryList();
        $this->__prepareQuerySearchAbleList();
        $this->__prepareQueryOptionsList();
        $this->__prepareQueryLimitList();
        $data = $this->query->get();
        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->is_scheduled_type = UserCourseItemScheduleStatus::LIST[$ress->is_scheduled] ?? null;

            return $ress;
        });

        $fields = [
            "user->name",
            "working_date",
            "is_scheduled_type",
        ];

        $headings = [
            "Nama Siswa",
            "Tanggal & Waktu",
            "Status",
        ];


        $filename = 'Asesmen Lisan' . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function updateAssement($id)
    {
        $req = app($this->updateAssesmentValidator);
        $reqDate = $req->input('working_date');
        $reqLink = $req->input('link');

        $data = UserCourseItem::where('uuid', $id)->first();
        if (!$data) {
            return abort(404, 'User Course item not Found');
        }

        $data->update([
            'link' => $reqLink,
            'working_date' => $reqDate,
            'is_scheduled' => $reqDate ? UserCourseItemScheduleStatus::SCHEDULED : UserCourseItemScheduleStatus::NOT_SCHEDULED,
        ]);

        return $this->__success();
    }

    public function getScoreMinimum($id)
    {
        $courseItemId = CourseItem::getId($id);
        $courseItemData = CourseItem::where('parent_id', $courseItemId)->where('exam_template_id', ExamTemplateConstant::ASSESMENT_CONVERSATION)->first();
        if (!$courseItemData) {
            return response()->json([
                "message" => "Course item data is empty",
                "data" => []
            ], 200);
        }

        return response()->json([
            "data" => $courseItemData,
        ], 200);
    }

    public function updateScoreMinimum($id,  \Illuminate\Http\Request $request)
    {
        $courseItemId = CourseItem::getId($id);
        $courseItemData = CourseItem::where('parent_id', $courseItemId)->where('exam_template_id', ExamTemplateConstant::ASSESMENT_CONVERSATION)->first();
        if (is_null($courseItemData)) {
            return abort(404, 'Course item data not Found');
        }

        $courseItemData->update([
            'weight_minimum' => $request->input('weight_minimum'),
        ]);

        $datas = UserCourseItem::where('item_id', $courseItemData->id)
                ->where(function($query) {
                    $query->where('status', '!=', UserCourseItemStatusConstant::REPEAT)
                        ->orWhereNull('status');
                })->get();
                
        if ($datas->isEmpty()) {
            return response()->json([
                "message" => "User Course Item data is empty, nothing to update",
                "data" => []
            ], 200);
        }

        foreach($datas as $data) {
            $data->update([
                'weight_minimum' => $request->input('weight_minimum'),
            ]);
        }

        return $this->__success();
    }
}
