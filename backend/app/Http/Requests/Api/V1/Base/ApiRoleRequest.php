<?php

namespace App\Http\Requests\Api\V1\Base;

use App\Models\Base\Role;
use Illuminate\Foundation\Http\FormRequest;

class ApiRoleRequest extends  FormRequest {
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        if (request('id')) {
            $row = Role::where('uuid', request('id'))->firstOrFail();
        }

        return [
            "name" => [
                "required",
                'unique:roles,name,'.($row->id ?? 0).''
            ],
            "status" => [
                "nullable",
            ],
            "role_menu.*.menu_id" => [
                "required",
                "exists:menus,uuid"
            ]
        ];
    }

    public function messages()
    {
        return [
            'name.required' => __('validation.required', ['attribute' => 'name']),
            'name.unique' => __('validation.unique', ['attribute' => 'name']),
            'role_menu.*.menu_id.required' => __('validation.required', ['attribute' => 'menu ID']),
            'role_menu.*.menu_id.exists' => __('validation.exists', ['attribute' => 'menu ID']),
        ];
    }
}
