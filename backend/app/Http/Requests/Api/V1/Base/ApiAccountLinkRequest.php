<?php

namespace App\Http\Requests\Api\V1\Base;

use Illuminate\Foundation\Http\FormRequest;

class ApiAccountLinkRequest extends FormRequest {
    
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "adapter" => [
                "nullable",
                "in:1,2,3",
            ],
        ];
    }

}