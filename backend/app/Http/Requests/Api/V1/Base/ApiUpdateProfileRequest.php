<?php

namespace App\Http\Requests\Api\V1\Base;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiUpdateProfileRequest extends FormRequest {
    
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
            "name_alias" => [
                "nullable",
            ],
            "profile_pic_id" => [
                "nullable",
                "exists:files,uuid",
            ],
        ];
    }

    public function messages()
    {
        return [
            'profile_pic_id.exists' => __('validation.exists', ['attribute' => 'profile_pic_id']),
        ];
    }
}