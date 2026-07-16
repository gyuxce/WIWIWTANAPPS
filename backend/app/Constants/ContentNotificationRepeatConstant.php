<?php

namespace App\Constants;

class ContentNotificationRepeatConstant
{
    const ONCE = 1;
    const ONCE_A_WEEK = 2;
    const ONCE_A_MONTH = 3;

    const LIST = [
        self::ONCE=> 'Sekali Saja',
        self::ONCE_A_WEEK => '1 Minggu Sekali',
        self::ONCE_A_MONTH=> '1 Bulan Sekali',
    ];
}