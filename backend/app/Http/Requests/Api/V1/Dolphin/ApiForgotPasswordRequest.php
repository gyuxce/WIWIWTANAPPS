<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use App\Models\Base\User;
use Illuminate\Foundation\Http\FormRequest;

class ApiForgotPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            "email" => [
                "required",
                "string",
                "exists:users,email"
            ],
            "redirect_url" => [
                "required",
                "url"
            ],
            "is_mobile" => [
                "required",
                "in:0,1"
            ]
        ];
    }

    public function messages(): array
    { 
        return [
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.exists' => __('validation.exists', ['attribute' => 'email']),
            'redirect_url.required' => __('validation.required', ['attribute' => 'redirect URL']),
            'redirect_url.url' => __('validation.url', ['attribute' => 'redirect URL']),
            'is_mobile.required' => __('validation.required', ['attribute' => 'is_mobile']),
            'is_mobile.in' => __('validation.in', ['attribute' => 'is_mobile']),
        ];
    }
}