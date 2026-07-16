<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiInterviewRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "uuid" => [
                "nullable",
            ],
            "user_id" => [
                "nullable",
                "exists:users,uuid",
            ],
            "type" => [
                "nullable",
                Rule::in([1, 2]),
            ],
            "interview_date" => [
                "nullable",

            ],
            "name" => [
                "nullable",
            ],
            "position" => [
                "nullable",
            ],
            "agency" => [
                "nullable",
            ],
            "link" => [
                "nullable",
            ],
        ];
    }
}
