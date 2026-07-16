<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\PratesStatusConstant;
use App\Constants\Training\UserExamStatusConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class UserExamResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        $mapping = [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),
            "number" => $this->number,
            "duration" => $this->duration,
            "requested_at" => convertToTimezone($this->requested_at),
            "scheduled_at" => convertToTimezone($this->scheduled_at),
            "expired_at" => convertToTimezone($this->expired_at),
            "started_at" => convertToTimezone($this->started_at),
            "finished_at" => convertToTimezone($this->finished_at),
            "weight_total" => ($this->weight_total),
            "weight_achieved" => $this->weight_achieved,
            "status_label" => UserExamStatusConstant::LIST[$this->status] ?? null,
            "status" => $this->status,
            "status_pratest" => $this->status_pr,
            "jadwal_tersedia" => $this->jadwal_tersedia,
            "file_tes_character_status" => $this->file_tes_character_status,
            "link" => $this->link,
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "template" => new ExamTemplateResource($this->whenLoaded("template")),
            "user" => new UserResource($this->whenLoaded("user")),
            "progress" => new ExamTemplateResource($this->whenLoaded("progress")),
            "exam_schedules" => ExamScheduleResource::collection($this->whenLoaded('exam_schedules')),
            "exam_schedule_active" => new ExamScheduleResource($this->whenLoaded('exam_schedule_active')),
            "fileTesCharacter" => new FileResource($this->whenLoaded('fileTesCharacter')),

        ];
        return $mapping;
    }
}
