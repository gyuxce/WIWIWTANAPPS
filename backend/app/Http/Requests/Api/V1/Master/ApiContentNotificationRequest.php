<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiContentNotificationRequest extends FormRequest {
    
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
            "send_at" => [
                "required",
                "date_format:Y-m-d H:i",
                'after:'.date(DATE_ATOM, time() + (5 * 60 * 60))
            ],
            "repeat_each" => [
                "required",
            ],
            "status" => [
                "required",
            ],
            "is_active" => [
                "required",
            ],
            "target" => [
                "nullable",
                "array"
            ],
            "target.*.user_id" => [
                "exists:users,uuid"
            ],
            "target_status" => [
                "nullable",
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'description.required' => __('validation.required', ['attribute' => 'description']),
            'send_at.required' => __('validation.email', ['attribute' => 'send_at']),
            'send_at.after' => __('validation.after', ['attribute' => 'send_at']),
            'send_at.date_format' => __('validation.date_format', ['attribute' => 'send_at']),
            'repeat_each.required' => __('validation.required', ['attribute' => 'repeat_each']),
            'status.required' => __('validation.required', ['attribute' => 'status']),
            'is_active.required' => __('validation.required', ['attribute' => 'is_active']),
            'target.array' => __('validation.array', ['attribute' => 'target']),
        ];
    }
}