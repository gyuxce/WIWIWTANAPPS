<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;

class ApiCreateUserRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "otp" => [
                "nullable",
                "boolean"
            ],
            "otp_method" => [
                "required_if:otp,true",
            ],
            "otp_receiver" => [
                "required_if:otp,true",
            ],
            "nip" => [
                "required",
            ],
            "email" => [
                "required",
                "email"
            ],
            "password" => [
                "required",
            ],
            "active" => [
                "nullable",
                "boolean",
            ],
        ];
    }
}