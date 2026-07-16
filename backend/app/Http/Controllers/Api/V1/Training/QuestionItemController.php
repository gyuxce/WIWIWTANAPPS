<?php

namespace App\Http\Controllers\Api\V1\Training;

use App\Constants\Training\QuestionsConstant;
use App\Models\Training\QuestionItem;
use App\Http\Resources\V1\Training\QuestionItemResource;
use App\Http\Requests\Api\V1\Training\ApiQuestionItemRequest;
use App\Http\Requests\Api\V1\Training\ApiQuestionMobileRequest;
use App\Http\Requests\Api\V1\Training\ApuQuestionMobileUpdateRequest;
use App\Http\Resources\V1\Training\ExamTemplateItemResource;
use App\Models\Base\File;
use App\Models\Training\ExamTemplateItem;
use App\Models\Training\Question;
use App\Models\Training\UserExam;
use App\Models\Training\UserExamQuestion;
use App\Models\Training\UserExamQuestionItem;
use App\Services\BaseCrud\BaseCrud;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionItemController extends BaseCrud
{
    public $model = QuestionItem::class;
    public $resource = QuestionItemResource::class;
    public $storeValidator = ApiQuestionItemRequest::class;
    public $updateValidator = ApiQuestionItemRequest::class;
    public $defaultOrder = "id";
    public $modelKey = "uuid";
    public $cacheInMinute = 10;

    public function getQuestionMobile($sesi_question_id)
    {
        if (!empty($this->abilityPolicyIndex)) {
            $this->authorize($this->abilityPolicyIndex, $this->model);
        }
        try {
            $question = ExamTemplateItem::with(['userStartedSession', 'question.file', 'question.question_items', 'file', 'question.userAnswareSelected.question_item'])
                ->where('uuid', $sesi_question_id)->first();

            return response()->json([
                'data' => new ExamTemplateItemResource($question)
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function answerQuestionAdd(ApiQuestionMobileRequest $request)
    {
        try {
            DB::beginTransaction();
            $user_exam = UserExam::where('uuid', $request->user_exam_id)->firstOrFail();
            $question = Question::where('uuid', $request->question['id'])->firstOrFail();
            $file = '';
            if (isset($request->question['a_body_file_id'])) {
                $file = File::where('uuid', $request->question['a_body_file_id'])->first();
                if (!$file) {
                    throw new \Exception('File not found');
                }
            }
            $cekAnsware = UserExamQuestion::where('user_exam_id', $user_exam->id)->where('question_id', $question->id)->first();
            if ($cekAnsware) {
                // throw new \Exception('Soal telah dijawab');
                UserExamQuestionItem::where('user_exam_id', $user_exam->id)->where('question_id', $question->id)->delete();  // delete all records in UserExamQuestionItem
            }

            $question_items = [];
            $answare_correct = null;
            $item_result = null;
            if (isset($request->question['question_items']) && count($request->question['question_items']) > 0) {
                foreach ($request->question['question_items'] as $items) {
                    $question_items_o = QuestionItem::where('uuid', $items['id'])->firstOrFail();
                    $question_items[] = [
                        'uuid' => Str::uuid()->toString(),
                        'user_exam_id' => $user_exam->id,
                        'question_id' => $question->id,
                        'question_item_id' => $question_items_o->id,
                        'is_selected' => $items['is_selected'],
                        'index' => $question_items_o->index,
                        'o_description' => $question_items_o->description,
                        'o_body_type' => $question_items_o->body_type,
                        'o_body_url' => $question_items_o->body_url,
                        'o_body_file_id'  => $question_items_o->body_file_id,
                        'o_is_correct' => $question_items_o->is_correct,
                        'o_weight' => $question_items_o->weight,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    if ($items['is_selected']) {
                        $item_result = $question_items_o->weight;
                    }
                    if ($items['is_selected'] && $question_items_o->is_correct) {
                        $answare_correct = 1;
                    }
                }

                if (count($question_items) > 0) {
                    UserExamQuestionItem::insert($question_items);
                    if (!$answare_correct) {
                        $answare_correct = 2;
                    }
                }
            }

            $result = null;
            if ($question->type == QuestionsConstant::MULTI_CHOICE_VALUE) {
                $result = $item_result;
            } else {
                if ($answare_correct) {
                    $result = $answare_correct === 1 ? $question->weight_true : $question->weight_false;
                } else {
                    $result = $question->weight_null;
                }
            }

            $userExamQuestionData = UserExamQuestion::updateOrCreate(
                [
                    'user_exam_id' => $user_exam->id,
                    'question_id' => $question->id,
                ],
                [
                    "o_title" => $question->title,
                    "o_description" => $question->description,
                    "o_body_type" => $question->type,
                    "o_body_url" => $question->body_url,
                    "o_body_file_id" => $question->body_file_id,
                    "a_body_type" => $request->question['a_body_type'] ?? '',
                    "a_body_text" => $request->question['a_body_text'] ?? '',
                    "a_body_url" => $request->question['a_body_url'] ?? '',
                    "a_body_file_id" => $file ? $file->id : '',
                    "a_weight" => $result,
                    "o_weight_true" => $question->weight_true,
                    "o_weight_null"  => $question->weight_null,
                    "o_weight_false" => $question->weight_false,
                    "o_weight_min" => $question->weight_min,
                    "o_weight_max" => $question->weight_max,
                ]
            );
        
            if ($userExamQuestionData->wasRecentlyCreated) {
                $userExamQuestionData->uuid = Str::uuid()->toString();
                $userExamQuestionData->created_at = now();
                $userExamQuestionData->updated_at = now();
                $userExamQuestionData->save();
            }

            DB::commit();
            return response()->json(
                [
                    'message' => 'Berhasil menjawab',
                ]
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function answerQuestionUpdate(ApuQuestionMobileUpdateRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $question = Question::where('uuid', $id)->firstOrFail();
            $user_exam = UserExam::where('uuid', $request->user_exam_id)->firstOrFail();
            $user_exam_question = UserExamQuestion::where('user_exam_id', $user_exam->id)
                ->where('question_id', $question->id)->firstOrFail();

            $question_items = [];
            $answare_correct = null;
            if (isset($request->question['question_items']) && count($request->question['question_items']) > 0) {
                foreach ($request->question['question_items'] as $items) {
                    $question_items_o = QuestionItem::where('uuid', $items['id'])->firstOrFail();
                    $question_items[] = [
                        'uuid' => Str::uuid()->toString(),
                        'user_exam_id' => $user_exam->id,
                        'question_id' => $question->id,
                        'question_item_id' => $question_items_o->id,
                        'is_selected' => $items['is_selected'],
                        'index' => $question_items_o->index,
                        'o_description' => $question_items_o->description,
                        'o_body_type' => $question_items_o->body_type,
                        'o_body_url' => $question_items_o->body_url,
                        'o_body_file_id'  => $question_items_o->body_file_id,
                        'o_is_correct' => $question_items_o->is_correct,
                        'o_weight' => $question_items_o->weight,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    if ($items['is_selected'] && $question_items_o->is_correct) {
                        $answare_correct = 1;
                    }
                }

                UserExamQuestionItem::where('question_id', $question->id)
                    ->where('user_exam_id', $user_exam->id)->delete();
                if (count($question_items) > 0) {
                    UserExamQuestionItem::insert($question_items);
                    if (!$answare_correct) {
                        $answare_correct = 2;
                    }
                }
            }

            $user_exam_question->update(
                [
                    "question_id" => $question->id,
                    "o_title" => $question->title,
                    "o_description" => $question->description,
                    "o_body_type" => $question->body_type,
                    "o_body_url" => $question->body_url,
                    "o_body_file_id" => $question->body_file_id,
                    "a_body_type" => $request->question['a_body_type'],
                    "a_body_text" => $request->question['a_body_text'],
                    "a_body_url" => $request->question['a_body_url'],
                    "a_body_file_id" => $request->question['a_body_file_id'],
                    "a_weight" => $answare_correct ? ($answare_correct === 1) ? $question->weight_true : $question->weight_false : $question->weight_null,
                    "o_weight_true" => $question->weight_true,
                    "o_weight_null"  => $question->weight_null,
                    "o_weight_false" => $question->weight_false,
                    "o_weight_min" => $question->weight_min,
                    "o_weight_max" => $question->weight_max,
                    "updated_at" => now(),
                ]
            );

            DB::commit();
            return response()->json(
                [
                    'message' => 'Berhasil menjawab'
                ]
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
