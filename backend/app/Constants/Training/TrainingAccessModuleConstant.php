<?php

namespace App\Constants\Training;

class TrainingAccessModuleConstant{

    const ACCESS_ACTIVE_STUDENT = 1;
    const ACCESS_ALUMNI_STUDENT = 2;

    const LIST = [
        self::ACCESS_ACTIVE_STUDENT => 'Siswa Aktif',
        self::ACCESS_ALUMNI_STUDENT => 'Siswa Alumni',
    ];
}
