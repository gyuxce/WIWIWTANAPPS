<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiCertificationRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "name" => [
                "required",
            ],
            "description" => [
                "required",
            ],
            "detail" => [
                "required",
            ],
            "status" => [
                "required",
            ],
            "link" => [
                "required",
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'description.required' => __('validation.required', ['attribute' => 'description']),
            'detail.required' => __('validation.required', ['attribute' => 'detail']),
            'status.required' => __('validation.required', ['attribute' => 'status']),
            'link.required' => __('validation.required', ['attribute' => 'link']),
        ];
    }
}