<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiDocumentRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "user_id" => [
                "nullable",
            ],
            "type" => [
                "nullable",
            ],
            "remarks" => [
                "nullable",
            ],
            "file_id" => [
                "nullable",
            ],
            "is_verified" => [
                "nullable",
            ],
            "verified_by" => [
                "nullable",
            ],
            "verified_at" => [
                "nullable",
            ],
        ];
    }
}
