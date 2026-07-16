<?php

namespace App\Http\Requests\Api\V1\Forum;

use Illuminate\Foundation\Http\FormRequest;

class ApiForumPostRequest extends FormRequest
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
            "description" => [
                "required",
            ],
            "topic_id" => [
                "exists:forum_topics,uuid",
            ],
            "is_draft" => [
                "required",
                "boolean",
            ],
            "is_publish" => [
                "required",
                "boolean",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => __('validation.required', ['attribute' => 'title']),
            'description.required' => __('validation.required', ['attribute' => 'description']),
            'topic_id.exists' => __('validation.exists', ['attribute' => 'topic']),
            'is_draft.required' => __('validation.required', ['attribute' => 'is_draft']),
            'is_publish.required' => __('validation.required', ['attribute' => 'is_publish']),
        ];
    }

}