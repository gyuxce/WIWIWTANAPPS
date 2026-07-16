<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\ExamTemplateConstant;
use App\Constants\Training\UserExamTypeConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class ExamTemplateResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "title" => $this->title,
            "description" => $this->description,
            "duration" => $this->duration,
            "is_randomized_question" => $this->is_randomized_question,
            "is_randomized_items" => $this->is_randomized_items,
            "retry_count" => $this->retry_count,
            "weight_total" => $this->weight_total,
            "weight_minimal" => $this->weight_minimal,
            "is_active" => $this->is_active,
            "type" =>  $this->type ?? null,
            "type_label" => UserExamTypeConstant::LIST[$this->type] ?? null,
            "exam_template_type" =>  $this->exam_template_type ?? null,
            "exam_template_type_label" => ExamTemplateConstant::LIST[$this->exam_template_type] ?? null,
            "link_url" => $this->link_url,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),

            "introduction" => ExamTemplateItemResource::collection($this->whenLoaded("introduction")),
            "sesi" => ExamTemplateItemResource::collection($this->whenLoaded("sesi")),
            "currentSessionLanguage" => new ExamTemplateItemResource($this->whenLoaded("currentSessionLanguage")),
            "video" =>  new FileResource($this->whenLoaded("video")),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
