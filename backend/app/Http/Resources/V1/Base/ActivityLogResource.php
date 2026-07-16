<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "group_date" => $this->group_date,
            "module_uuid" => $this->module_uuid,
            "user_id" => $this->user_id,
            "action" => $this->action,
            "module" => $this->module,
            "description" => $this->description,
            "data" => $this->data,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "user" => new UserResource($this->whenLoaded('user'))
        ];
    }
}
