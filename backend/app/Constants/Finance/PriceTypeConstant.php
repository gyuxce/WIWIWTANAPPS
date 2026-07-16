<?php

namespace App\Constants\Finance;

class PriceTypeConstant
{
    const ADMINSTRATION = 1;
    const TRAINING = 2;

    const LIST = [
        self::ADMINSTRATION => 'Administrasi',
        self::TRAINING => 'Pelatihan',
    ];
}
