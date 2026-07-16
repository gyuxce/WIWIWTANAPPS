<?php

namespace App\Constants\Finance;

class PivotPaymentMethodConstant
{
    const VIRTUAL_ACCOUNT = 1;
    const QR = 2;
    const CARD = 3;
    const WALLET= 4;

    const LIST = [
        self::VIRTUAL_ACCOUNT => 'virtualAccount',
        self::QR => 'qr',
        self::CARD => 'card',
        self::WALLET => 'wallet'
    ];
}
