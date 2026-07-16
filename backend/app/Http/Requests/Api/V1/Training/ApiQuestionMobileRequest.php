<?php

namespace App\Http\Requests\Api\V1\Training;

use App\Models\Training\Question;
use App\Models\Training\QuestionItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiQuestionMobileRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            'question.id' => 'required|exists:questions,uuid',
            'user_exam_id' => 'required|exists:user_exams,uuid',
            "question.question_items" => [
                "nullable",
                "array"
            ],
            "question.body_file_id" => [
                "nullable",
                "exists:file,uuid"
            ],
            "question.question_items.*.id" => [
                "exists:question_items,uuid",
                function ($attribute, $value, $fail) {
                    $questionId = $this->input('question.id');
                    $exists = QuestionItem::where('uuid', $value)
                        ->whereHas('question', function ($q) use ($questionId) {
                            $q->where('uuid', $questionId);
                        })
                        ->exists();

                    if (!$exists) {
                        $fail("$attribute is not found");
                    }
                },
            ]
        ];
    }
}
