<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiExamTemplateRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "title" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "duration" => [
                "nullable",
            ],
            "is_randomized_question" => [
                "nullable",
            ],
            "is_randomized_items" => [
                "nullable",
            ],
            "retry_count" => [
                "nullable",
            ],
            "weight_total" => [
                "nullable",
            ],
            "weight_minimal" => [
                "nullable",
            ],
            "is_active" => [
                "nullable",
            ],
            "link_url" => [
                "nullable",
            ],
            "type" => [
                "nullable",
            ],
        ];
    }
}
