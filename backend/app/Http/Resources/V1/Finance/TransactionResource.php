<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;

class TransactionResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "number"=> $this->number,
            "issued_at"=> convertToTimezone($this->issued_at),
            "expired_at"=> convertToTimezone($this->expired_at),
            "currency_code"=> $this->currency_code,
            "total_amount"=> $this->total_amount,
            "total"=> $this->total,
            "total_left_amount"=> $this->total_left_amount,
            "status"=> $this->status,
            "xendit_plan_id"=> $this->xendit_plan_id,
            "xendit_customer_id"=> $this->xendit_customer_id,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "user" => new UserResource($this->whenLoaded("user")),
            "installments" => InstallmentResource::collection($this->whenLoaded('installments')),
            "payments" => PaymentResource::collection($this->whenLoaded('payments')),
            "paymentProofs" => PaymentProofResource::collection($this->whenLoaded('payment_proofs')),
        ];
    }

}