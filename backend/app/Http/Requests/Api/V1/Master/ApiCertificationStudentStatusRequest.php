<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiCertificationStudentStatusRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "status" => [
                "required",
                "in:0,1,2"
            ],
        ];
    }

    public function messages()
    {
        return [
            'status.required' => __('validation.required', ['attribute' => 'status']),
        ];
    }
}