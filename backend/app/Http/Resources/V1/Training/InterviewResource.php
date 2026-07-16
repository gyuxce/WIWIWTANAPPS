<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\InterviewTypeConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class InterviewResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "interview_date" => $this->interview_date,
            "position" => $this->position,
            "agency" => $this->agency,
            "link" => $this->link,
            "type" => $this->type,
            "type_label" =>
            InterviewTypeConstant::LIST[$this->type] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "deleted_at" => convertToTimezone($this->deleted_at),

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
            "user" => new UserResource($this->whenLoaded("user")),
        ];
    }
}
