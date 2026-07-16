<?php

namespace App\Http\Resources\V1\Forum;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Forum\ForumTopicTypeConstant;

class ForumTopicResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "description" => $this->description,
            "type" => $this->type,
            "count_post" => $this->count_post,
            "type_label"=> ForumTopicTypeConstant::LIST[$this->type] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}