<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiBatchUserRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "batch_id" => [
                "nullable",
            ],
            "program_id" => [
                "nullable",
            ],
            "user_id" => [
                "nullable",
            ],
            "number" => [
                "nullable",
            ],
            "from" => [
                "nullable",
            ],
            "to" => [
                "nullable",
            ],
            "remarks" => [
                "nullable",
            ],
            "file_id" => [
                "nullable",
            ],
            "status" => [
                "nullable",
            ],
            "transaction_id" => [
                "nullable",
            ],
            "transaction_status" => [
                "nullable",
            ],
            "transaction2_id" => [
                "nullable",
            ],
            "transaction2_status" => [
                "nullable",
            ],
        ];
    }
}
