<?php

namespace App\Http\Resources\V1\Training;

use App\Constants\Training\UserArticleStatusConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class UserArticleResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),

            "status" => $this->status,
            "status_label" => UserArticleStatusConstant::LIST[$this->status] ?? null,
            "duration" => $this->duration,
            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
