<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiCourseRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "title" => [
                "required",
            ],
            "title_japan" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "count_articles" => [
                "nullable",
            ],
            "count_events" => [
                "nullable",
            ],
            "count_exam" => [
                "nullable",
            ],
            "type" => [
                "nullable",
                "in:1,2,3",
            ],
            "cover_id" => [
                "nullable",
                "exists:files,uuid"
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => __('validation.required', ['attribute' => 'title']),
            'description.required' => __('validation.required', ['attribute' => 'description']),
            'type.in' => __('validation.in', ['attribute' => 'type']),
            'cover_id.exists' => __('validation.exists', ['attribute' => 'cover_id']),
        ];
    }
}
