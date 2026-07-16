<?php

namespace App\Constants;

class PhaseSettingConstant
{

    const PHASE_PRA_TEST = 1;
    const PHASE_PAYMENT = 2;
    const PHASE_TRAINING = 3;
    const PHASE_JAPANESE_CERTIFICATION = 4;
    const PHASE_INTERVIEW = 5;

    const LIST = [
        self::PHASE_PRA_TEST => 'Pra Tes',
        self::PHASE_PAYMENT => 'Pembayaran',
        self::PHASE_TRAINING => 'Pelatihan',
        self::PHASE_JAPANESE_CERTIFICATION => 'Sertifikasi Bahasa Jepang',
        self::PHASE_INTERVIEW => 'Interview',
    ];
}
