<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HarshWordResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "name"=> $this->name,
            "created_at" => convertToTimezone($this->created_at),
            // "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            // "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            // "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        ];
    }

}