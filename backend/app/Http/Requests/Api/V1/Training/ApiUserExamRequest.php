<?php

namespace App\Http\Requests\Api\V1\Training;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiUserExamRequest extends FormRequest
{

    public function authorize()
    {

        return true;
    }

    public function rules()
    {
        return [
            "number" => [
                "nullable",
            ],
            "template_id" => [
                "nullable",
            ],
            "user_id" => [
                "nullable",
            ],
            "duration" => [
                "nullable",
            ],
            "requested_at" => [
                "nullable",
            ],
            "scheduled_at" => [
                "nullable",
            ],
            "expired_at" => [
                "nullable",
            ],
            "started_at" => [
                "nullable",
            ],
            "finished_at" => [
                "nullable",
            ],
            "weight_total" => [
                "nullable",
            ],
            "weight_achieved" => [
                "nullable",
            ],
            "status" => [
                "nullable",
            ],
            "file_tes_karakter_id" => [
                "nullable",
            ],
            "exam_schedules" => [
                "nullable",
            ],
            "link" => [
                "nullable",
            ],
        ];
    }
}
