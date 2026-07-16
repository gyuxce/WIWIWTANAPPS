<?php

namespace App\Http\Requests\Api\V1\Forum;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiForumCommentRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "comment" => [
                "required",
            ],
            "parent_id" => [
                "nullable",
                "exists:forum_comments,uuid"
            ],
            "replied_to" => [
                "nullable",
                "exists:users,uuid"
            ],
            "post_id" => [
                "nullable",
                "exists:forum_posts,uuid"
            ],
            // "index" => [
            //     "nullable",
            // ],
            // "is_publish" => [
            //     "nullable",
            // ],
            // "count_like" => [
            //     "nullable",
            // ],
            // "count_report" => [
            //     "nullable",
            // ],
        ];

    }

    public function messages()
    {
        return [
            'comment.required' => __('validation.required', ['attribute' => 'comment']),
            'parent_id.exists' => __('validation.exists', ['attribute' => 'parent comment']),
            'post_id.required' => __('validation.required', ['attribute' => 'post']),
            'post_id.exists' => __('validation.exists', ['attribute' => 'post']),
            'replied_to.exists' => __('validation.exists', ['attribute' => 'user']),
        ];
    }

}