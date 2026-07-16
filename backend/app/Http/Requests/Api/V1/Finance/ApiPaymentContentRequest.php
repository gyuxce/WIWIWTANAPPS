<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiPaymentContentRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "title" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "total_content" => [
                "nullable",
            ],
            "price_type" => [
                "nullable",
                "in:1,2"
            ],
            "payment_type" => [
                "nullable",
                "in:1,2"
            ],
        ];

    }

}