<?php

namespace App\Constants\Finance;

class InstallmentPeriodTypeConstant
{
    const MONTHLY = 1;
    const QUARTERLY = 2;
    const YEARLY = 3;

    const LIST = [
        self::MONTHLY => 'Monthly',
        self::QUARTERLY => 'Quarterly',
        self::YEARLY => 'Yearly',
    ];
}
