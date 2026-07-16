<?php

namespace App\Constants;

class CertificationStudentStatusConstant
{
    const WAITING = 0;
    const SUCCESS = 1;
    const FAIL = 2;

    const LIST = [
        self::WAITING => 'Menunggu',
        self::SUCCESS => 'Lulus',
        self::FAIL => 'Tidak Lulus',
    ];
}