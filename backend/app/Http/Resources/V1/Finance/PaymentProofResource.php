<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Constants\Finance\PaymentProofStatusConstant;

class PaymentProofResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "user_id"=> $this->user_id,
            "date"=> $this->date,
            "adapter"=> $this->adapter,
            "currency_code"=> $this->currency_code,
            "amount"=> $this->amount,
            "from_bank_id"=> $this->from_bank_id,
            "from_account_number"=> $this->from_account_number,
            "from_account_name"=> $this->from_account_name,
            "to_bank_id"=> $this->to_bank_id,
            "to_account_number"=> $this->to_account_number,
            "to_account_name"=> $this->to_account_name,
            "status"=> $this->status,
            "status_label"=> PaymentProofStatusConstant::LIST[$this->status] ?? null,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "transaction" => new TransactionResource($this->whenLoaded("transaction")) ,
            "installment" => new InstallmentResource($this->whenLoaded("installment")) ,
            "fromBank" => new BankResource($this->whenLoaded("fromBank")) ,
            "toBank" => new BankResource($this->whenLoaded("toBank")) ,
            "file" => new FileResource($this->whenLoaded("file")) ,
        ];
    }

}