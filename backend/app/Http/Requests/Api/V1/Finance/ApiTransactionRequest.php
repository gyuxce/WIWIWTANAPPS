<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiTransactionRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "price_type" => [
                "required",
                "in:1,2",
            ],
            "payment_type" => [
                "required",
                "in:1,2",
            ],
            "user_id" => [
                "nullable",
            ],
            "number" => [
                "nullable",
            ],
            "issued_at" => [
                "nullable",
            ],
            "expired_at" => [
                "nullable",
            ],
            "total_recurrence" => [
                "nullable",
                "numeric"
            ]
        ];
    }

}