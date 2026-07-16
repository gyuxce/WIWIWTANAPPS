<?php

namespace App\Http\Requests\Api\V1\Master;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Base\User;
use App\Services\Dolphin\DolphinAuth;

class ApiStudentRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        if (request('id')) {
            $row = User::where('uuid', request('id'))->firstOrFail();
        }

        return [
            "name" => [
                "required",
            ],
            "email" => [
                "required",
                "email",
                'unique:users,email,'.($row->id ?? 0).''
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
                "required",
            ],
            "blood_type" => [
                "required",
                "in:1,2,3,4"
            ],
            "city_id" => [
                "required",
                "exists:cities,uuid",
            ],
            "birthplace" => [
                "required",
            ],
            "dob" => [
                "required",
                "before:".now()->subYears(10)->toDateString()
            ],
            "training_program" => [
                "required",
                "in:1,2"
            ],
            "study_program" => [
                "required",
            ],
            "certificate_id" => [
                "required",
                "exists:files,uuid"
            ],
            "is_training" => [
                "required",
                "in:0,1"
            ],
            "cv_id" => [
                "required",
                "exists:files,uuid"
            ],
            "id_card" => [
                "required",
                "numeric"
            ],
            "ethnic_origin" => [
                "required",
            ]
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.email' => __('validation.email', ['attribute' => 'email']),
            'email.unique' => __('validation.unique', ['attribute' => 'email']),
            'address.required' => __('validation.required', ['attribute' => 'address']),
            'blood_type.required' => __('validation.required', ['attribute' => 'blood_type']),
            'birthplace.required' => __('validation.required', ['attribute' => 'dob']),
            'training_program.required' => __('validation.required', ['attribute' => 'training_program']),
            'study_program.required' => __('validation.required', ['attribute' => 'study_program']),
            'dob.required' => __('validation.required', ['attribute' => 'birthplace']),
            'city_id.exists' => __('validation.exists', ['attribute' => 'city']),
            'role_id.required' => __('validation.required', ['attribute' => 'role']),
            'role_id.exists' => __('validation.exists', ['attribute' => 'role']),
            'certificate_id.exists' => __('validation.exists', ['attribute' => 'certificate']),
            'certificate_id.required' => __('validation.required', ['attribute' => 'certificate']),
            'cv_id.exists' => __('validation.exists', ['attribute' => 'certificate']),
            'cv_id.required' => __('validation.required', ['attribute' => 'cv']),
            'id_card.required' => __('validation.required', ['attribute' => 'id_card']),
            'ethnic_origin.required' => __('validation.required', ['attribute' => 'ethnic_origin']),
            'dob.before' => __('validation.before', ['attribute' => 'date of birth', 'date' => now()->subYears(10)->toDateString()]),
        ];
    }
}