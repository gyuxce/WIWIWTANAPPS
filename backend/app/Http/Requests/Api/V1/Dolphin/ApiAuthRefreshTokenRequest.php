<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiAuthRefreshTokenRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "refresh_token" => [
                "required",
            ],
        ];
    }

    public function messages()
    {
        return [
            'refresh_token.required' => __('validation.required', ['attribute' => 'refresh_token']),
        ];
    }

}