<?php

namespace App\Constants\Training;

class UserCourseItemStatusConstant
{
    const FINISHED = 1;
    const PROGRESS = 2;
    const WAITING = 3;
    const REPEAT = 4;

    const LIST = [
        self::FINISHED => 'Selesai',
        self::PROGRESS => 'Sedang Mengerjakan',
        self::WAITING => 'Menuggu Hasil',
        self::REPEAT => 'Ulangi',
    ];
}
