<?php

namespace App\Http\Resources\V1\Base;


use App\Models\Base\UserFiles;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Constants\CertificationStatusConstant;
use App\Constants\UserFilesConstant;

class UserFilesResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->uuid,
            "description" => $this->description,
            "status" => $this->status,
            "status_label" => CertificationStatusConstant::LIST[$this->status] ?? null,
            "slug" => $this->slug,
            "type" => $this->type ?? null,
            "type_label" => UserFilesConstant::LIST[$this->type] ?? null,
            "created_at"=>convertToTimezone($this->created_at),
            "updated_at"=>convertToTimezone($this->updated_at),
            "file" => new FileResource($this->whenLoaded("file")),
            "user" => new UserResource($this->whenLoaded("user")),
        ];
    }
}
