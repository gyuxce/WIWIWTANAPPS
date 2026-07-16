<?php

namespace App\Constants\Training;

class UserExamStatusConstant
{
    const SELESAI = 1;
    const MENUNGGUTEST = 2;
    const MENUNGGUHASIL = 3;
    const MENUGGU = 4;
    const LULUS = 5;
    const TIDAKLULUS = 6;
    const WAITING = 7;

    const LIST = [
        self::SELESAI => 'Selesai',
        self::MENUNGGUTEST => 'Menuggu Test',
        self::MENUNGGUHASIL => 'Menunggu Hasil',
        self::LULUS => 'Lulus',
        self::TIDAKLULUS => 'Tidak Lulus',
        self::WAITING => 'Menunggu',
    ];
}
