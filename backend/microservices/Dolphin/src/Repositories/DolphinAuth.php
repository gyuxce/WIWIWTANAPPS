<?php

namespace DolphinMicroservice\Repositories;

use Illuminate\Support\Facades\Auth;

class DolphinAuth
{
    static $id;
    static $issuedAt;
    static $expiredAt;
    static $uuid;
    static $check;

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