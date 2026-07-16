<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiPaymentProofUpdateStatusRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "status" => [
                "required",
                "in:1,2,3"
            ],
            "note" => [
                "nullable",
            ],
            "total_amount_approved" => [
                "nullable",
            ],
        ];
    }

    public function messages()
    {
        return [
            'status.in' => __('validation.in', ['attribute' => 'status']),
        ];
    }

}