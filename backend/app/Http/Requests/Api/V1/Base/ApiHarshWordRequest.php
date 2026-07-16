<?php

namespace App\Http\Requests\Api\V1\Base;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Services\Dolphin\DolphinAuth;

class ApiHarshWordRequest extends FormRequest {
    
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
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
        ];
    }

}