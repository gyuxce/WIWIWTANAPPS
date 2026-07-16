<?php

namespace App\Http\Requests\Api\V1\Forum;

use Illuminate\Foundation\Http\FormRequest;

class ApiForumReportRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "notes" => [
                "required",
            ],
            "post_id" => [
                "nullable",
                "exists:forum_posts,uuid",
            ],
            "comment_id" => [
                "nullable",
                "exists:forum_comments,uuid",
            ],
            "status" => [
                "nullable",
            ],
            "type" => [
                "nullable",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'notes.required' => __('validation.required', ['attribute' => 'notes']),
            'post_id.exists' => __('validation.exists', ['attribute' => 'post']),
            'comment_id.exists' => __('validation.exists', ['attribute' => 'comment']),
        ];
    }
}