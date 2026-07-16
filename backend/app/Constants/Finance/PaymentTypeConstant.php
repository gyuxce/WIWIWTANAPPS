<?php

namespace App\Constants\Finance;

class PaymentTypeConstant
{
    const FULL = 1;
    const INSTALLMENT = 2;

    const LIST = [
        self::FULL => 'Pembayaran Penuh',
        self::INSTALLMENT => 'Cicilan',
    ];
}
