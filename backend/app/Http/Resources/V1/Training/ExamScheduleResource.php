<?php

namespace App\Http\Resources\V1\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class ExamScheduleResource extends JsonResource {

public function toArray(Request $request): array{

    $mapping = [
        "id"=> $this->uuid,
        "created_at"=> convertToTimezone($this->created_at),
        "updated_at"=> convertToTimezone($this->updated_at),
        "deleted_at"=> convertToTimezone($this->deleted_at),
        "created_by"=> $this->created_by,
        "updated_by"=> $this->updated_by,
        "deleted_by"=> $this->deleted_by,
        "start_date"=> $this->start_date,
        "end_date"=> $this->end_date,

        "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
        "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
        "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        "user" => new UserResource($this->whenLoaded("user")) ,
        ];
return $mapping;
}

}
