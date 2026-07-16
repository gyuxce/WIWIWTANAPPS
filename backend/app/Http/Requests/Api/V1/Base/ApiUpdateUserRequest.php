<?php

namespace App\Http\Requests\Api\V1\Base;

use App\Constants\PhaseSettingConstant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiUpdateUserRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        if (request('id')) {
            $row = User::where('uuid', request('id'))->firstOrFail();
        }

        $rules = [
            "name" => [
                "nullable",
            ],
            "email" => [
                "nullable",
                "email",
                'unique:users,email,' . ($row->id ?? 0) . ''
            ],
            "email_verified_at" => [
                "nullable",
            ],
            "password" => [
                "nullable",
                "min:6",
            ],
            "password_confirmation" => [
                "nullable",
                "same:password",
            ],
            "username" => [
                "nullable",
            ],
            "is_active" => [
                "nullable",
            ],
            "active_date" => [
                "nullable",
            ],
            "phone" => [
                "nullable",
            ],
            "address" => [
                "nullable",
            ],
            "city_id" => [
                "nullable",
                "exists:cities,uuid",
            ],
            "role_id" => [
                "nullable",
                "exists:roles,uuid",
            ],
            "birthplace" => [
                "nullable",
            ],
            "dob" => [
                "nullable",
                "before:" . now()->subYears(10)->toDateString()
            ],
            "remember_token" => [
                "nullable",
            ],
            "interview_status" => [
                "nullable",
            ],
            "interview_count" => [
                "nullable",
            ],
            "blood_type" => [
                "nullable",
            ],
            "last_education" => [
                "nullable",
            ],
            "id_card" => [
                "nullable",
            ],
            "study_program" => [
                "nullable",
            ],
        ];

        if (isset($row) && $row->last_phase < PhaseSettingConstant::PHASE_PAYMENT) {
            $rules['training_program'] = [
                "nullable",
            ];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.email' => __('validation.email', ['attribute' => 'email']),
            'email.unique' => __('validation.unique', ['attribute' => 'email']),
            'password.required' => __('validation.required', ['attribute' => 'password']),
            'password.min' => __('validation.min.string', ['attribute' => 'password', 'min' => 6]),
            'password_confirmation.required' => __('validation.required', ['attribute' => 'password confirmation']),
            'password_confirmation.same' => __('validation.same', ['attribute' => 'password confirmation', 'other' => 'password']),
            'city_id.exists' => __('validation.exists', ['attribute' => 'city']),
            'role_id.required' => __('validation.required', ['attribute' => 'role']),
            'role_id.exists' => __('validation.exists', ['attribute' => 'role']),
            'dob.before' => __('validation.before', ['attribute' => 'date of birth', 'date' => now()->subYears(10)->toDateString()]),
        ];
    }
}
