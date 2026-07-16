<?php

namespace App\Http\Resources\V1\Finance;

use App\Constants\LanguageSettingConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class PaymentContentItemResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->uuid,
            "title" => $this->title,
            "description" => $this->description,
            "index"=> $this->index,
            "is_header"=> $this->is_header,
            "language_type" => $this->language_type,
            "language_type_label" => LanguageSettingConstant::LIST[$this->language_type] ?? null,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "paymentContent" => new PaymentContentResource($this->whenLoaded("paymentContent")) ,
            "child" =>  PaymentContentItemResource::collection($this->whenLoaded("child")) ,
        ];
    }

}
