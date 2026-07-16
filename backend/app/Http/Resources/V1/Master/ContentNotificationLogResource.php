<?php

namespace App\Http\Resources\V1\Master;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\ContentNotificationStatusConstant;

class ContentNotificationLogResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "content" => new ContentNotificationResource($this->content_notification),
            "user" => new UserResource($this->user),
            "created_at" => convertToTimezone($this->created_at),
        ];
    }
}