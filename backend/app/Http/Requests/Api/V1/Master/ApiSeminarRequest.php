<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;

class ApiSeminarRequest extends FormRequest
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
            "link" => [
                "required",
                "url"
            ],
            "description" => [
                "required",
            ],
            "started_at" => [
                "required",
            ],
            "finished_at" => [
                "required",
            ],
            "status" => [
                "nullable",
                "in:0,1",
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
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'link.required' => __('validation.required', ['attribute' => 'link']),
            'description.required' => __('validation.required', ['attribute' => 'description']),
            'started_at.required' => __('validation.required', ['attribute' => 'started_at']),
            'finished_at.required' => __('validation.required', ['attribute' => 'finished_at']),
            'link.url' => __('validation.url', ['attribute' => 'link URL']),
            'status.in' => __('validation.in', ['attribute' => 'status']),
            'cover_id.exists' => __('validation.exists', ['attribute' => 'cover_id']),
        ];
    }

}