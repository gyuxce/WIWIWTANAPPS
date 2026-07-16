<?php

namespace App\Constants\Finance;

class TransactionTrainingStatusConstant
{
    const PAID = 1;
    const DONATION = 2;
    const UNPAID = 3;
    const INSTALLMENT = 4;

    const LIST = [
        self::PAID => 'Lunas',
        self::DONATION => 'Bantuan Dana',
        self::UNPAID => 'Belum Bayar',
        self::INSTALLMENT => 'Proses Cicilan',
    ];
}
