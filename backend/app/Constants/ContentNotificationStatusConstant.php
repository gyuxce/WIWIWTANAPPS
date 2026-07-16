<?php

namespace App\Constants;

class ContentNotificationStatusConstant
{
    const WAITING = 0;
    const SENT = 1;

    const LIST = [
        self::WAITING => 'Menunggu',
        self::SENT=> 'Terkirim',
    ];
}