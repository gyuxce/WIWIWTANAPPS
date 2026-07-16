<?php

namespace App\Http\Resources\V1\Master;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class ContentNotificationTargetResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "user" => new UserResource($this->whenLoaded("user")),
            // "notification" => new ContentNotificationResource($this->whenLoaded("createdBy")),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
        ];
    }
}