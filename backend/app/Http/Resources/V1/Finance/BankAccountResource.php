<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class BankAccountResource extends JsonResource {

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
"name"=> $this->name,
"bank_id"=> $this->bank_id,
"account_name"=> $this->account_name,
"account_number"=> $this->account_number,
"is_active"=> $this->is_active,

"createdBy"=> new UserResource($this->whenLoaded("createdBy")),
"updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
"deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
"bank" => new BankResource($this->whenLoaded("bank")) ,
];
}

}
