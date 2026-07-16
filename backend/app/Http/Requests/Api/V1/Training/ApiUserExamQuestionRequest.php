<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiUserExamQuestionRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "user_exam_id" => [
                "nullable",
            ],
            "question_id" => [
                "nullable",
            ],
            "index" => [
                "nullable",
            ],
            "o_title" => [
                "nullable",
            ],
            "o_description" => [
                "nullable",
            ],
            "o_body_type" => [
                "nullable",
            ],
            "o_body_url" => [
                "nullable",
            ],
            "o_body_file_id" => [
                "nullable",
            ],
            "a_body_type" => [
                "nullable",
            ],
            "a_body_text" => [
                "nullable",
            ],
            "a_body_url" => [
                "nullable",
            ],
            "a_body_file_id" => [
                "nullable",
            ],
            "o_weight_true" => [
                "nullable",
            ],
            "o_weight_null" => [
                "nullable",
            ],
            "o_weight_false" => [
                "nullable",
            ],
            "o_weight_min" => [
                "nullable",
            ],
            "o_weight_max" => [
                "nullable",
            ],
            "assessed_at" => [
                "nullable",
            ],
            "assessed_by" => [
                "nullable",
            ],
        ];
    }
}
