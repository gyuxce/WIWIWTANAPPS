<?php

namespace App\Constants\Finance;

class PaymentProofStatusConstant
{
    const SUBMITTED = 1;
    const APPROVED = 2;
    const DENIED = 3;

    const LIST = [
        self::SUBMITTED => 'Submitted',
        self::APPROVED => 'Approved',
        self::DENIED => 'Denied',
    ];
}
