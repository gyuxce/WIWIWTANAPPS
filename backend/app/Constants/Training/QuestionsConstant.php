<?php

namespace App\Constants\Training;

class QuestionsConstant
{

    const MULTI_CHOICE = 1;
    const MULTI_CHOICE_VALUE = 2;
    const ESAI = 3;
    const AUDIO = 4;
    const IMAGE = 5;
    const WRITE = 6;

    const LIST = [
        self::MULTI_CHOICE => 'Multi Choice',
        self::MULTI_CHOICE_VALUE => 'Multi Choice VALUE',
        self::ESAI => 'Esai',
        self::AUDIO => 'Audio',
        self::IMAGE => 'Image',
        self::WRITE => 'Writing',
    ];
}
