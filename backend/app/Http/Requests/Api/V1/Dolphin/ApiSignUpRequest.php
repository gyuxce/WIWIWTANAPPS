<?php

namespace App\Http\Requests\Api\V1\Dolphin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Base\User;

class ApiSignUpRequest extends FormRequest
{
    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        if (request('email')) {
            $row = User::where('email', request('email'))->first();
        }

        return [
            "email" => [
                "required",
                "email",
                'unique:users,email,'.($row->id ?? 0).''
            ],
            "password" => [
                "required",
                "min:6",
                "confirmed"
            ],
            "password_confirmation" => [
                "required",
                "same:password"
            ],
            "email_verified_at" => [
                "nullable",
            ],
            "username" => [
                "nullable",
                // 'unique:users,username,'.($row->id ?? 0).''
            ],
            "is_active" => [
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
            "birthplace" => [
                "nullable",
            ],
            "dob" => [
                "nullable",
            ],
            "remember_token" => [
                "nullable",
            ],
            "ethnic_origin" => [
                "nullable",
            ],
            "id_card" => [
                "nullable",
                "digits:16",
            ],
            "blood_type" => [
                "in:1,2,3,4",
            ],
            "last_education" => [
                "in:1,2,3,4,5",
            ],
            "study_program" => [
                "nullable",
            ],
            "is_training" => [
                "nullable",
            ],
            "training_program" => [
                "in:1,2",
            ],
            "register_information" => [
                "in:1,2,3,4",
            ],
            "other_register_information" => [
                "nullable",
            ],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.email' => __('validation.email', ['attribute' => 'email']),
            'email.unique' => __('validation.unique', ['attribute' => 'email']),
            'password.required' => __('validation.required', ['attribute' => 'password']),
            'password.min' => __('validation.min.string', ['attribute' => 'password', 'min' => 6]),
            'password.confirmed' => __('validation.confirmed', ['attribute' => 'password']),
            'password_confirmation.required' => __('validation.required', ['attribute' => 'password confirmation']),
            'password_confirmation.same' => __('validation.same', ['attribute' => 'password confirmation']),
            'city_id.exists' => __('validation.exists', ['attribute' => 'city']),
            'blood_type.in' => __('validation.in', ['attribute' => 'blood type']),
            'last_education.in' => __('validation.in', ['attribute' => 'last education']),
            'training_program.in' => __('validation.in', ['attribute' => 'training program']),
            'register_information.in' => __('validation.in', ['attribute' => 'register information']),
        ];
    }
}