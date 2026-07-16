<?php

namespace App\Constants\Finance;

class PaymentStatusConstant
{
    const UNPAID = 1;
    const PARTIALLY_PAID = 2;
    const PAID = 3;
    const FAILED = 4;

    const LIST = [
        self::UNPAID => 'Unpaid',
        self::PARTIALLY_PAID => 'Partially Paid',
        self::PAID => 'Paid',
        self::FAILED => 'Failed/cancelled',
    ];
}
