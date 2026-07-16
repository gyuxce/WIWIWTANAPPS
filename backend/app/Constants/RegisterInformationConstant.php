<?php

namespace App\Constants;

class RegisterInformationConstant{

    const INFO_REGISTER_FRIEND = 1;
    const INFO_REGISTER_INSTAGRAM = 2;
    const INFO_REGISTER_FACEBOOK = 3;
    const INFO_REGISTER_OTHERS = 4;

    const LIST = [
        self::INFO_REGISTER_FRIEND => 'Teman',
        self::INFO_REGISTER_INSTAGRAM => 'Instagram',
        self::INFO_REGISTER_FACEBOOK => 'Facebook',
        self::INFO_REGISTER_OTHERS => 'Lainnya',
    ];
}
