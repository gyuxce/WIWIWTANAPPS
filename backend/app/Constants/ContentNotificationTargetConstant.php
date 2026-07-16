<?php

namespace App\Constants;

class ContentNotificationTargetConstant
{
    const EACH_USER = 0;
    const ALL_USER = 1;

    const LIST = [
        self::EACH_USER => 'Per User',
        self::ALL_USER=> 'Semua User',
    ];
}