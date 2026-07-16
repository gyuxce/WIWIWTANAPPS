<?php

namespace App\Constants;

class BloodTypeConstant{

    const BLOODTYPE_A = 1;
    const BLOODTYPE_B = 2;
    const BLOODTYPE_AB = 3;
    const BLOODTYPE_O = 4;

    const LIST = [
        self::BLOODTYPE_A => 'A',
        self::BLOODTYPE_B => 'B',
        self::BLOODTYPE_AB => 'AB',
        self::BLOODTYPE_O => 'O',
    ];
}
