<?php

namespace App\Constants\Training;

class InterviewStatusConstant
{

    const FINISHED = 1;
    const WAITING = 2;
    const TIDAKLULUS = 3;
    const REVIEWED = 4;


    const LIST = [
        self::FINISHED => 'Lulus',
        self::TIDAKLULUS => "Tidak lulus",
        self::WAITING => 'Menuggu',
        self::REVIEWED => "Review"
    ];
}
