<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiReminderPratestLanguageRequest extends FormRequest {

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "note" => [
                "required",
            ],
        ];
    }
}