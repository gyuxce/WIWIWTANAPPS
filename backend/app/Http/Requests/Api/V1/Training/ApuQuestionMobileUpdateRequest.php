<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApuQuestionMobileUpdateRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            'user_exam_id' => 'required|exists:user_exams,uuid',
            "question.question_items" => [
                "nullable",
                "array"
            ],
            "question.question_items.*.id" => [
                "exists:question_items,uuid"
            ]
        ];
    }
}
