<?php

namespace App\Http\Resources\V1\Finance;

use App\Constants\Finance\PaymentTypeConstant;
use App\Constants\Finance\PriceTypeConstant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\V1\Base\UserResource;


class PaymentDetailResource extends JsonResource {

    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->uuid,
            "number" => $this->number,
            "checkout_url" => $this->checkout_url,
            "expired_at"=> convertToTimezone($this->expired_at),
            "paid_at"=> convertToTimezone($this->paid_at),
            "data_request"=> $this->data_request,
            "data_callback"=> $this->data_callback,
            "created_at"=> convertToTimezone($this->created_at),
            "updated_at"=> convertToTimezone($this->updated_at),
            "deleted_at"=> convertToTimezone($this->deleted_at),

            "createdBy"=> new UserResource($this->whenLoaded("createdBy")),
            "updatedBy"=> new UserResource($this->whenLoaded("updatedBy")),
            "deletedBy"=> new UserResource($this->whenLoaded("deletedBy")),
        ];
    }

}
