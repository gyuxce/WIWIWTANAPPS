<?php

namespace App\Constants;

class ForumCommentConstant{

    const PUBLISH = 1;
    const DRAFT = 0;
    const LIST_STATUS_PUBLISH = [
        self::PUBLISH => 'Publish',
        self::DRAFT => 'Draft',
    ];
}
