<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Models\Training\ExamTemplateItem;
use App\Http\Resources\V1\Training\ExamTemplateItemResource;
use App\Http\Requests\Api\V1\Training\ApiExamTemplateItemRequest;
use App\Http\Resources\V1\Training\ExamTemplateResource;
use App\Models\Base\File;
use App\Models\Training\CourseItem;
use App\Models\Training\Question;
use App\Models\Training\QuestionItem;
use App\Models\Training\ExamTemplate;
use App\Services\BaseCrud\BaseCrud;
use App\Services\BaseCrud\Traits\HasLogHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExamTemplateItemController extends BaseCrud
{
    use HasLogHelper;

    public $model = ExamTemplateItem::class;
    public $resource = ExamTemplateItemResource::class;
    public $storeValidator = ApiExamTemplateItemRequest::class;
    public $updateValidator = ApiExamTemplateItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function __prepareDataStore($data)
    {
        $data['course_item_id'] = isset($data['course_item_id']) ? CourseItem::getId($data['course_item_id']) : null;

        return $data;
    }

    public function __afterStore()
    {
        $courseItem = CourseItem::getFirst($this->row->course_item_id, 'id');
        if ($courseItem) {
            $courseItem->update([
                'weight_minimum' => $this->row->weight_minimum
            ]);
        }
    }

    public function __prepareDataUpdate($data)
    {
        return $this->__prepareDataStore($data);
    }

    public function __afterUpdate()
    {
        $this->__afterStore();
    }

    public function praTestLanguage(Request $request)
    {
        return $this->praTest($request, 2);
    }

    public function praTestCharacter(Request $request)
    {
        return $this->praTest($request, 4);
    }

    public function praTestQna(Request $request)
    {
        return $this->praTest($request, 3);
    }

    protected function praTest(Request $request, $id)
    {

        if (!empty($this->abilityPolicyStore)) {
            $this->authorize($this->abilityPolicyStore, $this->model);
        }

        try {
            DB::beginTransaction();

            $pratest = [];
            if ($request->pratest) {
                $exam = ExamTemplate::where('id', $id)->first();
                $exam->introduction()->delete();
                foreach ($request->pratest as $value) {
                    $parent = new ExamTemplateItem([
                        'title' => $value['title'] ?? '',
                        'description' => $value['description'] ?? '',
                        'is_introduction' => true,
                        'template_id' => $exam->id,
                    ]);

                    $parent->save();
                    foreach ($value['child'] as $child) {
                        $item = [];
                        $item['template_id'] = $exam->id;
                        $item['description'] = $child['description'] ?? '';
                        $item['title'] = $child['title'] ?? '';
                        $item['language_type'] = $child['language_type'] ?? '';
                        $item['parent_id'] = $parent->id;
                        $item['is_introduction'] = true;
                        $item['created_at'] = \Carbon\Carbon::now();
                        $item['updated_at'] = \Carbon\Carbon::now();
                        $item['uuid'] = Str::uuid()->toString();
                        array_push($pratest, $item);
                    }
                }
                ExamTemplateItem::insert($pratest);
            }

            DB::commit();

            if ($data = ExamTemplate::with('introduction.child')->where('id', $id)->first()) {
                $lastUpdated = ExamTemplate::with('introduction.child')->where('id', $id)->orderBY('updated_at', 'desc')->first();

                $dataLog = ["uuid" => $data->uuid, "label" => $data->title];
                $this->__insertLog($dataLog, "created", $this->logChange);

                return response()->json([
                    "data" => new ExamTemplateResource($data),
                    "last_updated" => $lastUpdated && $lastUpdated->updated_at != null ? $lastUpdated->updated_at : null,
                ]);
            } else {
                return response()->json([
                    "message" => "No data found",
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function getPraTest(Request $request)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }

        $template_id = '';
        if ($request->template == 'character') {
            $template_id = 4;
        } else if ($request->template == 'qna') {
            $template_id = 3;
        } else if ($request->template == 'language') {
            $template_id = 2;
        }

        try {
            $data = ExamTemplate::with('introduction.child', 'sesi')->where('id', $template_id)->first();
            $lastUpdated = ExamTemplate::with('introduction.child')->where('id', $template_id)->orderBY('updated_at', 'desc')->first();
            return response()->json([
                "data" => new ExamTemplateResource($data),
                "last_updated" => $lastUpdated && $lastUpdated->updated_at != null ? $lastUpdated->updated_at : null,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function questionCreate(Request $request)
    {
        if (!empty($this->abilityPolicyStore)) {
            $this->authorize($this->abilityPolicyStore, $this->model);
        }
        $question_items = [];
        DB::beginTransaction();

        try {

            $temp = ExamTemplateItem::with('question')->where('uuid', $request->sesi_question_id)->firstOrFail();
            $temp->question()->detach();
            $question_id = [];

            foreach ($request->questions as $value) {
                $file = '';
                if (isset($value['body_file_id'])) {
                    $file = File::where('uuid', $value['body_file_id'])->first();
                }
                $question = new Question(
                    [
                        "type" => $value['type'],
                        "title" => $value['title'],
                        "description" => $value['description'] ?? '',
                        "body_type" => $value['body_type'] ?? '',
                        "body_url" => $value['body_url'] ?? '',
                        "body_file_id" => $file ? $file->id : '',
                        "weight_true" => $value['weight_true'] ?? '',
                        "weight_null" => $value['weight_null'] ?? '',
                        "weight_false" => $value['weight_false'] ?? '',
                        "weight_min" => $value['weight_min'] ?? '',
                        "weight_max" => $value['weight_max'] ?? '',
                        "index" => $value['index'] ?? '',
                        "data" => json_encode($value['data'] ?? ''),
                        "created_at" => now(),
                        "updated_at" => now(),
                    ]
                );

                $question->save();
                array_push($question_id, $question->id);

                foreach ($value['question_items'] as $item) {
                    $question_items[] = [
                        "created_at" => now(),
                        "updated_at" => now(),
                        "question_id" => $question->id,
                        "description" => $item['description'] ?? '',
                        "is_correct" => $item['is_correct'] ?? '',
                        "body_type" => $item['body_type'] ?? '',
                        "body_url" => $item['body_url'] ?? '',
                        "index" => $item['index'] ?? '',
                        "weight" => $item['weight'] ?? '',
                        'uuid' =>  Str::uuid()->toString(),
                    ];
                }
            }

            QuestionItem::insert($question_items);
            $file = '';
            if ($request->body_file_id) {
                $file = File::where('uuid', $request->body_file_id)->first();
            }
            $temp->update([
                "count_question" => count($question_id),
                "description" => $request->description ?? '',
                "body_file_id" => $file ? $file->id : '',
            ]);
            $temp->question()->attach($question_id, [
                'created_at' => now(),
                'updated_at' => now(),
                'uuid' =>  Str::uuid()->toString()
            ]);
            DB::commit();
            $question = ExamTemplateItem::with('question.question_items')->where('uuid', $request->sesi_question_id)->first();
            return response()->json(
                new ExamTemplateItemResource($question)
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function questionShow($sesi_question_id)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }
        try {
            $question = ExamTemplateItem::with(['question.file', 'question.question_items', 'file',])
                ->where('uuid', $sesi_question_id)->first();
            return response()->json(
                new ExamTemplateItemResource($question)
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    // mobile
    protected function getPraTestMobile($template_id)
    {
        try {
            if (!empty($this->abilityPolicyIndex)) {
                $this->authorize($this->abilityPolicyIndex, $this->model);
            }
            $data = ExamTemplate::with('introduction.child')->where('id', $template_id)->first();
            return response()->json(
                new ExamTemplateResource($data)
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function getPraTestBahasaMobile()
    {
        return $this->getPraTestMobile(2);
    }

    public function getPraTestKarakterMobile()
    {
        return $this->getPraTestMobile(4);
    }

    public function getPraTestQnAMobile()
    {
        return $this->getPraTestMobile(3);
    }
}
