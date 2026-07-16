<?php

namespace App\Http\Resources\V1\Master;

use App\Constants\CertificationStatusConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class CertificationResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,

            "name" => $this->name,
            "detail" => $this->detail,
            "description" => $this->description,
            "link" => $this->link,
            "status" => $this->status,
            "status_label" => CertificationStatusConstant::LIST[$this->status],
            "created_at" => convertToTimezone($this->created_at),
           
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
        ];
    }
}