<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Resources\V1\Base\UserResource;


class TransactionItemResource extends JsonResource {

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
"transaction_id"=> $this->transaction_id,
"program_id"=> $this->program_id,
"title"=> $this->title,
"description"=> $this->description,
"amount"=> $this->amount,
"quantity"=> $this->quantity,
"is_tax"=> $this->is_tax,
"total"=> $this->total,

"createdBy"=> new UserResource($this->whenLoaded("createdBy")),
"updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
"deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
"transaction" => new TransactionResource($this->whenLoaded("transaction")) ,
"program" => new ProgramResource($this->whenLoaded("program")) ,
];
}

}
