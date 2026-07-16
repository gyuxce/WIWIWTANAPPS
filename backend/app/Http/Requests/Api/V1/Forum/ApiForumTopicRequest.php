<?php

namespace App\Http\Requests\Api\V1\Forum;

use Illuminate\Foundation\Http\FormRequest;

class ApiForumTopicRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "name" => [
                "required",
            ],
            "description" => [
                "nullable",
            ],
            "type" => [
                "required",
                "in:1,2",
            ],
            "count_post" => [
                "nullable",
                "numeric",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'type.required' => __('validation.required', ['attribute' => 'description']),
        ];
    }

}