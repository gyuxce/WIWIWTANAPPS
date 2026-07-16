<?php

namespace App\Constants;

class SignInProviderFirebaseConstant
{
    const GOOGLE = 1;
    const FACEBOOK = 2;
    const APPLE = 3;

    const LIST = [
        self::GOOGLE => 'google.com',
        self::FACEBOOK => 'facebook.com',
        self::APPLE => 'apple.com',
    ];
}