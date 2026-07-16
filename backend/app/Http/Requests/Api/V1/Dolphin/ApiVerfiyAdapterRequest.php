<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiVerfiyAdapterRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "access_token" => [
                "required",
            ],
        ];
    }

    public function messages()
    {
        return [
            'access_token.required' => __('validation.required', ['attribute' => 'access_token']),
        ];
    }
}