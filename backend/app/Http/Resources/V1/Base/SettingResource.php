<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "name" => $this->name,
            "slug" => $this->slug,
            "value" => $this->value,
            "group" => $this->group,
            "description" => $this->description
        ];
    }
}
