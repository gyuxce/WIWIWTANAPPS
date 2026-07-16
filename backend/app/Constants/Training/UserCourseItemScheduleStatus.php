<?php

namespace App\Constants\Training;

class UserCourseItemScheduleStatus
{

    const NOT_SCHEDULED = 0;
    const SCHEDULED = 1;

    const LIST = [
        self::NOT_SCHEDULED => 'Belum Terjadwal',
        self::SCHEDULED => 'Sudah Terjadwal',
    ];
}
