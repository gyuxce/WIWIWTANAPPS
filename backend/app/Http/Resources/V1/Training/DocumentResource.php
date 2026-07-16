<?php

namespace App\Http\Resources\V1\Training;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class DocumentResource extends JsonResource {

public function toArray(Request $request): array{

return [
"id"=> $this->uuid,
"uuid"=> $this->uuid,
"created_at"=> convertToTimezone($this->created_at),
"updated_at"=> convertToTimezone($this->updated_at),
"deleted_at"=> convertToTimezone($this->deleted_at),
"created_by"=> $this->created_by,
"updated_by"=> $this->updated_by,
"deleted_by"=> $this->deleted_by,
"user_id"=> $this->user_id,
"type"=> $this->type,
"remarks"=> $this->remarks,
"file_id"=> $this->file_id,
"is_verified"=> $this->is_verified,
"verified_by"=> $this->verified_by,
"verified_at"=> convertToTimezone($this->verified_at),

"createdBy"=> new UserResource($this->whenLoaded("createdBy")),
"updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
"deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
];
}

}
