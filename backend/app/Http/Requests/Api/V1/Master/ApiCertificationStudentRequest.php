<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiCertificationStudentRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "name" => [
                "nullable",
            ],
            "user_id" => [
                "required",
                "exists:users,uuid"
            ],
            "certification_id" => [
                "required",
                "exists:certifications,uuid"
            ],
            "location" => [
                "required",
            ],
            "cert_date" => [
                "required",
                "date_format:Y-m-d H:i",
            ],
            "cert_file_id" => [
                "required",
                "exists:files,uuid"
            ],
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => __('validation.required', ['attribute' => 'user_id']),
            'user_id.exists' => __('validation.exists', ['attribute' => 'user_id']),
            'certification_id.required' => __('validation.required', ['attribute' => 'certification_id']),
            'certification_id.exists' => __('validation.exists', ['attribute' => 'certification_id']),
            'location.required' => __('validation.required', ['attribute' => 'location']),
            'status.required' => __('validation.required', ['attribute' => 'status']),
            'cert_date.required' => __('validation.required', ['attribute' => 'cert_date']),
            'cert_file_id.required' => __('validation.required', ['attribute' => 'cert_file_id']),
            'cert_file_id.exists' => __('validation.exists', ['attribute' => 'cert_file_id']),
        ];
    }
}