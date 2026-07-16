<?php

namespace App\Http\Resources\V1\Base;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class FileResource extends JsonResource
{

    public function toArray(Request $request): array
    {

        return [
            "id" => $this->uuid,
            "created_at" => convertToTimezone($this->created_at),
            "updated_at" => convertToTimezone($this->updated_at),
            "adapter" => $this->adapter,
            "filename" => $this->filename,
            "url" => $this->url,
            "local_url" => $this->local_url,
            "height" => $this->height,
            "width" => $this->width,
            "size" => $this->size,

            "createdBy" => new UserResource($this->whenLoaded("createdBy")),
            "updatedBy" => new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy" => new UserResource($this->whenLoaded("deletedBy")),
        ];
    }
}
