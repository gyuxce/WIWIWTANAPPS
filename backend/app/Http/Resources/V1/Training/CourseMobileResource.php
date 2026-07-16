<?php

namespace App\Http\Resources\V1\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Training\CourseTypeConstant;
use App\Http\Resources\V1\Base\FileResource;

class CourseMobileResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "title" => $this->title,
            "title_japan" => $this->title_japan,
            "description" => $this->description,
            "type_label" => CourseTypeConstant::LIST[$this->type] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "materi_count" => $this->materi_count,
            "materi_count_progress" => $this->materi_count_progress,
            "virtual_count" => $this->virtual_count,
            "virtual_count_progress" => $this->virtual_count_progress,
            "assesment_count" => $this->assesment_count,
            "assesment_count_progress" => $this->assesment_count_progress,
            "percent" => $this->materi_count > 0 ? number_format(($this->materi_count_progress / $this->materi_count) * 100, 2) : 0,
            "cover" => new FileResource($this->whenLoaded("cover")),
        ];
    }
}
