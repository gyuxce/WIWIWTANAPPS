<?php

namespace App\Constants\Training;

class TrainingPreferenceConstant{

    const ONLINE = 1;
    const OFFLINE = 2;

    const LIST = [
        self::ONLINE => 'Online',
        self::OFFLINE => 'Offline',
    ];
}
