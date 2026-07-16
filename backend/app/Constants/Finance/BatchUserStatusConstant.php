<?php

namespace App\Constants\Finance;

class BatchUserStatusConstant
{
    const ADMITTED = 1;
    const VERIFIED = 2;
    const PAID = 3;
    const ONGOING = 4;
    const FINISHED = 5;
    const CANCELLED = 6;
    
    const LIST = [
        self::ADMITTED => 'Admitted',
        self::VERIFIED => 'Verified',
        self::PAID => 'Paid',
        self::ONGOING => 'Ongoing',
        self::FINISHED => 'Finished',
        self::CANCELLED => 'Expired/cancelled',
    ];
}
