<?php

namespace App\Http\Resources\V1\Training;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class UserExamQuestionItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "uuid" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "is_selected" => $this->is_selected,
            "index" => $this->index,
            "o_description" => $this->o_description,
            "o_body_type" => $this->o_body_type,
            "o_body_url" => $this->o_body_url,
            "o_body_file_id" => $this->o_body_file_id,
            "o_is_correct" => $this->o_is_correct,
            "o_weight" => $this->o_weight,
            "a_body_type" => $this->a_body_type,
            "a_body_text" => $this->a_body_text,
            "a_body_url" => $this->a_body_url,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "userExam" => new UserExamResource($this->whenLoaded("userExam")),
            "question" => new QuestionResource($this->whenLoaded("question")),
            "question_item" => new QuestionItemResource($this->whenLoaded("question_item")),
        ];
    }
}
