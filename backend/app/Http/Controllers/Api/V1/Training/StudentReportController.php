<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\QuestionsConstant;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\UserCourseItemScheduleStatus;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Http\Resources\V1\Training\UserCourseItemResource;
use App\Http\Requests\Api\V1\Training\ApiUserCourseItemRequest;
use App\Http\Resources\V1\Training\StudentReportResource;
use App\Http\Resources\V1\Training\UserExamQuestionResource;
use App\Models\Training\UserCourse;
use App\Models\Training\UserCourseItem;
use App\Models\Training\UserExam;
use App\Models\Training\UserExamQuestion;
use App\Models\Training\UserExamQuestionItem;
use App\Repositories\UserExamRepository;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StudentReportController extends BaseCrud
{

    public $model = UserCourseItem::class;
    public $resource = StudentReportResource::class;
    public $storeValidator = ApiUserCourseItemRequest::class;
    public $updateValidator = ApiUserCourseItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $searchAble = ["user.name"];
    public $cacheInMinute = 10;

    public $userExamRepo;

    public function __construct()
    {
        $this->userExamRepo = new UserExamRepository();
    }

    public function __prepareQueryList()
    {

        $this->query = $this->query
            ->select(
                'user_course_items.*',
                'users.name as user_name',
                'courses.title as category_module',
                'exam_templates.title as type_assesment',
                'module.title as module_name',
                'module.program_type as module_program_type',
                'module.level_module as module_level_module',
                'module.access_module as module_access_module',
                'module.uuid as module_id',
                'exam_templates.uuid as assesment_id',
                'courses.uuid as category_id',
            )
            ->join('users', 'users.id', '=', 'user_course_items.user_id')
            ->join('courses', 'courses.id', '=', 'user_course_items.course_id')
            ->join('course_items', 'course_items.id', '=', 'user_course_items.item_id')
            ->join('exam_templates', 'exam_templates.id', '=', 'course_items.exam_template_id')
            ->join('course_items as module', 'module.id', '=', 'course_items.parent_id')
            ->where('user_course_items.status', '<>', 4)
            ->whereIn(DB::raw('(user_course_items.user_id, user_course_items.working_date)'), function ($query) {
                $query->select('user_id', DB::raw('MAX(working_date)'))
                    ->from('user_course_items')
                    ->whereNotNull('working_date')
                    ->where('status', '<>', 4)
                    ->groupBy('user_id', 'item_id');
            })->withTrashed();
        if($training_modules = $this->requestData->training_modules) {
            $this->query->whereIn('module.title', $training_modules);
        }
        if($assesment_types = $this->requestData->assesment_types) {
            $this->query->whereIn('exam_templates.title', $assesment_types);
        }
        return $this->query;
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
            $ress->program_type_label = TrainingProgramConstant::LIST[$ress->module_program_type] ?? null;

            return $ress;
        });

        $fields = [
            "user_name",
            "program_type_label",
            "module_name",
            "type_assesment",
            "category_module",
            "weight_total",

        ];
        $headings = [
            "Nama Siswa",
            "Program Pelatihan",
            "Modul Materi",
            "Tipe Assesmen",
            "Kategory Modul",
            "Nilai",
        ];


        $filename = 'Buku Nilai Siswa' . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function __beforeShow()
    {
        // $this->__prepareLoadRelation($this->row->userExam);
        $this->row->userExam;
        $this->row->item;
        $this->row->course;
        $this->row->user->profilePicture;
        $user_exam_question = $this->getQuestionUserExam($this->row->user_exam_id);
        $answareUser = UserExamQuestionResource::collection($user_exam_question);
        return response()->json([
            'data' => [
                'data' => new StudentReportResource($this->row),
                'answareUser' => $answareUser,
            ],
        ]);
    }

    public function detailStudentReport($id)
    {
        $userCourseItem = UserCourseItem::where('uuid', $id)->with('userExam', 'item.exam_template', 'course', 'user.profilePicture')->withTrashed()->first();
        if (!$userCourseItem) {
            return response()->json([
                'data' => [],
            ]);
        }

        $user_exam_question = $this->getQuestionUserExam($userCourseItem->user_exam_id);
        $answareUser = UserExamQuestionResource::collection($user_exam_question);
        return response()->json([
            'data' => [
                'data' => new StudentReportResource($userCourseItem),
                'answareUser' => $answareUser,
            ],
        ]);
    }

    protected function getQuestionUserExam($id)
    {
        $data = UserExamQuestion::with(['user_exam_question_item.question_item', 'question', 'file', 'exam'])
            ->where('user_exam_id', $id)
            ->get();
        return $data;
    }

    public function __afterUpdate()
    {


        if (isset($this->requestData['question']) && count($this->requestData['question']) > 0) {

            $total_weight = 0;
            $weight_true = 0;
            foreach ($this->requestData['question'] as $value) {

                $user_exam_question = UserExamQuestion::with(['user_exam_question_item.question_item', 'question',])->whereHas('question', function ($q) use ($value) {
                    $q->where('uuid', $value['id']);
                })
                    ->where('user_exam_id', $this->row->user_exam_id)->first();

                if (($user_exam_question?->question?->type == QuestionsConstant::MULTI_CHOICE)) {
                    if ($user_exam_question?->user_exam_question_item?->question_item?->is_correct == true) {
                        $total_weight += $user_exam_question?->question?->weight_true;
                        $weight_true = $user_exam_question?->question?->weight_true;
                    }
                } else if ($user_exam_question?->question?->type == QuestionsConstant::MULTI_CHOICE_VALUE) {
                    $total_weight += $user_exam_question?->user_exam_question_item?->question_item?->weight;
                    $weight_true = $user_exam_question?->user_exam_question_item?->question_item?->weight;
                } else {
                    if (isset($value['a_weight'])) {
                        $weight_true = $value['a_weight'];
                        $total_weight += $value['a_weight'];
                    }
                }
                $user_exam_question->update([
                    'a_weight' => $weight_true
                ]);
            }
            $this->row->update([
                'weight_total' => $total_weight
            ]);
        }
    }

    public function detailHistory($id, Request $request)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }
        $data = UserCourseItem::where('uuid', $id)->withTrashed()->first();
        // dd($data);
        // if (!$data) {
        //     return response()->json([
        //         'data' => [],
        //     ]);
        // }

        $this->requestData = $request;

        $this->query = $this->model::query();

        $this->query = $this->query->where('item_id', $data->item_id)->where('user_id', $data->user_id)->withTrashed();

        $this->__prepareQueryRelationList();

        // $this->__prepareQueryList();

        $this->__prepareQuerySortOrderList();

        $this->__prepareQueryLimitList();

        $query = $this->__prepareQueryListType();

        $this->__prepareLoadRelation($query);

        $data = UserCourseItemResource::collection($query)->additional($this->__additionalCollection());

        return $data;
    }
    public function detailExport($id)
    {

        try {
            $data = UserCourseItem::where('uuid', $id)->first();
            if (!$data) {
                throw new \Exception('User Course item not Found');
            }

            $detail = $this->getQuestionUserExam($data->user_exam_id);
            $detail = $detail->map(function ($row) {
                $ress = $row;
                $ress->question_user = $row->o_title;
                $ress->type_question =  QuestionsConstant::LIST[$row->question?->type] ?? null;
                $ress->score = $row->a_weight;
                if ($row->question?->type == QuestionsConstant::MULTI_CHOICE || $row->question?->type == QuestionsConstant::MULTI_CHOICE_VALUE) {
                    $ress->answare = $ress->user_exam_question_item?->o_description;
                } else if ($row->question?->type == QuestionsConstant::ESAI || $row->question?->type == QuestionsConstant::WRITE) {
                    $ress->answare =
                        $row->a_body_text;
                } else if (
                    $row->question?->type == QuestionsConstant::AUDIO ||
                    $row->question?->type == QuestionsConstant::IMAGE
                ) {
                    $ress->answare =
                        $ress->file?->url;
                }


                return $ress;
            });

            $fields = [
                "question_user",
                "type_question",
                "answare",
                "score",
            ];

            $headings = [
                "Soal",
                "Tipe Soal",
                "Jawab Siswa",
                "Poin",
            ];

            $filename = 'Detail Report Siswa' . "-" . date('dmy') . ".xlsx";
            return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($detail, $fields, $headings), $filename);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function updateStudentReport(Request $request)
    {
        $userCourseItem = UserCourseItem::where('uuid', $request->id)->first();
        if (isset($request->question) && count($request->question) > 0) {

            $total_weight = 0;
            $weight_true = 0;
            foreach ($request->question as $value) {

                $user_exam_question = UserExamQuestion::with(['user_exam_question_item.question_item', 'question'])->whereHas('question', function ($q) use ($value) {
                    $q->where('uuid', $value['id']);
                })
                    ->where('user_exam_id', $userCourseItem->user_exam_id)->first();

                if (($user_exam_question?->question?->type == QuestionsConstant::MULTI_CHOICE)) {
                    if ($user_exam_question?->user_exam_question_item?->question_item?->is_correct) {
                        $total_weight += $user_exam_question?->question?->weight_true;
                    } else {
                        $total_weight += $user_exam_question?->question?->weight_false;
                    }
                } else if ($user_exam_question?->question?->type == QuestionsConstant::MULTI_CHOICE_VALUE) {
                    $total_weight += $user_exam_question?->user_exam_question_item?->question_item?->weight;
                } else {
                    if (isset($value['a_weight'])) {
                        $total_weight += $value['a_weight'];

                        $user_exam_question->update([
                            'a_weight' => $value['a_weight']
                        ]);
                    }
                }
            }
            $userCourseItem->update([
                'weight_total' => $total_weight
            ]);

            // calculate exam results & update status user exam
            $userExam = UserExam::where('id', $userCourseItem->user_exam_id)->first();
            $calculateResult = $this->userExamRepo->calculateResult($userExam->id);
            $examResult = $this->userExamRepo->calculateExamResult($calculateResult->weight_achieved, $userExam->weight_total);

            // update status user course item
            if ($examResult > $userCourseItem->weight_minimum) {
                $userCourseItem->update([
                    'status' => UserCourseItemStatusConstant::FINISHED,
                    'weight_final' => $examResult,
                ]);
            } else {
                $userCourseItem->update([
                    'status' => UserCourseItemStatusConstant::REPEAT,
                    'weight_final' => $examResult,
                ]);
            }
        }

        // check & update user's level
        setUserTrainingLevel($userCourseItem->user_id);

        return response()->json([
            'data' => new UserCourseItemResource($userCourseItem),
        ]);
    }

    public function repeatAssesment(Request $request)
    {
        $userCourseItem = UserCourseItem::where('uuid', $request->id)->first();
        if ($userCourseItem) {
            if ($userCourseItem->status == UserCourseItemStatusConstant::REPEAT) {
                $userExam = UserExam::where('id', $userCourseItem->user_exam_id)->first();
                $userExam->update([
                    "working_date" => $userCourseItem->working_date
                ]);

                UserExamQuestionItem::where('user_exam_id', $userExam->id)->delete();
                $userCourseItem->delete();
            } else {
                abort(400, "Tidak dapat melakukan assesmen ulang");
            }
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function updateStudentReportAssesmentVerbal(Request $request)
    {
        $userCourseItem = UserCourseItem::where('uuid', $request->id)->with('item')->first();
        if ($userCourseItem->item->weight_minimum) {
            if (isset($request->score_assesment)) {
                $userCourseItem->update([
                    'weight_total' => $request->score_assesment,
                    'weight_final' => $request->score_assesment,
                ]);
    
                // update status user_course_item
                if ($request->score_assesment > $userCourseItem->item->weight_minimum) {
                    $userCourseItem->update([
                        'status' => UserCourseItemStatusConstant::FINISHED,
                        'weight_minimum' => $userCourseItem->item->weight_minimum
                    ]);
                } else {
                    $userCourseItem->update([
                        'status' => UserCourseItemStatusConstant::REPEAT,
                        'weight_minimum' => $userCourseItem->item->weight_minimum
                    ]);
                }
            }
        } else {
            abort(400, "Tidak dapat melakukan konfirmasi nilai, nilai minimum pada assesmen lisan ini belum ditentukan");
        }
        
        // check & update user's level
        setUserTrainingLevel($userCourseItem->user_id);

        return response()->json([
            'data' => new UserCourseItemResource($userCourseItem),
        ]);
    }

    public function repeatAssesmentVerbal(Request $request)
    {
        $userCourseItem = UserCourseItem::where('uuid', $request->id)->with('item')->first();
        if ($userCourseItem) {
            if ($userCourseItem->status == UserCourseItemStatusConstant::REPEAT && $userCourseItem->weight_final < $userCourseItem->item->weight_minimum) {
                $dtoUserCourseItem = [
                    "user_id" => $userCourseItem->user_id,
                    "course_id" => $userCourseItem->course_id,
                    "item_id" => $userCourseItem->item_id,
                    "status" => UserCourseItemStatusConstant::PROGRESS,
                    "weight_minimum" => $userCourseItem->item->weight_minimum ?? null,
                    'link' => $request->link,
                    'working_date' => $request->working_date,
                    'is_scheduled' => $request->working_date ? UserCourseItemScheduleStatus::SCHEDULED : UserCourseItemScheduleStatus::NOT_SCHEDULED,
                ];
                $newUserCourseItem = UserCourseItem::create($dtoUserCourseItem);

                $userCourseItem->delete();
            } else {
                abort(400, "Tidak dapat melakukan assesmen ulang");
            }
        }

        return response()->json([
            'success' => true,
            'data' => $newUserCourseItem,
        ]);
    }
}
