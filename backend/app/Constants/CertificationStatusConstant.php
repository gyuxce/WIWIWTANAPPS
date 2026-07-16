<?php

namespace App\Constants;

class CertificationStatusConstant
{
    const WAITING = 0;
    const SUCCESS = 1;

    const LIST = [
        self::WAITING => 'Tidak Aktif',
        self::SUCCESS => 'Aktif',
    ];
}