<?php

namespace DolphinMicroservice\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RefreshTokenRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "refresh_token" => [
                "required"
            ],
        ];
    }
}