<?php

namespace App\Services\Dolphin;

use Illuminate\Support\Facades\Auth;

class DolphinAuth
{
    static $id, $issued_at, $expired_at, $uuid, $check;

    public static function check()
    {
        if (!self::$check) {
            Auth::loginUsingId(self::$id);
        }

        self::$check = true;
    }

    public static function user()
    {
        self::check();
        return Auth::user();
    }

    public static function id()
    {
        self::check();
        return Auth::id();
    }
}