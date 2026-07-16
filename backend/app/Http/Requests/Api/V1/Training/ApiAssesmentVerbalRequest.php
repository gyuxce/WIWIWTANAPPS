<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;

class ApiAssesmentVerbalRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "working_date" => [
                "nullable",
            ],
            "link" => [
                "required",
                "url"
            ],
        ];
    }

}