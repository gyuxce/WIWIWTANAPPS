<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\QuestionsConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Resources\V1\Training\UserExamQuestionItemResource;

class QuestionResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),

            "type" => $this->type,
            "title" => $this->title,
            "description" => $this->description,
            "body_type" => $this->body_type,
            "body_url" => $this->body_url,
            "weight_true" => $this->weight_true,
            "weight_null" => $this->weight_null,
            "weight_false" => $this->weight_false,
            "weight_min" => $this->weight_min,
            "weight_max" => $this->weight_max,
            "index" => $this->index,
            "type_label" =>
            QuestionsConstant::LIST[$this->type] ?? null,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "file" => new FileResource($this->whenLoaded("file")),
            "question_items" => QuestionItemResource::collection($this->whenLoaded("question_items")),
            "userAnswareSelected" =>
            new UserExamQuestionItemResource($this->whenLoaded("userAnswareSelected")),
            "userReportSelected" =>
            new UserExamQuestionItemResource($this->whenLoaded("userReportSelected")),


        ];
    }
}
