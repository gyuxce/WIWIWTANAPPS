<?php

namespace App\Constants\Forum;

class ForumReportTypeConstant{

    const TYPE_POST = 1;
    const TYPE_COMMENT = 2;

    const LIST = [
        self::TYPE_POST => 'Postingan',
        self::TYPE_COMMENT => 'Komentar',
    ];
}
