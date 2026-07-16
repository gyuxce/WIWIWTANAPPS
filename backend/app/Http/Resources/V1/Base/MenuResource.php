<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "slug" => $this->slug,
            "description" => $this->description,
            "created_at"=>convertToTimezone($this->created_at),
            "updated_at"=>convertToTimezone($this->updated_at),
        ];
    }
}
