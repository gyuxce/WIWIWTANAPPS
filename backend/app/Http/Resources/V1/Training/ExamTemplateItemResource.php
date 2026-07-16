<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\LanguageSettingConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class ExamTemplateItemResource extends JsonResource
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
            "index" => $this->index,
            "is_header" => $this->is_header,
            "title" => $this->title,
            "description" => $this->description,
            "body_type" => $this->body_type,
            "body_url" => $this->body_url,
            "is_introduction" => $this->is_introduction,
            "language_type" => $this->language_type,
            "duration" => $this->duration,
            "count_question" => $this->count_question,
            "language_type_label" => LanguageSettingConstant::LIST[$this->language_type] ?? null,
            "weight_minimum" => $this->weight_minimum,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "template" => new ExamTemplateResource($this->whenLoaded("template")),
            "question" => QuestionResource::collection($this->whenLoaded("question")),
            "child" => ExamTemplateItemResource::collection($this->whenLoaded("child")),
            "courseItem" => new CourseItemResource($this->whenLoaded("courseItem")),
            "userStartedSession" => new UserSessionResource($this->whenLoaded("userStartedSession")),
            "file" => new FileResource($this->whenLoaded("file")),
        ];
    }
}
