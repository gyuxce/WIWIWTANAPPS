<?php

namespace App\Http\Requests\Api\V1\Sailfish;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiPushNotificationRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            "tokens" => [
                "array",
                "required",
                "exists:fcm_tokens,token"
            ],
            "title" => [
                "required",
            ],
            "body" => [
                "required"
            ],
            "data" => [
                "nullable",
                "array"
            ],
            // "image" => [
            //     "nullable",
            // ],
        ];
    }
}