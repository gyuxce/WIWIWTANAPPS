<?php

namespace App\Http\Resources\V1\Finance;

use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class PaymentContentResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->uuid,
            "title" => $this->title,
            "description" => $this->description,
            "total_content"=> $this->total_content,
            "price_type"=> $this->price_type,
            "payment_type"=> $this->payment_type,
            "price_type_label" => PriceTypeConstant::LIST[$this->price_type] ?? null,
            "payment_type_label" => PaymentTypeConstant::LIST[$this->payment_type] ?? null,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
            "items" => PaymentContentItemResource::collection($this->whenLoaded("items")),
        ];
    }

}
