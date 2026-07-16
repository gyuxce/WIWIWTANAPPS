<?php

namespace App\Constants;

class SeminarStatusConstant
{
    const ACTIVE = 1;
    const INACTIVE = 0;

    const LIST = [
        self::ACTIVE => 'Aktif',
        self::INACTIVE => 'Tidak Aktif',
    ];
}
