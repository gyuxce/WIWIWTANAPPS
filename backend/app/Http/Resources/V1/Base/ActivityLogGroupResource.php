<?php

namespace App\Http\Resources\V1\Base;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "group_date" => $this['group_date'],
            "total" => $this['total_count'],
            "logs" => ActivityLogResource::collection($this['logs']),

        ];
    }
}
