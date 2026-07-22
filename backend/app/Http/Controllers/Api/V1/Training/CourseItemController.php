<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\CourseItemGroupConstant;
use App\Constants\Training\ExamTemplateConstant;
use App\Models\Training\CourseItem;
use App\Models\Training\Course;
use App\Http\Resources\V1\Training\CourseItemResource;
use App\Http\Requests\Api\V1\Training\ApiCourseItemRequest;
use App\Services\BaseCrud\BaseCrud;
use App\Constants\Training\TrainingProgramConstant;
use App\Constants\Training\TrainingLevelConstant;
use App\Constants\Training\TrainingAccessModuleConstant;
use App\Constants\Training\UserArticleStatusConstant;
use App\Constants\Training\UserCourseItemStatusConstant;
use App\Http\Requests\Api\V1\Training\ApiCourseUpdateStatusRequest;
use App\Http\Requests\Api\V1\Training\ApiCourseUploadFileRequest;
use App\Http\Requests\Api\V1\Training\ApiCreateMateriRequest;
use App\Http\Resources\V1\Training\CourseMobileResource;
use App\Http\Resources\V1\Training\CourseResource;
use App\Http\Resources\V1\Training\ExamTemplateItemResource;
use App\Http\Resources\V1\Training\ExamTemplateResource;
use App\Http\Resources\V1\Training\UserCourseItemResource;
use App\Http\Resources\V1\Training\UserExamResource;
use App\Models\Base\File;
use App\Models\Base\User;
use App\Models\Training\Article;
use App\Models\Training\Event;
use App\Models\Training\ExamTemplateItem;
use App\Models\Training\UserArticle;
use App\Models\Training\UserCourseItem;
use App\Models\Training\UserExam;
use App\Policies\Training\ExamTemplateItemPolicy;
use App\Repositories\Training\CourseItemRepository;
use App\Repositories\Training\UserCourseItemRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CourseItemController extends BaseCrud
{
    public $model = CourseItem::class;
    public $resource = CourseItemResource::class;
    public $searchAble = ["title", "title_japan", "materialContent.title", "materialContent.description"];

    public $storeValidator = ApiCourseItemRequest::class;
    public $updateValidator = ApiCourseItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public $courseItemRepo, $userCourseItemRepo;

    public function __construct()
    {
        $this->courseItemRepo = new CourseItemRepository();
        $this->userCourseItemRepo = new UserCourseItemRepository();
    }

    public function __prepareDataStore($data)
    {
        $data['course_id'] = isset($data['course_id']) ? (Course::getId($data['course_id']) ?? null) : null;
        $data['parent_id'] = isset($data['parent_id']) ? (CourseItem::getId($data['parent_id']) ?? null) : null;
        $data['event_id'] = isset($data['event_id']) ? (Event::getId($data['event_id']) ?? null) : null;
        return $data;
    }

    public function __afterStore()
    {
        if ($this->requestData->has("is_assesment")) {
            $this->model::create([
                "group" => CourseItemGroupConstant::COURSE_GROUP_ASSESMENT,
                "course_id" => $this->row->course_id,
                "parent_id" => $this->row->id,
                "title" => $this->row->title . ' asesmen soal',
                "title_japan" => $this->row->title_japan ? $this->row->title_japan . ' 筆記評価' : null,
                "exam_template_id" => 1,
                "program_type" => $this->row->program_type,
                "is_active" => true,
                "level_module" => $this->row->level_module,
                "access_module" => $this->row->access_module,
            ]);
            $lisan = $this->model::create([
                "group" => CourseItemGroupConstant::COURSE_GROUP_ASSESMENT,
                "course_id" => $this->row->course_id,
                "parent_id" => $this->row->id,
                "title" => $this->row->title . ' asesmen lisan',
                "title_japan" => $this->row->title_japan ? $this->row->title_japan . ' 口頭評価' : null,
                "exam_template_id" => 5,
                "program_type" => $this->row->program_type,
                "is_active" => true,
                "level_module" => $this->row->level_module,
                "access_module" => $this->row->access_module,
            ]);
            $user = User::whereNull('role_id')->get();
            foreach ($user as $key => $value) {
                $this->userCourseItemRepo->createUserCourseItem($lisan->id, $value);
            }
        }
    }

    public function __prepareDataUpdate($data)
    {
        $data = $this->__prepareDataStore($data);
        unset($data["created_by"]);

        return $data;
    }

    public function updateStatus(Request $request)
    {
        app(ApiCourseUpdateStatusRequest::class);

        $query = $this->model::findOrFail($this->model::getId($request->id));
        $query->update(['is_active' => $request->is_active]);

        return response()->json(["message" => "OK"], 200);
    }

    public function uploadFile(Request $request)
    {
        app(ApiCourseUploadFileRequest::class);

        $query = $this->model::findOrFail($this->model::getId($request->id));
        $query->update(['file_id' => File::getId($request->file_id)]);

        return response()->json(["message" => "OK"], 200);
    }

    public function export(Request $request)
    {
        $this->requestData = $request;
        $this->query = $this->model::query();
        $this->query = $this->__prepareQueryList();
        $this->query = $this->__prepareQuerySearchAbleList();
        $this->query = $this->__prepareQueryOptionsList();
        $data = $this->query->get();

        $data = $data->map(function ($row) {
            $ress = $row;
            $ress->program_type = TrainingProgramConstant::LIST[$row->program_type] ?? null;
            $ress->level_module = TrainingLevelConstant::LIST[$row->level_module] ?? null;
            $ress->access_module = TrainingAccessModuleConstant::LIST[$row->access_module] ?? null;
            return $ress;
        });

        $fields = [
            "title",
            "title_japan",
            "course->title",
            "program_type",
            "level_module",
            "access_module",
        ];

        $headings = [
            "Modul Pelatihan",
            "Modul Pelatihan Jepang",
            "Kategori Modul",
            "Program Pelatihan",
            "Level Modul",
            "Akses Modul",
        ];

        $filename = app($this->model)->getTable() . "-" . date('dmy') . ".xlsx";
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\CollectionExport($data, $fields, $headings), $filename);
    }

    public function createMateri(ApiCreateMateriRequest $request)
    {
        try {
            DB::beginTransaction();
            if (count($request->contents) > 0) {
                $course_item = CourseItem::where('uuid', $request->course_item_id)->first();
                
                $article_ids = collect($request->contents)->filter(function ($content) {
                    return $content['id'];
                })->pluck('id')->toArray();
                // dd($article_ids, $course_item->materialContent);
                $materialContents = collect($course_item->materialContent)->whereNotIn('id', $article_ids);

                if(count($materialContents) > 0) {
                    foreach ($materialContents as $key => $value) {
                        $dt = $value;
                        $dt->update(['deleted_at' => date('Y-m-d H:i:s')]);
                    }
                }

                if (count($article_ids) == 0) {
                    Article::where('course_item_id', $course_item->id)->delete();
                } 
                // else {
                //     Article::whereNotIn('uuid', $article_ids)->delete();
                // }
                foreach ($request->contents as $value) {
                    $file = isset($value['body_file_id']) ? (File::getId($value['body_file_id']) ?? null) : null;
                    $cover = isset($value['cover_file_id']) ? (File::getId($value['cover_file_id']) ?? null) : null;
                    Article::updateOrCreate(
                        ['uuid' => $value['id']],
                        [
                            "title" => $value['title'] ?? '',
                            "description" => $value['description'] ?? '',
                            "body_type" => $value['body_type'] ?? '',
                            "body_text" => $value['body_text'] ?? '',
                            "duration" => $value['duration'] ?? '',
                            'course_item_id' =>   $course_item->id,
                            'course_id' =>   $course_item->course_id,
                            'body_file_id' =>  $file,
                            'cover_file_id' =>  $cover,

                        ]
                    );
                }
            } else {
                $course_item = CourseItem::where('uuid', $request->course_item_id)->first();
                $materialContent = $course_item->materialContent();
                $materialContent->update(['deleted_at' => date('Y-m-d H:i:s')]);
            }
            DB::commit();
            return response()->json(
                ['message' => 'Seccess submit data']
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function mobileGetModuleProgress()
    {
        $data = $this->courseItemRepo->getMobileModuleProgress();
        return response()->json([
            'message' => 'Data Category',
            'data' => CourseMobileResource::collection($data)
        ]);
    }

    public function mobileUpdateProgressModuleContentMaterial(Request $request)
    {
        try {
            DB::beginTransaction();
            $article = Article::where('uuid', $request->material_content_id)->first();
            if (!$article) {
                throw new \Exception('Content module not Found');
            }
            $user_article = UserArticle::where('user_id', Auth::id())->where('article_id', $article->id)->first();
            $data = [
                "user_id" =>
                Auth::id(),
                "article_id" => $article->id,
                "duration" => $request->duration ?? null,
                "status" => $request->status ?? null,
            ];
            if ($user_article) {
                $user_article->update($data);
            } else {
                UserArticle::create($data);
            }
            DB::commit();
            return response()->json(
                ['message' => 'Seccess submit data']
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function mobileGetModuleContentMateri(Request $request)
    {
        try {

            $data = CourseItem::where('is_header', true)
                ->whereHas('course', function ($q) use ($request) {
                    if ($request->category_id) {
                        $q->where('uuid', $request->category_id);
                    }
                })
                ->where('program_type', auth()->user()->training_program)
                ->with(['content' => function ($q) use ($request) {
                    $q->with(['materialContent' => function ($q) use ($request) {
                        $query = $q->with(['cover', 'file', 'userArticle']);
                        if ($request->status) {
                            $query = $query->whereHas('userArticle', function ($child_q2) use ($request) {
                                $child_q2->where('status', $request->status);
                            });
                            if ($request->status != UserArticleStatusConstant::FINISH) {
                                $query = $query->orDoesntHave('userArticle');
                            }
                        }
                    }])
                        //
                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_MATERIAL)

                        ->where(function ($q) use ($request) {
                            if ($request->keyword) {
                                $q->where('title', 'LIKE', "%{$request->keyword}%");
                            }
                        })
                        ->has('materialContent');
                }])
                ->orderBy('level_module', $request->sort_by ?? 'asc')
                ->has('content')
                ->get();

            return response()->json([
                'data' => CourseItemResource::collection($data)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function mobileGetModuleVirtualClass(Request $request)
    {
        try {
            $data = CourseItem::where('is_header', true)
                ->whereHas('course', function ($q) use ($request) {
                    if ($request->category_id) {
                        $q->where('uuid', $request->category_id);
                    }
                })
                ->where('program_type', auth()->user()->training_program)
                ->with(['classVirtual' => function ($q) use ($request) {
                    $q->with(['event.cover'])
                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_CLASS)
                        ->whereHas('event', function ($kuer) use ($request) {
                            $kuer->where(function ($a) use ($request) {
                                if ($request->start_date) {
                                    $a->whereDate('started_at', '>=', $request->start_date . ' 00:00:00');
                                }
                            })
                                ->where(function ($a) use ($request) {
                                    if ($request->end_date) {
                                        $a->whereDate('started_at', '<=', $request->end_date . ' 23:59:59');
                                    }
                                })->where(function ($a) use ($request) {
                                    if ($request->event_name) {
                                        $lower = "LOWER";
                                        $like = "like";
                                        $a->orWhereRaw($lower . '(title) ' . $like . ' ?', ['%' . strtolower($request->event_name) . '%']);
                                    }
                                });
                        });
                }])
                ->orderBy('level_module', $request->sort_by ?? 'asc')
                ->get();

            return response()->json([
                'data' => CourseItemResource::collection($data)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    function mobileGetModuleAssesment(Request $request)
    {
        try {
            $data = CourseItem::where('is_header', true)
                ->whereHas('course', function ($q) use ($request) {
                    if ($request->category_id) {
                        $q->where('uuid', $request->category_id);
                    }
                })
                ->where('program_type', auth()->user()->training_program)
                ->with(['assesment' => function ($q) use ($request) {
                    $q->with(['exam_template', 'file', 'assesmentStudent.userExam'])
                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_ASSESMENT)
                        ->where('is_active', true)
                        ->where(function ($q) use ($request) {
                            if ($request->start_date || $request->end_date ||  $request->start_weight || $request->end_weight) {
                                $q->whereHas('assesmentStudent', function ($q) use ($request) {
                                    $q->where(function ($a) use ($request) {
                                        if ($request->start_date) {
                                            $a->whereDate('working_date', '>=', $request->start_date . ' 00:00:00');
                                        }
                                    })
                                        ->where(function ($a) use ($request) {
                                            if ($request->end_date) {
                                                $a->whereDate('working_date', '<=', $request->end_date . ' 23:59:59');
                                            }
                                        })->where(function ($a) use ($request) {
                                            if ($request->start_weight) {
                                                $a->where('weight_total', '>=', $request->start_weight);
                                            }
                                        })->where(function ($a) use ($request) {
                                            if ($request->end_weight) {
                                                $a->where('weight_total', '<=', $request->end_weight);
                                            }
                                        })->where(function ($a) use ($request) {
                                            if ($request->assesment_name) {
                                                $lower = "LOWER";
                                                $like = "like";
                                                $a->orWhereRaw($lower . '(title) ' . $like . ' ?', ['%' . strtolower($request->event_name) . '%']);
                                            }
                                        });
                                });
                            }
                        });
                }])
                ->with(['event' => function ($q) use ($request) {
                    if ($request->event_name) {
                        $q->where('title', 'like', '%' . $request->event_name . '%');
                    }
                }])
                ->orderBy('level_module', $request->sort_by ?? 'asc')
                ->get();

            return response()->json([
                'data' => CourseItemResource::collection($data)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function mobileGetModuleDetailAll($module_id)
    {
        try {

            $data = CourseItem::where('is_header', true)
                ->where('uuid', $module_id)

                ->with(['content' => function ($q) {
                    $q->with(['materialContent.cover', 'materialContent.file', 'materialContent.userArticle', 'materialContent'])

                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_MATERIAL)->has('materialContent');
                }])
                ->with(['classVirtual' => function ($q) {
                    $q->with(['event'])
                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_CLASS);
                }])
                ->with(['assesment' => function ($q) {
                    $q->with(['exam_template', 'file', 'assesmentStudent', 'assesmentStudentHistory'])
                        ->where('group', CourseItemGroupConstant::COURSE_GROUP_ASSESMENT)
                        ->where('is_active', true);
                }])

                ->get();

            return response()->json([
                'data' => CourseItemResource::collection($data)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function mobileGetModuleDetail(Request $request)
    {
        return $this->index($request);
    }

    public function mobileGetQuestionAssesmentRandom($module_id)
    {
        try {
            DB::beginTransaction();

            $data = CourseItem::where('uuid', $module_id)->firstOrFail();
            $userCourseItem = UserCourseItem::where('item_id', $data->id)->where('user_id', Auth::id())->orderBy('created_at', 'desc')->first();
            $userCourseItemRepeated = UserCourseItem::where('item_id', $data->id)->where('user_id', Auth::id())->where('status', UserCourseItemStatusConstant::REPEAT)->withTrashed()->orderBy('created_at', 'desc')->pluck('exam_template_item_id')->toArray();

            // $attemptLimit = CourseItem::where('uuid', $module_id)->count();
            // $attemptCount = 0;
            // $userCourseItemFound = $userCourseItemRepeated ? true : false;

            // while ($userCourseItemFound && $attemptCount < $attemptLimit) {
            //     $data = CourseItem::where('uuid', $module_id)->firstOrFail();
            //     $userCourseItem = UserCourseItem::where('item_id', $data->id)->where('user_id', Auth::id())->orderBy('created_at', 'desc')->first();
            //     $userCourseItemRepeated = UserCourseItem::where('item_id', $data->id)->where('user_id', Auth::id())->where('status', UserCourseItemStatusConstant::REPEAT)->withTrashed()->orderBy('created_at', 'desc')->first();

            //     if ($userCourseItemRepeated) {
            //         $userCourseItemFound = true;
            //         $attemptCount++;
            //     } else {
            //         $userCourseItemFound = false;
            //     }
            // }

            if ($userCourseItem) {
                if ($userCourseItem->status == UserCourseItemStatusConstant::FINISHED) {
                    throw new \Exception('Saat ini anda tidak bisa melakukan assesmen karna sudah tersedia dengan status selesai');
                }
                if ($userCourseItem->status == UserCourseItemStatusConstant::PROGRESS) {
                    $userExam = UserExam::find($userCourseItem->user_exam_id);
                    $question = ExamTemplateItem::with(['question.file', 'question.question_items', 'file', 'question.userAnswareSelected.question_item'])->where('course_item_id', $userCourseItem->item_id)->where('id', $userCourseItem->exam_template_item_id)->first();
                    return response()->json([
                        'data' => [
                            'question'  => new ExamTemplateItemResource($question),
                            'userExam' => new UserExamResource($userExam)
                        ],

                    ]);
                } 
            }
            
            if ($userCourseItemRepeated) {
                $question = ExamTemplateItem::with(['question.file', 'question.question_items', 'file'])->where('course_item_id', $data->id)->whereNotIn('id', $userCourseItemRepeated)->inRandomOrder()->first();

                if ($question) {
                    $userExam = UserExam::create([
                        'template_id' => ExamTemplateConstant::ASSESMENT_QUESTION,
                        'user_id' => Auth::id(),
                        'duration' => $question->duration
                    ]);

                    $userCourseItem = UserCourseItem::create([
                        'created_at' => now(),
                        'updated_at' => now(),
                        'uuid' => Str::uuid(),
                        'user_id' => Auth::id(),
                        'course_id' => $data->course_id,
                        'item_id' => $data->id,
                        'working_date' => now(),
                        'status' => UserCourseItemStatusConstant::PROGRESS,
                        'weight_total' => $question->question->sum('weight_true'),
                        'weight_minimum' => $question->weight_minimum,
                        'weight_maximum' => $question->question->sum('weight_max'),
                        'user_exam_id' => $userExam->id,
                        'exam_template_item_id' =>  $question->id,
                    ]);

                    DB::commit();
                    return response()->json([
                        'data' => [
                            'question'  => new ExamTemplateItemResource($question),
                            'userExam' => new UserExamResource($userExam)
                        ],
                    ]);
                }
                
            }

            $question = ExamTemplateItem::with(['question.file', 'question.question_items', 'file'])
                ->where('course_item_id', $data->id)->inRandomOrder()->first();

            $userExam = UserExam::create([
                'template_id' => ExamTemplateConstant::ASSESMENT_QUESTION,
                'user_id' => Auth::id(),
                'duration' => $question->duration
            ]);

            $userCourseItem = UserCourseItem::create([
                'created_at' => now(),
                'updated_at' => now(),
                'uuid' => Str::uuid(),
                'user_id' => Auth::id(),
                'course_id' => $data->course_id,
                'item_id' => $data->id,
                'working_date' => now(),
                'status' => UserCourseItemStatusConstant::PROGRESS,
                'weight_total' => $question->question->sum('weight_true'),
                'weight_minimum' => $question->weight_minimum,
                'weight_maximum' => $question->question->sum('weight_max'),
                'user_exam_id' => $userExam->id,
                'exam_template_item_id' =>  $question->id,
            ]);
            DB::commit();
            return response()->json([
                'data' => [
                    'question'  => new ExamTemplateItemResource($question),
                    'userExam' => new UserExamResource($userExam)
                ],

            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
