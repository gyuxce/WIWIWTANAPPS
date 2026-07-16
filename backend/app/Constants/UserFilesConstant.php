<?php

namespace App\Constants;

class UserFilesConstant
{
    const PELATIHAN = 1;
    const TES_BAHASA = 2;
    const TES_KARAKTER = 3;
    const PEMBAYARAN = 4;
    const SERTIFIKASI_BAHASA_JEPANG = 5;

    const LIST = [
        self::PELATIHAN => 'Pelatihan',
        self::TES_BAHASA => 'Tes Bahasa',
        self::TES_KARAKTER => 'Tes Karakter',
        self::PEMBAYARAN => 'Pembayaran',
        self::SERTIFIKASI_BAHASA_JEPANG => 'Sertifikasi Bahasa Jepang',
    ];
}
