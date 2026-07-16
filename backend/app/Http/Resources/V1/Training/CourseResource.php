<?php

namespace App\Http\Resources\V1\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Constants\Training\CourseTypeConstant;

class CourseResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "title" => $this->title,
            "title_japan" => $this->title_japan,
            "description" => $this->description,
            "count_articles" => $this->count_articles,
            "count_events" => $this->count_events,
            "count_exam" => $this->count_exam,
            "type" => $this->type,
            "type_label" => CourseTypeConstant::LIST[$this->type] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),

            "cover" => new FileResource($this->whenLoaded("cover")),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
