<?php

namespace DolphinMicroservice\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SignupRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
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
                "required",
            ],
            "address" => [
                "required",
            ],
            "city_id" => [
                "required",
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
            "blood_type" => [
                "in:1,2,3,4",
            ],
            "last_education" => [
                "in:1,2,3,4,5",
            ],
            "is_training" => [
                "in:0,1",
            ],
            "register_information" => [
                "in:1,2,3,4",
            ],
        ];
    }
}