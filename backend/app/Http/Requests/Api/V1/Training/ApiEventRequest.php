<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiEventRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules(){
        return [
            "title" => [
                "required",
            ],
            "parent_id" => [
                "exists:course_items,uuid",
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "from" => [
                "nullable",
            ],
            "to" => [
                "nullable",
            ],
            "started_at" => [
                "nullable",
            ],
            "finished_at" => [
                "nullable",
            ],
            "recording_file_id" => [
                "exists:files,uuid",
                "nullable",
            ],
            "external_url" => [
                "nullable",
                "url",
            ],
            "external_passkey" => [
                "nullable",
            ],
            "status" => [
                "nullable",
            ],
            "cover_file_id" => [
                "exists:files,uuid",
                "nullable",
            ],
            "participant_max" => [
                "nullable",
            ],
            "is_online" => [
                "nullable",
            ],
            "address_id" => [
                "nullable",
            ],
            "is_active" => [
                "nullable",
            ],
        ];
    }

    public function messages(): array
    { 
        return [
            'title.required' => __('validation.required', ['attribute' => 'title']),
            'parent_id.exists' => __('validation.exists', ['attribute' => 'parent_id']),
            'recording_file_id.exists' => __('validation.exists', ['attribute' => 'recording_file_id']),
            'cover_file_id.exists' => __('validation.exists', ['attribute' => 'cover_file_id']),
            'external_url.url' => __('validation.url', ['attribute' => 'external URL']),
        ];
    }

}