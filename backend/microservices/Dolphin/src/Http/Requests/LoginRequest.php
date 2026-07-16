<?php

namespace DolphinMicroservice\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
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
                "email"
            ],
            "password" => [
                "required",
            ],
            "platform_id" => [
                "required",
                "integer"
            ]

        ];
    }
}