<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiUserCourseItemUpdateStatusRequest extends FormRequest {

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
            "status" => [
                "required",
                "in:1,2,3,4"
            ]
        ];
    }

}