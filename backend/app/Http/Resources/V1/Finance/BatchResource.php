<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Resources\V1\Base\UserResource;

class BatchResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "title"=> $this->title,
            "period"=> $this->period,
            "from"=> $this->from,
            "to"=> $this->to,
            "remarks"=> $this->remarks,
            "capacity"=> $this->capacity,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "program" => new ProgramResource($this->whenLoaded("program")) ,
        ];
    }

}