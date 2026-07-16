<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Finance\InstallmentPeriodTypeConstant;

class InstallmentResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "period_type"=> $this->period_type,
            "period_type_label"=> InstallmentPeriodTypeConstant::LIST[$this->period_type] ?? null,
            "period_length"=> $this->period_length,
            "payment_first_id"=> $this->payment_first_id,
            "payment_first_at"=> convertToTimezone($this->payment_first_at),
            "payment_next_id"=> $this->payment_next_id,
            "payment_next_at"=> convertToTimezone($this->payment_next_at),
            "payment_last_id"=> $this->payment_last_id,
            "payment_last_at"=> convertToTimezone($this->payment_last_at),
            "is_paid"=> $this->is_paid,
            "index"=> $this->index,
            "file_id"=> $this->file_id,
            "file2_id"=> $this->file2_id,
            "file3_id"=> $this->file3_id,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "transaction" => new TransactionResource($this->whenLoaded("transaction")) ,
            "file" => new FileResource($this->whenLoaded("file")) ,
            "payments" => PaymentResource::collection($this->whenLoaded('payments')),
            "paymentProofs" => PaymentProofResource::collection($this->whenLoaded('payment_proofs')),

        ];
    }

}