<?php

namespace App\Http\Resources\V1\Finance;

use App\Constants\Finance\PriceTypeConstant;
use App\Constants\Training\TrainingPreferenceConstant;
use App\Http\Resources\V1\Base\FileResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Training\ProgramResource;
use App\Http\Resources\V1\Base\UserResource;


class PriceResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->uuid,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),
            "amount" => (int)($this->amount),
            "amount_label" => number_format($this->amount, 0, '.', '.'),
            "type"=> $this->type,
            "subtype"=> $this->subtype,
            "program_id"=> $this->program_id,
            "type_label" => PriceTypeConstant::LIST[$this->type] ?? null,
            "subtype_label" => TrainingPreferenceConstant::LIST[$this->subtype] ?? null,

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "program" => new ProgramResource($this->whenLoaded("program")) ,
            "trainingLetter" => new FileResource($this->whenLoaded("trainingLetter")) ,
            "installmentLetter" => new FileResource($this->whenLoaded("installmentLetter")) ,
        ];
    }

}
