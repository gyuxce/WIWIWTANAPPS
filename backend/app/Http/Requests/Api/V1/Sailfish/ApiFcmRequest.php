<?php

namespace App\Http\Requests\Api\V1\Sailfish;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiFcmRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "user_id" => [
                "required",
                "exists:users,uuid"
            ],
            "os" => [
                "required",
            ],
            "token" => [
                "required",
            ],
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => __('validation.required', ['attribute' => 'user_id']),
            'os.required' => __('validation.required', ['attribute' => 'os']),
            'token.required' => __('validation.required', ['attribute' => 'token']),
            'user_id.exists' => __('validation.exists', ['attribute' => 'user_id']),
        ];
    }
}