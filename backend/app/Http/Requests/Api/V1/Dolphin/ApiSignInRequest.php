<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiSignInRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "email" => [
                "required",
                "exists:users,email"
            ],
            "password" => [
                "required",
            ],
            "is_mobile" => [
                "required",
                "in:0,1"
            ],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.exists' => __('validation.exists', ['attribute' => 'email']),
            'password.required' => __('validation.required', ['attribute' => 'password']),
            'is_mobile.required' => __('validation.required', ['attribute' => 'is_mobile']),
            'is_mobile.in' => __('validation.in', ['attribute' => 'is_mobile']),
        ];
    }
}