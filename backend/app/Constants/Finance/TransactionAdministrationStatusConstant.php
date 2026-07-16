<?php

namespace App\Constants\Finance;

class TransactionAdministrationStatusConstant
{
    const PAID = 1;
    const INSTALLMENT = 2;
    const UNPAID = 3;

    const LIST = [
        self::PAID => 'Lunas',
        self::INSTALLMENT => 'Proses Cicilan',
        self::UNPAID => 'Belum Bayar',
    ];
}
