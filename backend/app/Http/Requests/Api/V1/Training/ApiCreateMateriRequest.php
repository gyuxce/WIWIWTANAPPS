<?php

namespace App\Http\Requests\Api\V1\Training;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiCreateMateriRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            "course_item_id" => [
                "required",
                "exists:course_items,uuid",
            ],
            "contents" => [
                "nullable",
                "array",
            ],
            "contents.*.id" => [
                "nullable",
            ],
            "contents.*.title" => [
                "nullable",
            ],
            "contents.*.description" => [
                "nullable",
            ],
            "contents.*.body_type" => [
                "nullable",
                Rule::in([1, 2, 3]),
            ],
            "contents.*.body_url" => [
                "nullable",
            ],
            "contents.*.duration" => [
                "nullable",
            ],
            "contents.*.body_text" => [
                "nullable",
            ],
            "contents.*.body_file_id" => [
                "nullable",
                "exists:files,uuid",
            ],
            "contents.*.cover_file_id" => [
                "nullable",
                "exists:files,uuid",
            ],

        ];
    }
}
