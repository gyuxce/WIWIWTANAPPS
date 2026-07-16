<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiExamTemplateItemRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "template_id" => [
                "nullable",
            ],
            "question_id" => [
                "nullable",
            ],
            "index" => [
                "nullable",
            ],
            "is_header" => [
                "nullable",
            ],
            "parent_id" => [
                "nullable",
            ],
            "title" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "body_type" => [
                "nullable",
            ],
            "body_url" => [
                "nullable",
            ],
            "body_file_id" => [
                "nullable",
            ],
            "language_type" => [
                "nullable",
            ],
            "duration" => [
                "nullable",
            ],
            "count_question" => [
                "nullable",
            ],
            "course_item_id" => [
                "nullable",
                "exists:course_items,uuid",
            ],
            "weight_minimum" => [
                "nullable",
            ],
        ];
    }
}
