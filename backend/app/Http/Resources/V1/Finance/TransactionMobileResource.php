<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionMobileResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->id,
            "number"=> $this->number,
            "price_type"=> $this->price_type,
            "issued_at"=> convertToTimezone($this->issued_at),
            "expired_at"=> convertToTimezone($this->expired_at),
            "currency_code"=> $this->currency_code,
            "total_amount"=> $this->total_amount,
            "total"=> $this->total,
            "total_left_amount"=> $this->total_left_amount,
            "status"=> $this->status,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "installment" => new InstallmentMobileResource($this->whenLoaded('installment')),
            "payments" => PaymentMobilePivotResource::collection($this->whenLoaded('payments')),
            "paymentProofs" => PaymentProofMobileResource::collection($this->whenLoaded('payment_proofs')),
        ];
    }

}