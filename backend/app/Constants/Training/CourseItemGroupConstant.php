<?php

namespace App\Constants\Training;

class CourseItemGroupConstant{

    const COURSE_GROUP_MATERIAL = 1;
    const COURSE_GROUP_CLASS = 2;
    const COURSE_GROUP_ASSESMENT = 3;

    const LIST = [
        self::COURSE_GROUP_MATERIAL => 'Materi',
        self::COURSE_GROUP_CLASS => 'Kelas',
        self::COURSE_GROUP_ASSESMENT => 'Assesmen',
    ];
}
