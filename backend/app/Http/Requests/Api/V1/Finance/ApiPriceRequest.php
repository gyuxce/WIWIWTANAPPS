<?php

namespace App\Http\Requests\Api\V1\Finance;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class ApiPriceRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "type" => [
                "nullable",
                "in:1,2",
            ],
            "subtype" => [
                "nullable",
            ],
            "program_id" => [
                "nullable",
            ],
            "amount" => [
                "nullable",
            ],
            "training_letter_file_id" => [
                "nullable",
                "exists:files,uuid",
            ],
            "installment_letter_file_id" => [
                "nullable",
                "exists:files,uuid",
            ],
        ];

    }

}