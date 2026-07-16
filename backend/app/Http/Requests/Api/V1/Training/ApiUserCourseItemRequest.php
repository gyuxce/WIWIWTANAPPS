<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiUserCourseItemRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "user_id" => [
                "nullable",
            ],
            "course_id" => [
                "nullable",
            ],
            "item_id" => [
                "nullable",
            ],
            "progress" => [
                "nullable",
            ],
            "user_exam_id" => [
                "nullable",
            ],
            "event_id" => [
                "nullable",
            ],
            "is_skipped" => [
                "nullable",
            ],
            "status" => [
                "nullable",
            ],
        ];
    }
}
