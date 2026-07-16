<?php

namespace App\Http\Requests\Api\V1\Base;

use Illuminate\Foundation\Http\FormRequest;

class ApiUpdateProfileMobileRequest extends FormRequest
{

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
            "email" => [
                "nullable",
            ],
            "phone" => [
                "nullable",
            ],
            "city_id" => [
                "nullable",
                "exists:cities,uuid",
            ],
            "address" => [
                "nullable",
            ],
            "profile_pic_id" => [
                "nullable",
                //"exists:files,id",
            ],
            "join_reason" => [
                "nullable"
            ],
            "name_alias" => [
                "nullable"
            ],
        ];
    }

    public function messages()
    {
        return [
            'city_id.exists' => __('validation.exists', ['attribute' => 'city']),
            'profile_pic_id.exists' => __('validation.exists', ['attribute' => 'profile_pic_id']),
        ];
    }
}
