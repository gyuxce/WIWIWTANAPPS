<?php

namespace App\Repositories\Finance;

use App\Constants\Finance\InstallmentPeriodTypeConstant;
use App\Models\Finance\Installment;
use App\Repositories\BaseRepository;

class InstallmentRepository extends BaseRepository
{
    public function createInstallment($data)
    {
        $totalInstallment = config('pivot-payment.installment_total');
        $dtoInstallment = [
            "index" => 1,
            "transaction_id" => $data['transaction']->id,
            "period_type" => InstallmentPeriodTypeConstant::MONTHLY,
            "period_length" => $totalInstallment
        ];
        $query = Installment::create($dtoInstallment);
        return $query;
    }
}