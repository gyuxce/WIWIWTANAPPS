<?php

namespace App\Http\Resources\V1\Training;

use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Models\Training\UserExamQuestionItem;

class UserExamQuestionResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "created_by" => $this->created_by,
            "updated_by" => $this->updated_by,
            "deleted_by" => $this->deleted_by,
            "user_exam_id" => $this->user_exam_id,
            "question_id" => $this->question_id,
            "index" => $this->index,
            "o_title" => $this->o_title,
            "o_description" => $this->o_description,
            "o_body_type" => $this->o_body_type,
            "o_body_url" => $this->o_body_url,
            "o_body_file_id" => $this->o_body_file_id,
            "a_body_type" => $this->a_body_type,
            "a_body_text" => $this->a_body_text,
            "a_body_url" => $this->a_body_url,
            "a_body_file_id" => $this->a_body_file_id,
            "a_weight" => $this->a_weight,
            "o_weight_true" => $this->o_weight_true,
            "o_weight_null" => $this->o_weight_null,
            "o_weight_false" => $this->o_weight_false,
            "o_weight_min" => $this->o_weight_min,
            "o_weight_max" => $this->o_weight_max,
            "assessed_at" => convertToTimezone($this->assessed_at),
            "assessed_by" => $this->assessed_by,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "question" => new QuestionResource($this->whenLoaded("question")),
            "origin_file" => new FileResource($this->whenLoaded("origin_file")),
            "file" => new FileResource($this->whenLoaded("file")),
            "user_exam_question_item" => new UserExamQuestionItemResource($this->whenLoaded("user_exam_question_item")),
            "exam" => new UserExamResource($this->whenLoaded("exam")),
        ];
    }
}
