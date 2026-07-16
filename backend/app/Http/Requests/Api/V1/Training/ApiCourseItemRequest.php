<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiCourseItemRequest extends FormRequest {

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
            "course_id" => [
                "required",
                "exists:courses,uuid",
            ],
            "parent_id" => [
                "nullable",
                "exists:course_items,uuid",
            ],
            "group" => [
                "nullable",
            ],
            "is_header" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "article_id" => [
                "nullable",
                "exists:articles,uuid",
            ],
            "exam_template_id" => [
                "nullable",
                "exists:exam_templates,uuid",
            ],
            "event_id" => [
                "nullable",
                "exists:events,uuid",
            ],
            "index" => [
                "nullable",
            ],
            "type" => [
                "nullable",
            ],
            "program_type" => [
                "required",
                "in:1,2",
            ],
            "level_module" => [
                "nullable",
                "in:1,2,3,4,5",
            ],
            "access_module" => [
                "nullable",
                "in:1,2",
            ],
            "weight_minimum" => [
                "nullable",
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => __('validation.required', ['attribute' => 'title']),
            'course_id.exists' => __('validation.exists', ['attribute' => 'course']),
            'parent_id.exists' => __('validation.exists', ['attribute' => 'parent']),
            'article_id.exists' => __('validation.exists', ['attribute' => 'article']),
            'exam_template_id.exists' => __('validation.exists', ['attribute' => 'exam_template']),
            'event_id.exists' => __('validation.exists', ['attribute' => 'event']),
            'program_type.required' => __('validation.required', ['attribute' => 'program_type']),
            'level_module.required' => __('validation.required', ['attribute' => 'level_module']),
            'program_type.in' => __('validation.in', ['attribute' => 'program_type']),
            'level_module.in' => __('validation.in', ['attribute' => 'level_module']),
            'access_module.in' => __('validation.in', ['attribute' => 'access_module']),
        ];
    }

}