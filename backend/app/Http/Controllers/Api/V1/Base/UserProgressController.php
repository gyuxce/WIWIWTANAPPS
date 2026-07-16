<?php

namespace App\Http\Controllers\Api\V1\Base;

use App\Constants\CertificationStatusConstant;
use App\Constants\PhaseSettingConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\UserArticleStatusConstant;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Constants\Training\UserExamTypeConstant;
use App\Http\Requests\Api\V1\Base\ApiUpdateProfileMobileRequest;
use App\Models\Base\User;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Requests\Api\V1\Base\ApiUserRequest;
use App\Http\Requests\Api\V1\Base\ApiUpdateProfileRequest;
use App\Http\Resources\V1\Base\UserProgressDetailResource;
use App\Http\Resources\V1\Base\UserProgressResource;

use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use App\Models\Training\Article;
use App\Models\Training\Course;
use App\Models\Training\CourseItem;
use App\Models\Training\UserCourseItem;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class UserProgressController extends BaseCrud
{
    use HasLogHelper;
    public $model = User::class;
    public $resource =  UserProgressResource::class;
    public $searchAble = ["name"];

    public $storeValidator = ApiUserRequest::class;
    public $updateValidator = ApiUserRequest::class;
    public $updateProfileValidator = ApiUpdateProfileRequest::class;
    public $updateProfileMobileValidator = ApiUpdateProfileMobileRequest::class;

    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareQueryList()
    {
        return $this->query = $this->relations($this->query);
    }

    public function __successList($query)
    {
        $total_article = Article::where('course_id', '!=', null)->count();

        $request = $this->requestData;

        $data = $this->resource::collection($query, $total_article)->additional($this->__additionalCollection());

        if ($request->query("is_cache") == "1") {
            $key = Request::getRequestUri();

            Cache::put($key, $data, Carbon::now()->addMinutes($this->cacheInMinute));
        }

        return $data;
    }
    // public function indexProgress(Request $request)
    // {
    //     if (!empty($this->abilityPolicyIndex)) {
    //         $this->authorize($this->abilityPolicyIndex, $this->model);
    //     }

    //     $this->requestData = $request;

    //     if ($ress = $this->__prepareCacheResult()) {
    //         return $ress;
    //     }

    //     $this->query = $this->model::query();
    //     $this->query = $this->relations($this->query);
    //     $this->__prepareQueryList();

    //     $this->__prepareQuerySearchAbleList();

    //     $this->__prepareQueryOptionsList();

    //     $this->__prepareQuerySortOrderList();

    //     $this->__prepareQueryLimitList();

    //     $query = $this->__prepareQueryListType();

    //     $this->__prepareLoadRelation($query);

    //     $request = $this->requestData;
    //     $total_article = Article::where('course_id', '!=', null)->count();
    //     $data = UserProgressResource::collection($query, $total_article)->additional($this->__additionalCollection());
    //     if ($request->query("is_cache") == "1") {
    //         $key = Request::getRequestUri();
    //         Cache::put($key, $data, Carbon::now()->addMinutes($this->cacheInMinute));
    //     }
    //     return $data;
    // }

    protected function relations($query)
    {
        $query->where('role_id', null)->with([
            'userExam' => function ($q) {
                $q->with('template')->whereHas('template', function ($q) {
                    $q->where('type', UserExamTypeConstant::PRATEST);
                });
            },
            'userBatch.transactionAdministration',
            'userBatch.transactionTraining',
            'userArticle' => function ($q) {
                $q->with(['article' => function ($q) {
                    $q->with(['course']);
                }]);
            }
        ])->withCount([
            'certifications as certification_waiting' => function ($q) {
                $q->where('status', CertificationStatusConstant::WAITING);
            },
            'certifications as certification_done' => function ($q) {
                $q->where('status', '!=', CertificationStatusConstant::WAITING);
            },
            'userArticle as total_done_article' => function ($q) {
                $q->where('status', UserArticleStatusConstant::FINISH);
            },
        ]);
        return $query;
    }

    public function exportProgress(\Illuminate\Http\Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();
        $total_article = Article::where('course_id', '!=', null)->count();
        $userRepo = new UserRepository();
        $data = $data->map(function ($row) use ($userRepo, $total_article) {
            $ress = $row;
            $ress->progress = $userRepo->percentProgress($total_article, $row);
            $ress->last_phase_label = PhaseSettingConstant::LIST[$row->last_phase] ?? null;

            return $ress;
        });

        $filtername = 'Progress Siswa';
        $fields = [
            "name",
            "last_phase_label",
            "progress",

        ];
        $headings = [
            "Nama Siswa",
            "Fase",
            "Fase Progress",
        ];

        $filename = $filtername . "_" . \Carbon\Carbon::now()->format('Ymd') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function detailProgressLevel()
    {
        $userId = Auth::id();
        $user = User::where('id', $userId)->first();

        $trainingPercentage = 0;
        $currentLevel = $user->last_level;
        $countLevelReference = $this->countLevelReference($currentLevel, $user->training_program);
        $currentCountLevelReference = 0;

        // get module of program type (SSW/TITP)
        $courseItems = CourseItem::where('program_type', $user->training_program)
                        ->where('level_module', $currentLevel)
                        ->whereIn('exam_template_id', [
                            ExamTemplateConstant::ASSESMENT_QUESTION, 
                            ExamTemplateConstant::ASSESMENT_CONVERSATION
                        ])
                        ->orderBy('parent_id', 'asc')
                        ->get();

        if ($courseItems) {
            $courseItemIds = $courseItems->pluck('id')->toArray();

            // check data user_course_items is exist or not
            $userCourseItems = UserCourseItem::whereIn('item_id', $courseItemIds)
                                ->where('user_id', $userId)
                                ->where('status', 1)
                                ->get();

            if ($userCourseItems) {
                foreach ($courseItems as $courseItem) {
                    $userCourseItem = UserCourseItem::where('item_id', $courseItem->id)
                                        ->where('user_id', $userId)
                                        ->where('status', 1)
                                        ->first();

                    if ($userCourseItem) {
                        if ($userCourseItem->status == UserCourseItemStatusConstant::FINISHED) {
                            $currentCountLevelReference += 1;
                        }
                    }
                }

                if ($currentCountLevelReference == $countLevelReference) {
                    if ($currentLevel > 1) {
                        $currentLevel -= 1;
                        $user->update([
                            'last_level' => $currentLevel
                        ]);
                    }
                }
            }
        }

        $userCourses = Course::withCount(['articles as materi_count', 'articles as materi_count_progress' => function ($q) use ($userId) {
                                $q->whereHas('user_article', function ($q) use ($userId) {
                                    $q->where('user_id', $userId);
                                });
                            }])->get();

        $totalPercentageProgress = 0;
        foreach ($userCourses as $userCourse) {
            $percentageProgress = $userCourse->materi_count > 0 ? number_format(($userCourse->materi_count_progress / $userCourse->materi_count) * 100, 2) : 0;
            $totalPercentageProgress += $percentageProgress;
        }

        if ($totalPercentageProgress > 0) {
            $trainingPercentage = $totalPercentageProgress / count($userCourses);
        }
        
        return response()->json([
            'japanese_level' => $currentLevel,
            'japanese_level_label' => TrainingLevelConstant::LIST[$currentLevel],
            'training_percentage' => $trainingPercentage
        ]);
    }

    private function countLevelReference($level, $trainingProgram) {
        $countLevelReference = CourseItem::where('program_type', $trainingProgram)
                        ->where('level_module', $level)
                        ->whereIn('exam_template_id', [
                            ExamTemplateConstant::ASSESMENT_QUESTION, 
                            ExamTemplateConstant::ASSESMENT_CONVERSATION
                        ])
                        ->count();

        return $countLevelReference;
    }
}
