<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiChangePasswordRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "old_password" => [
                "nullable",
                "min:6",
            ],
            "password" => [
                "required",
                "min:6",
                "confirmed"
            ],
            "password_confirmation" => [
                "required",
                "same:password"
            ]
        ];
    }

    public function messages()
    {
        return [
            'password.required' => __('validation.required', ['attribute' => 'kata sandi']),
            'password.min' => __('validation.min.string', ['attribute' => 'kata sandi', 'min' => 6]),
            'password.confirmed' => __('validation.confirmed', ['attribute' => 'kata sandi']),
            'password_confirmation.required' => __('validation.required', ['attribute' => 'konfirmasi kata sandi']),
            'password_confirmation.same' => __('validation.same', ['attribute' => 'konfirmasi kata sandi']),
        ];
    }

}