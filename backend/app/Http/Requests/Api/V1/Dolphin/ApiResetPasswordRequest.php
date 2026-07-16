<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiResetPasswordRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "password" => [
                "required",
                "min:6",
                "confirmed"
            ],
            "password_confirmation" => [
                "required",
                "same:password"
            ],
            "is_mobile" => [
                "required",
                "in:0,1"
            ]
        ];
    }

    public function messages()
    {
        return [
            'password.required' => __('validation.required', ['attribute' => 'password']),
            'password.min' => __('validation.min.string', ['attribute' => 'password', 'min' => 6]),
            'password.confirmed' => __('validation.confirmed', ['attribute' => 'password']),
            'password_confirmation.required' => __('validation.required', ['attribute' => 'password confirmation']),
            'password_confirmation.same' => __('validation.same', ['attribute' => 'password confirmation']),
            'is_mobile.required' => __('validation.required', ['attribute' => 'is_mobile']),
            'is_mobile.in' => __('validation.in', ['attribute' => 'is_mobile']),
        ];
    }

}