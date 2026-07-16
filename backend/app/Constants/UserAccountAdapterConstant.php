<?php

namespace App\Constants;

class UserAccountAdapterConstant
{
    const GOOGLE = 1;
    const FACEBOOK = 2;
    const APPLE = 3;

    const LIST = [
        self::GOOGLE => 'Google Account',
        self::FACEBOOK => 'Facebook Account',
        self::APPLE => 'Apple Account',
    ];
}