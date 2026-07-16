<?php

namespace App\Http\Requests\Api\V1\Base;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Services\Dolphin\DolphinAuth;

class ApiSettingRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "name" => [
                "nullable",
            ],
            "value" => [
                'nullable'
            ],
            "group" => [
                'nullable'
            ],
            "description" => [
                'nullable'
            ]
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'value.required' => __('validation.required', ['attribute' => 'value']),
        ];
    }
}
