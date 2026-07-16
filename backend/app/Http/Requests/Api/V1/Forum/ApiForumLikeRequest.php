<?php

namespace App\Http\Requests\Api\V1\Forum;

use Illuminate\Foundation\Http\FormRequest;

class ApiForumLikeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "description" => [
                "nullable",
            ],
            "post_id" => [
                "nullable",
                "exists:forum_posts,uuid",
            ],
            "comment_id" => [
                "nullable",
                "exists:forum_comments,uuid",
            ],
        ];
    }

    public function messages()
    {
        return [
            'post_id.exists' => __('validation.exists', ['attribute' => 'post']),
            'comment_id.exists' => __('validation.exists', ['attribute' => 'comment']),
        ];
    }

}