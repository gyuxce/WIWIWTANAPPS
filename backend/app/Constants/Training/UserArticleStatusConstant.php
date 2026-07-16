<?php

namespace App\Constants\Training;

class UserArticleStatusConstant
{

    const FINISH = 1;
    const PROGRESS = 2;

    const LIST = [
        self::FINISH => 'SELESAI',
        self::PROGRESS => 'PROGRESS',
    ];
}
