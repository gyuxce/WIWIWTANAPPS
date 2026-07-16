<?php

namespace App\Http\Requests\Api\V1\Finance;

use Illuminate\Foundation\Http\FormRequest;

class ApiPaymentContentItemRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "payment_content_id" => [
                "required",
                "exists:payment_contents,uuid",
            ],
            "title" => [
                "nullable",
            ],
            "description" => [
                "nullable",
            ],
            "index" => [
                "nullable",
            ],
            "is_header" => [
                "nullable",
                "in:1,2"
            ],
            "language_type" => [
                "nullable",
                "in:1,2"
            ],
        ];

    }

    public function messages()
    {
        return [
            'payment_content_id.exists' => __('validation.exists', ['attribute' => 'payment_content_id']),
            'is_header.in' => __('validation.in', ['attribute' => 'is_header']),
            'language_type.in' => __('validation.in', ['attribute' => 'language_type']),
        ];
    }

}