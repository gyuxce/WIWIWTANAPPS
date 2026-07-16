<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiCourseUpdateStatusRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "id" => [
                "required",
            ],
            "is_active" => [
                "required",
                "boolean"
            ]
        ];
    }

}