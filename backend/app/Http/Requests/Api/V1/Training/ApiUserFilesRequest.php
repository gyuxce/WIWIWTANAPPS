<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiUserFilesRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "type" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "status" => [
                "nullable",
            ],
            "file_id" => [
                "nullable",
            ],
            "user_id" => [
                "nullable",
            ],
            "slug" => [
                "nullable",
            ],
            'file' => 'max:15360'

        ];
    }
}
