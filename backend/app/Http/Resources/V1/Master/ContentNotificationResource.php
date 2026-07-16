<?php

namespace App\Http\Resources\V1\Master;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\ContentNotificationRepeatConstant;
use App\Constants\ContentNotificationStatusConstant;
use App\Constants\ContentNotificationTargetConstant;

class ContentNotificationResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "description" => $this->description,
            "send_at" => $this->send_at,
            "repeat_each"=> $this->repeat_each,
            "repeat_each_label"=> ContentNotificationRepeatConstant::LIST[$this->repeat_each] ?? null,
            "status"=> $this->status,
            "status_label"=> ContentNotificationStatusConstant::LIST[$this->status] ?? null,
            "is_active" => $this->is_active,
            "count_send" => $this->count_send,
            "link" => $this->link,
            "target_status"=> $this->target_status,
            "target_status_label"=> ContentNotificationTargetConstant::LIST[$this->target_status] ?? null,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "targets" => ContentNotificationTargetResource::collection($this->whenLoaded('targets')),
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
        ];
    }
}