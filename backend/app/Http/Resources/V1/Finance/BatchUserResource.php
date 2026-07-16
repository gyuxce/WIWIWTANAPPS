<?php

namespace App\Http\Resources\V1\Finance;

use App\Constants\Finance\PaymentTypeConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Resources\V1\Base\UserResource;
use App\Http\Resources\V1\Base\FileResource;
use App\Constants\Finance\TransactionAdministrationStatusConstant;
use App\Constants\Finance\TransactionTrainingStatusConstant;
class BatchUserResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "id"=> $this->uuid,
            "number"=> $this->number,
            "from"=> $this->from,
            "to"=> $this->to,
            "remarks"=> $this->remarks,
            "status"=> $this->status,
            "transaction_status"=> $this->transaction_status,
            "transaction_last_at"=> $this->transaction_last_at,
            "transaction_due_at"=> $this->transaction_due_at,
            "transaction2_status"=> $this->transaction2_status,
            "transaction2_last_at"=> $this->transaction2_last_at,
            "transaction2_due_at"=> $this->transaction2_due_at,
            "transaction_status_administration"=> TransactionAdministrationStatusConstant::LIST[$this->transaction_status] ?? null,
            "transaction_status_training"=> TransactionTrainingStatusConstant::LIST[$this->transaction2_status] ?? null,
            "payment_type_administration"=> $this->payment_type_administration,
            "payment_type_training"=> $this->payment_type_training,
            "payment_type_administration_label"=> PaymentTypeConstant::LIST[$this->payment_type_administration] ?? null,
            "payment_type_training_label"=> PaymentTypeConstant::LIST[$this->payment_type_training] ?? null,
            
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "program" => new ProgramResource($this->whenLoaded("program")) ,
            "user" => new UserResource($this->whenLoaded("user")) ,
            "batch" => new BatchResource($this->whenLoaded("batch")) ,
            "transactionAdministration" => new TransactionResource($this->whenLoaded("transactionAdministration")) ,
            "transactionTraining" => new TransactionResource($this->whenLoaded("transactionTraining")) ,
            "file" => new FileResource($this->whenLoaded("file")) ,
        ];
    }

}