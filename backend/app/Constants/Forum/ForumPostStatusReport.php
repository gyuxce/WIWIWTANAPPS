<?php

namespace App\Constants\Forum;

class ForumPostStatusReport{

    const STATUS_WAITING = 1;
    const STATUS_DELETED = 2;

    const LIST = [
        self::STATUS_WAITING => 'Menunggu',
        self::STATUS_DELETED => 'Dihapus',
    ];
}
