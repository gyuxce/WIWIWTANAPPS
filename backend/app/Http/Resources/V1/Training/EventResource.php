<?php

namespace App\Http\Resources\V1\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Http\Resources\V1\Base\UserResource;

class EventResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->uuid,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),
            "title"=> $this->title,
            "description"=> $this->description,
            "from"=> $this->from,
            "to"=> $this->to,
            "started_at"=> convertToTimezone($this->started_at),
            "finished_at"=> convertToTimezone($this->finished_at),
            "recording_file_id"=> $this->recording_file_id,
            "external_url"=> $this->external_url,
            "external_passkey"=> $this->external_passkey,
            "status"=> $this->status,
            "cover_file_id"=> $this->cover_file_id,
            "participant_max"=> $this->participant_max,
            "is_online"=> $this->is_online,
            "address_id"=> $this->address_id,
            "is_active"=> $this->is_active,

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "file" => new FileResource($this->whenLoaded("file")),
            "cover" => new FileResource($this->whenLoaded("cover")),
            "courseItem" => new CourseItemResource($this->whenLoaded("courseItem")),

        ];
    }

}