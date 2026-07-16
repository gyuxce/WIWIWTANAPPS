<?php

namespace App\Http\Resources\V1\Finance;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Constants\Finance\InstallmentPeriodTypeConstant;

class InstallmentMobileResource extends JsonResource {

    public function toArray(Request $request): array{
        return [
            "period_type"=> $this->period_type,
            "period_type_label"=> InstallmentPeriodTypeConstant::LIST[$this->period_type] ?? null,
            "period_length"=> $this->period_length,
            "index"=> $this->index,
        ];
    }

}