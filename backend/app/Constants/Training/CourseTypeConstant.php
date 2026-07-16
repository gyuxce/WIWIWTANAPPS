<?php

namespace App\Constants\Training;

class CourseTypeConstant{

    const TYPE_TEORI = 1;
    const TYPE_PRAKTIK = 2;
    const TYPE_SOFTSKILL = 3;

    const LIST = [
        self::TYPE_TEORI => 'Teori',
        self::TYPE_PRAKTIK => 'Praktik',
        self::TYPE_SOFTSKILL => 'Soft Skill',
    ];
}
