<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiPaymentProofRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "transaction_id" => [
                "required",
                "exists:transactions,uuid",
            ],
            "installment_id" => [
                "required",
                "exists:installments,uuid",
            ],
            "payment_id" => [
                "required",
                "exists:payments,uuid",
            ],
            "date" => [
                "nullable",
            ],
            "adapter" => [
                "nullable",
            ],
            "currency_code" => [
                "nullable",
            ],
            "amount" => [
                "nullable",
            ],
            "from_bank_id" => [
                "nullable",
            ],
            "from_bank_number" => [
                "nullable",
            ],
            "from_bank_name" => [
                "nullable",
            ],
            "to_bank_id" => [
                "nullable",
            ],
            "to_bank_number" => [
                "nullable",
            ],
            "to_account_name" => [
                "nullable",
            ],
            "from_account_number" => [
                "nullable",
            ],
            "from_account_name" => [
                "nullable",
            ],
            "to_account_number" => [
                "nullable",
            ],
            "status" => [
                "nullable",
                "in:1,2,3"
            ],
            "file_id" => [
                "required",
                "exists:files,uuid",
            ],
        ];

    }

    public function messages()
    {
        return [
            'user_id.exists' => __('validation.exists', ['attribute' => 'user_id']),
            'transaction_id.exists' => __('validation.exists', ['attribute' => 'transaction_id']),
            'installment_id.exists' => __('validation.exists', ['attribute' => 'installment_id']),
            'file_id.exists' => __('validation.exists', ['attribute' => 'file_id']),
            'status.in' => __('validation.in', ['attribute' => 'status']),
        ];
    }

}