<?php

namespace App\Http\Resources\V1\Master;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Constants\SeminarStatusConstant;

class SeminarResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "name"=> $this->name,
            "link"=> $this->link,
            "description"=> $this->description,
            "started_at"=> convertToTimezone($this->started_at),
            "finished_at"=> convertToTimezone($this->finished_at),
            "created_at" => convertToTimezone($this->created_at),
            "status"=> $this->status,
            "status_label"=> SeminarStatusConstant::LIST[$this->status] ?? null,

            "cover" => new FileResource($this->whenLoaded("cover")),
            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        ];
    }

}