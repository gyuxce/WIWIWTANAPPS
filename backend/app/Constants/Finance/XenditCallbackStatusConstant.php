<?php

namespace App\Constants\Finance;

class XenditCallbackStatusConstant
{
    const PAID = 1;
    const EXPIRED = 2;
    const PENDING = 3;

    const LIST = [
        self::PAID => 'PAID',
        self::EXPIRED => 'EXPIRED',
        self::PENDING => 'PENDING',
    ];
}
