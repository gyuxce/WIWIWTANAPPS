<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleMenuResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            "id" => $this->uuid,
            "role"=> new RoleResource($this->whenLoaded("role")),
            "menu"=> new MenuResource($this->whenLoaded("menu")),
        ];
    }
}
