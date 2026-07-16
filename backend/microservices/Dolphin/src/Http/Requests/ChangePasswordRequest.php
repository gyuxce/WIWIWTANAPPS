<?php

namespace DolphinMicroservice\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangePasswordRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "password_old" => [
                "required"
            ],
            "password" => [
                "required",
                "confirmed",
                "min:6"
            ],
        ];
    }
}